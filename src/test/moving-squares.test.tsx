import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Navigation } from '../components/Navigation';

/**
 * The mobile-menu canvas (MovingSquares). Regression guard for the mobile bug
 * WarpField already had fixed: scrolling collapses the URL bar, which fires
 * `resize` with only the HEIGHT changed; that must not re-seed the squares.
 */

const ctx = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  save: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  fillRect: vi.fn(),
  restore: vi.fn(),
  set fillStyle(_v: unknown) {},
  set globalAlpha(_v: unknown) {},
};

let box = { w: 280, h: 500 };
let rafQueue: FrameRequestCallback[] = [];

function setup(reducedMotion = false) {
  box = { w: 280, h: 500 };
  rafQueue = [];
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => box.w);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => box.h);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    rafQueue.push(cb);
    return rafQueue.length;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: reducedMotion && query.includes('reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
}

const runFrame = () => {
  const pending = rafQueue;
  rafQueue = [];
  pending.forEach((cb) => cb(performance.now() + 16));
};

async function openMenu() {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );
  await userEvent.setup().click(document.querySelector('button[aria-label="Open menu"]') as HTMLElement);
  let canvas: HTMLCanvasElement | null = null;
  await waitFor(() => {
    canvas = document.querySelector('[data-slot="sheet-content"] canvas');
    expect(canvas).not.toBeNull();
  });
  return canvas as unknown as HTMLCanvasElement;
}

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(document, 'hidden', { value: false, configurable: true });
});

describe('MovingSquares', () => {
  it('keeps its squares on a height-only resize and re-seeds on a width change', async () => {
    setup();
    const canvas = await openMenu();
    runFrame();
    const random = vi.spyOn(Math, 'random');

    // URL bar collapse: height-only resize rescales the buffer, no re-seed
    box = { w: 280, h: 560 };
    window.dispatchEvent(new Event('resize'));
    expect(canvas.height).toBe(560);
    expect(random).not.toHaveBeenCalled();

    // nothing changed at all: nothing to do
    const transforms = ctx.setTransform.mock.calls.length;
    window.dispatchEvent(new Event('resize'));
    expect(ctx.setTransform.mock.calls.length).toBe(transforms);

    // orientation change: new width re-seeds
    box = { w: 390, h: 560 };
    window.dispatchEvent(new Event('resize'));
    expect(canvas.width).toBe(390);
    expect(random).toHaveBeenCalled();
  });

  it('caps the backing store at 2x on very dense screens', async () => {
    setup();
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(3);
    const canvas = await openMenu();
    expect(canvas.width).toBe(280 * 2);
  });

  it('pauses while the tab is hidden and resumes when visible', async () => {
    setup();
    await openMenu();
    runFrame(); // loop is running: it queued the next frame
    expect(rafQueue.length).toBeGreaterThan(0);

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    runFrame(); // draws, then stops instead of re-queuing
    expect(rafQueue).toHaveLength(0);

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(rafQueue.length).toBe(1);
  });

  it('draws one static frame under prefers-reduced-motion', async () => {
    setup(true);
    await openMenu();
    ctx.fillRect.mockClear();
    runFrame();
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(rafQueue).toHaveLength(0); // no loop
    document.dispatchEvent(new Event('visibilitychange'));
    expect(rafQueue).toHaveLength(0); // and visibility does not start one
  });
});

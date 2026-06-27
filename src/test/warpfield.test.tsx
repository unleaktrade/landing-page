import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { WarpField } from '../components/WarpField';

/**
 * WarpField renders a WebGL canvas that no-ops under a missing context. jsdom has
 * no real WebGL, so we install a Proxy-based GL mock that satisfies the feature
 * guard (`typeof gl.createProgram === 'function'`) and turns every GL call into a
 * safe no-op. This drives the full lifecycle (build → draw → resize → visibility
 * → context loss/restore) so the component is actually exercised in tests.
 */
function makeGLMock() {
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (typeof prop !== 'string') return undefined;
        // GL enum constants are ALL-CAPS identifiers → return a number
        if (/^[A-Z0-9_]+$/.test(prop)) return 1;
        // everything else is a method → no-op returning a truthy handle
        return () => ({});
      },
    }
  );
}

function mockRaf() {
  let queue: FrameRequestCallback[] = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    queue.push(cb);
    return queue.length;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  return (waves = 3, t0 = 0) => {
    for (let i = 0; i < waves; i++) {
      const pending = queue;
      queue = [];
      pending.forEach((cb) => cb(t0 + (i + 1) * 50));
    }
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('WarpField', () => {
  it('runs the full WebGL lifecycle without throwing', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock() as unknown as RenderingContext
    );
    const flush = mockRaf();

    const { unmount } = render(<WarpField />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();

    // a few animation frames → exercises draw()
    flush();

    // width change → rebuild path; height-only change → early-return path
    (window as { innerWidth: number }).innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    flush();
    window.dispatchEvent(new Event('resize')); // same width now → no rebuild
    flush();

    // tab hidden then visible → stop()/start()
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    flush();

    // GL context loss + restore recovery
    canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    canvas.dispatchEvent(new Event('webglcontextrestored'));
    flush();

    expect(() => unmount()).not.toThrow();
  });

  it('renders a single static frame under prefers-reduced-motion', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock() as unknown as RenderingContext
    );
    mockRaf();

    expect(() => {
      const { unmount } = render(<WarpField />);
      unmount();
    }).not.toThrow();
  });

  it('bails gracefully when WebGL is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(() => {
      const { unmount } = render(<WarpField />);
      unmount();
    }).not.toThrow();
  });
});

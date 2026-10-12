import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { WarpField, nextDrawTime } from '../components/WarpField';

/**
 * WarpField renders a WebGL canvas that no-ops under a missing context. jsdom has
 * no real WebGL, so we install a Proxy-based GL mock that satisfies the feature
 * guard (`typeof gl.createProgram === 'function'`) and turns every GL call into a
 * safe no-op. This drives the full lifecycle (build → draw → resize → visibility
 * → context loss/restore) so the component is actually exercised in tests.
 */
function makeGLMock(overrides: Record<string, unknown> = {}) {
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (typeof prop !== 'string') return undefined;
        if (prop in overrides) return overrides[prop];
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

// GL setup is deferred to an idle callback; run it synchronously in tests.
function mockIdle() {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  w.requestIdleCallback = (cb) => {
    cb();
    return 1;
  };
  w.cancelIdleCallback = vi.fn();
}

function mockMotionQuery(matches: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = [];
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => listeners.push(cb),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
  return (next: boolean) => listeners.forEach((cb) => cb({ matches: next }));
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  const w = window as Window & { requestIdleCallback?: unknown; cancelIdleCallback?: unknown };
  delete w.requestIdleCallback;
  delete w.cancelIdleCallback;
});

describe('nextDrawTime (30fps pacing on a 60Hz display)', () => {
  const MIN = 1000 / 30;

  it('skips vsyncs that come before the interval', () => {
    expect(nextDrawTime(1016.7, 1000, MIN)).toBeNull();
  });

  it('carries the remainder so every 2nd vsync draws, steadily', () => {
    // simulate 60Hz vsyncs with small timestamp jitter
    let last = 0;
    let now = 0;
    const drawnAt: number[] = [];
    last = nextDrawTime(now, last, MIN)!; // first frame resyncs
    for (let i = 1; i <= 120; i++) {
      now = i * (1000 / 60) + (i % 3 === 0 ? 0.4 : -0.3);
      const next = nextDrawTime(now, last, MIN);
      if (next !== null) {
        last = next;
        drawnAt.push(i);
      }
    }
    const gaps = drawnAt.slice(1).map((v, i) => v - drawnAt[i]);
    // the old `lastDraw = now` logic alternated 2- and 3-vsync gaps here
    expect(new Set(gaps)).toEqual(new Set([2]));
    expect(drawnAt.length).toBeGreaterThanOrEqual(59);
  });

  it('resyncs after a long stall instead of bursting', () => {
    expect(nextDrawTime(5000, 1000, MIN)).toBe(5000);
  });
});

describe('WarpField', () => {
  it('runs the full WebGL lifecycle without throwing', () => {
    const gl = makeGLMock({ drawArrays: vi.fn(), viewport: vi.fn() });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      gl as unknown as RenderingContext
    );
    mockIdle();
    const flush = mockRaf();

    const { unmount } = render(<WarpField />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();

    // a few animation frames → exercises draw()
    flush();
    expect((gl as unknown as { drawArrays: ReturnType<typeof vi.fn> }).drawArrays).toHaveBeenCalled();
    const viewport = (gl as unknown as { viewport: ReturnType<typeof vi.fn> }).viewport;
    const sized = viewport.mock.calls.length;

    // width change → rebuild path; height-only change → early-return path
    (window as { innerWidth: number }).innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    flush();
    const afterWidthChange = viewport.mock.calls.length;
    expect(afterWidthChange).toBeGreaterThan(sized);
    window.dispatchEvent(new Event('resize')); // same box now → buffer untouched
    flush();
    expect(viewport.mock.calls.length).toBe(afterWidthChange);

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
    mockMotionQuery(true);
    const drawArrays = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock({ drawArrays }) as unknown as RenderingContext
    );
    mockIdle();
    const flush = mockRaf();

    const { unmount } = render(<WarpField />);
    const staticDraws = drawArrays.mock.calls.length;
    expect(staticDraws).toBeGreaterThan(0); // one frame: 3 draw calls
    flush();
    expect(drawArrays.mock.calls.length).toBe(staticDraws); // and no loop
    // a resize redraws the static frame
    (window as { innerWidth: number }).innerWidth = 777;
    window.dispatchEvent(new Event('resize'));
    flush(1);
    expect(drawArrays.mock.calls.length).toBeGreaterThan(staticDraws);
    expect(() => unmount()).not.toThrow();
  });

  it('follows a live prefers-reduced-motion change both ways', () => {
    const setMotion = mockMotionQuery(false);
    const drawArrays = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock({ drawArrays }) as unknown as RenderingContext
    );
    mockIdle();
    const flush = mockRaf();
    render(<WarpField />);
    flush();
    const animated = drawArrays.mock.calls.length;
    expect(animated).toBeGreaterThan(0);

    setMotion(true); // stop + one static frame
    const frozen = drawArrays.mock.calls.length;
    expect(frozen).toBeGreaterThan(animated);
    flush();
    expect(drawArrays.mock.calls.length).toBe(frozen);

    setMotion(false); // resumes the loop
    flush();
    expect(drawArrays.mock.calls.length).toBeGreaterThan(frozen);
  });

  it('leaves the black canvas when a shader program fails to link', () => {
    const drawArrays = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock({ drawArrays, getProgramParameter: () => false }) as unknown as RenderingContext
    );
    mockIdle();
    const flush = mockRaf();
    const { unmount } = render(<WarpField />);
    flush();
    expect(drawArrays).not.toHaveBeenCalled();
    expect(() => unmount()).not.toThrow();
  });

  it('defers GL setup with a timer when requestIdleCallback is missing', () => {
    vi.useFakeTimers();
    const drawArrays = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock({ drawArrays }) as unknown as RenderingContext
    );
    const flush = mockRaf();
    const { unmount } = render(<WarpField />);
    flush();
    expect(drawArrays).not.toHaveBeenCalled(); // nothing before first paint
    vi.advanceTimersByTime(250);
    flush();
    expect(drawArrays).toHaveBeenCalled();
    unmount();
    vi.useRealTimers();
  });

  it('cancels a pending deferred setup on unmount', () => {
    vi.useFakeTimers();
    const createProgram = vi.fn(() => ({}));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      makeGLMock({ createProgram }) as unknown as RenderingContext
    );
    mockRaf();
    const { unmount } = render(<WarpField />);
    unmount();
    vi.advanceTimersByTime(250);
    expect(createProgram).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('bails gracefully when WebGL is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(() => {
      const { unmount } = render(<WarpField />);
      unmount();
    }).not.toThrow();
  });
});

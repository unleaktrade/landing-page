import { describe, it, expect, afterEach, vi } from 'vitest';
import type { TurnstileApi } from '../components/utils/turnstile';

const fakeApi: TurnstileApi = { render: vi.fn(), reset: vi.fn(), remove: vi.fn() };

async function freshLoader() {
  vi.resetModules();
  return (await import('../components/utils/turnstile')).loadTurnstile;
}

function injectedScripts() {
  return document.head.querySelectorAll('script[src^="https://challenges.cloudflare.com/"]');
}

afterEach(() => {
  delete window.turnstile;
  injectedScripts().forEach((s) => s.remove());
});

describe('loadTurnstile', () => {
  it('returns the API at once when it is already on the page', async () => {
    window.turnstile = fakeApi;
    const loadTurnstile = await freshLoader();
    await expect(loadTurnstile()).resolves.toBe(fakeApi);
    expect(injectedScripts()).toHaveLength(0);
  });

  it('injects the explicit-render script once and resolves on load', async () => {
    const loadTurnstile = await freshLoader();
    const first = loadTurnstile();
    const second = loadTurnstile();
    const scripts = injectedScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('src')).toBe('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
    window.turnstile = fakeApi;
    scripts[0].dispatchEvent(new Event('load'));
    await expect(first).resolves.toBe(fakeApi);
    expect(second).toBe(first);
  });

  it('rejects when the script loads without the API', async () => {
    const loadTurnstile = await freshLoader();
    const p = loadTurnstile();
    injectedScripts()[0].dispatchEvent(new Event('load'));
    await expect(p).rejects.toThrow(/missing/);
  });

  it('rejects on a network error and retries on the next call', async () => {
    const loadTurnstile = await freshLoader();
    const p = loadTurnstile();
    injectedScripts()[0].dispatchEvent(new Event('error'));
    await expect(p).rejects.toThrow(/failed/);
    expect(injectedScripts()).toHaveLength(0);
    loadTurnstile();
    expect(injectedScripts()).toHaveLength(1);
  });
});

// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { buildCsp } from '../seo/csp';
import { API_BASE_URL } from '../components/utils/links';

const directives = new Map(
  buildCsp()
    .split(';')
    .map((d) => {
      const [name = '', ...sources] = d.trim().split(/\s+/);
      return [name, sources] as const;
    }),
);

describe('content security policy', () => {
  it('forbids inline and eval script execution', () => {
    const script = directives.get('script-src') ?? [];
    expect(script).toContain("'self'");
    expect(script).not.toContain("'unsafe-inline'");
    expect(script).not.toContain("'unsafe-eval'");
    expect(directives.get('object-src')).toEqual(["'none'"]);
    expect(directives.get('base-uri')).toEqual(["'self'"]);
  });

  it('allows the waitlist API and Google Analytics', () => {
    const connect = directives.get('connect-src') ?? [];
    expect(connect).toContain(new URL(API_BASE_URL).origin);
    expect(connect).toContain('https://*.google-analytics.com');
    expect(directives.get('script-src')).toContain('https://*.googletagmanager.com');
  });

  it('allows the YouTube Shorts player and posters', () => {
    expect(directives.get('frame-src')).toEqual(['https://www.youtube-nocookie.com']);
    expect(directives.get('img-src')).toContain('https://i.ytimg.com');
  });
});

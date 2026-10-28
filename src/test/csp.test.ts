// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { buildCsp, cspPlugin, injectCsp } from '../seo/csp';
import { API_BASE_URL, WICKMASTERS_DEMO_WEBHOOK_URL } from '../components/utils/links';

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

  it('allows the waitlist API, the free demo webhook and Google Analytics', () => {
    const connect = directives.get('connect-src') ?? [];
    expect(connect).toContain(new URL(API_BASE_URL).origin);
    expect(connect).toContain('https://hooks.airtable.com');
    expect(connect).toContain('https://*.google-analytics.com');
    expect(directives.get('script-src')).toContain('https://*.googletagmanager.com');
  });

  it('allows the YouTube Shorts player and posters', () => {
    expect(directives.get('frame-src')).toEqual(['https://www.youtube-nocookie.com']);
    expect(directives.get('img-src')).toContain('https://i.ytimg.com');
  });
});

describe('injectCsp', () => {
  const html = (head: string) => `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n${head}  </head>\n</html>`;

  it('puts the policy right after <meta charset>, before any script', () => {
    const out = injectCsp(html('    <script async src="/a.js"></script>\n'), "x-src 'self'");
    const meta = out.indexOf('http-equiv="Content-Security-Policy"');
    expect(meta).toBeGreaterThan(out.indexOf('<meta charset'));
    expect(meta).toBeLessThan(out.indexOf('<script'));
    expect(out).toContain(`content="x-src 'self'"`);
  });

  it('fails the build on an inline executable script', () => {
    expect(() => injectCsp(html("    <script>gtag('js', new Date())</script>\n"), 'p')).toThrow(/inline/);
    expect(() => injectCsp(html('    <script type="module">import "/a.js"</script>\n'), 'p')).toThrow(/inline/);
  });

  it('lets the JSON-LD data blocks through', () => {
    expect(() => injectCsp(html('    <script type="application/ld+json" data-seo-jsonld>{}</script>\n'), 'p')).not.toThrow();
  });

  it('fails loudly when the charset meta is missing', () => {
    expect(() => injectCsp('<html><head></head></html>', 'p')).toThrow(/charset/);
  });

  it('is a build-only, post-order Vite plugin', () => {
    const plugin = cspPlugin('p');
    expect(plugin.apply).toBe('build');
    expect(plugin.transformIndexHtml.order).toBe('post');
    expect(plugin.transformIndexHtml.handler(html(''))).toContain('content="p"');
  });
});

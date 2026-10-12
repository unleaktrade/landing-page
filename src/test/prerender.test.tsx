// @vitest-environment node
//
// The build-time prerender runs in Node (scripts/prerender.mjs imports the SSR
// bundle of entry-server.tsx), so this suite renders without any DOM, exactly
// as the build does. It guards against a component touching `window` during
// render, which would break the build, and checks crawlers get real content.
import { describe, it, expect } from 'vitest';
import { render, structuredData } from '../entry-server';
import { PRERENDERED_PAGES, resolveSeo } from '../seo/routes';
import { faqData } from '../components/FAQ';

describe('prerender', () => {
  it.each(PRERENDERED_PAGES.map((p) => p.path))('renders %s to static HTML without a DOM', async (path) => {
    const html = await render(path);
    expect(html).toContain('<main');
    // the standalone waitlist page deliberately has no navbar
    if (!['/waitlist', '/app'].includes(path)) expect(html).toContain('<nav');
    // exactly one top-level heading per page
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
  });

  it('puts every FAQ question and answer in the FAQ HTML', async () => {
    const html = await render('/faq');
    for (const item of faqData) {
      expect(html).toContain(`id="${item.id}"`);
      expect(html).toContain(`id="${item.id}-answer"`);
    }
    expect(html).toContain('testing allowance, not a trade-size guideline');
  });

  it('renders the home hero and sections', async () => {
    const html = await render('/');
    expect(html).toContain('Confidential OTC Trading');
    expect(html).toContain('Learn UnleakTrade in 60 seconds');
  });

  it('emits FAQPage JSON-LD for /faq and Organization + WebSite for home', () => {
    const faq = structuredData(resolveSeo('/faq'));
    expect(faq).toContain('"@type":"FAQPage"');
    const home = structuredData(resolveSeo('/'));
    expect(home).toContain('"@type":"Organization"');
    expect(home).toContain('"@type":"WebSite"');
    expect(structuredData(resolveSeo('/roadmap'))).toBe('');
  });
});

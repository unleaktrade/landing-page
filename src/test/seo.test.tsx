import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Link, Routes, Route } from 'react-router';
import { useState } from 'react';
import {
  canonicalUrl,
  headTags,
  outputFileFor,
  PRERENDERED_PAGES,
  resolveSeo,
  robotsContent,
  sitemapXml,
  SITE_URL,
} from '../seo/routes';
import { faqPageJsonLd, jsonLdScripts, organizationJsonLd, toPlainText, websiteJsonLd } from '../seo/jsonld';
import { Seo } from '../seo/Seo';
import { normalizePath, shouldHydrate } from '../hydration';
import { faqData } from '../components/FAQ';
import { LazyQRCodeDialog, LazyWaitlistDialog } from '../components/LazyDialogs';

// Long dashes are banned repo-wide (CLAUDE.md); metadata is copy too.
const LONG_DASHES = /[\u2012-\u2015]/;

describe('route metadata', () => {
  it('gives every prerendered page a unique title, description and output file', () => {
    const titles = new Set(PRERENDERED_PAGES.map((p) => p.title));
    const files = new Set(PRERENDERED_PAGES.map(outputFileFor));
    expect(titles.size).toBe(PRERENDERED_PAGES.filter((p) => !p.canonicalPath).length);
    expect(files.size).toBe(PRERENDERED_PAGES.length);
    for (const p of PRERENDERED_PAGES) {
      expect(p.title).not.toMatch(LONG_DASHES);
      expect(p.description).not.toMatch(LONG_DASHES);
      // what search results actually show
      expect(p.title.length).toBeLessThanOrEqual(70);
      expect(p.description.length).toBeGreaterThan(50);
      expect(p.description.length).toBeLessThanOrEqual(170);
    }
  });

  it('writes clean-URL files GitHub Pages serves with a 200', () => {
    expect(outputFileFor(resolveSeo('/'))).toBe('index.html');
    expect(outputFileFor(resolveSeo('/faq'))).toBe('faq.html');
    expect(outputFileFor(resolveSeo('/roadmap'))).toBe('roadmap.html');
  });

  it('resolves canonical URLs, including trailing slashes and .html', () => {
    expect(canonicalUrl(resolveSeo('/'))).toBe(`${SITE_URL}/`);
    expect(canonicalUrl(resolveSeo('/faq'))).toBe(`${SITE_URL}/faq`);
    expect(canonicalUrl(resolveSeo('/faq/'))).toBe(`${SITE_URL}/faq`);
    expect(canonicalUrl(resolveSeo('/faq.html'))).toBe(`${SITE_URL}/faq`);
    expect(canonicalUrl(resolveSeo('/roadmap'))).toBe(`${SITE_URL}/roadmap`);
    expect(canonicalUrl(resolveSeo('/builder'))).toBe(`${SITE_URL}/builder`);
    expect(canonicalUrl(resolveSeo('/academy'))).toBe(`${SITE_URL}/academy`);
  });

  it('canonicalises duplicates and referral links to /waitlist', () => {
    expect(canonicalUrl(resolveSeo('/waitlist'))).toBe(`${SITE_URL}/waitlist`);
    expect(canonicalUrl(resolveSeo('/app'))).toBe(`${SITE_URL}/waitlist`);
    const referral = resolveSeo('/waitlist/GhTppHPoSppnBurco1sPuYWyn3mejhsaRdRbt3dHtFyc');
    expect(canonicalUrl(referral)).toBe(`${SITE_URL}/waitlist`);
    expect(referral.indexable).toBe(true);
  });

  it('keeps hidden and private pages out of the index', () => {
    expect(resolveSeo('/team').indexable).toBe(false);
    expect(resolveSeo('/team/julien-sie').indexable).toBe(false);
    expect(resolveSeo('/activate/abc').indexable).toBe(false);
    expect(robotsContent(resolveSeo('/activate/abc'))).toBe('noindex,follow');
    expect(robotsContent(resolveSeo('/faq'))).toMatch(/^index,follow/);
  });

  it('falls back to the home metadata for unknown paths (they redirect home)', () => {
    expect(resolveSeo('/nope')).toBe(resolveSeo('/'));
  });

  it('lists exactly the indexable, self-canonical pages in the sitemap', () => {
    const xml = sitemapXml(PRERENDERED_PAGES, '2026-01-02');
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual([
      `${SITE_URL}/`,
      `${SITE_URL}/faq`,
      `${SITE_URL}/roadmap`,
      `${SITE_URL}/builder`,
      `${SITE_URL}/academy`,
      `${SITE_URL}/waitlist`,
    ]);
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>');
    expect(xml).toContain('<priority>1.0</priority>');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('omits optional sitemap fields when a page does not set them', () => {
    const xml = sitemapXml([{ path: '/x', title: 't', description: 'd', indexable: true }], '2026-01-02');
    expect(xml).not.toContain('<changefreq>');
    expect(xml).not.toContain('<priority>');
  });

  it('renders escaped, data-seo tagged head tags', () => {
    const html = headTags({ path: '/x', title: 'A & "B"', description: '<d>', indexable: true });
    expect(html).toContain('<title>A &amp; &quot;B&quot;</title>');
    expect(html).toContain('<meta data-seo name="description" content="&lt;d&gt;" />');
    expect(html).toContain(`<link data-seo rel="canonical" href="${SITE_URL}/x" />`);
    expect(html).toContain(`<meta data-seo property="og:image" content="${SITE_URL}/og-image.png" />`);
  });
});

describe('structured data', () => {
  it('builds a FAQPage with every FAQ entry as plain text', () => {
    const ld = faqPageJsonLd(faqData) as { '@type': string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toHaveLength(faqData.length);
    for (const q of ld.mainEntity) {
      expect(q.name.length).toBeGreaterThan(0);
      expect(q.acceptedAnswer.text).not.toMatch(/\*\*|`/);
    }
  });

  it('strips the FAQ renderer markup', () => {
    expect(toPlainText('A **bold** and `code`\n\u2022 item\n\u2022 two  ')).toBe('A bold and code\n- item\n- two');
  });

  it('describes the organization and website', () => {
    const org = organizationJsonLd() as { '@type': string; sameAs: string[]; url: string };
    expect(org['@type']).toBe('Organization');
    expect(org.url).toBe(`${SITE_URL}/`);
    expect(org.sameAs.length).toBeGreaterThan(0);
    expect((websiteJsonLd() as { '@type': string })['@type']).toBe('WebSite');
  });

  it('serialises safely inside a script tag', () => {
    const tag = jsonLdScripts([{ text: '</script><script>alert(1)</script>' }]);
    expect(tag.match(/<\/script>/g)).toHaveLength(1);
    expect(tag).toContain('\\u003c/script>');
    expect(JSON.parse(tag.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''))).toEqual({
      text: '</script><script>alert(1)</script>',
    });
  });
});

describe('<Seo />', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  const meta = (sel: string) => document.head.querySelector(sel)?.getAttribute('content');

  function Harness() {
    return (
      <>
        <Seo />
        <Link to="/faq">go faq</Link>
        <Link to="/roadmap">go roadmap</Link>
      </>
    );
  }

  it('creates the head tags for the current route', () => {
    render(
      <MemoryRouter initialEntries={['/faq']}>
        <Seo />
      </MemoryRouter>
    );
    expect(document.title).toBe(resolveSeo('/faq').title);
    expect(meta('meta[name="description"]')).toBe(resolveSeo('/faq').description);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/faq`);
    expect(meta('meta[property="og:url"]')).toBe(`${SITE_URL}/faq`);
    expect(meta('meta[name="twitter:image"]')).toBe(`${SITE_URL}/og-image.png`);
  });

  it('updates prerendered tags in place on navigation and drops stale JSON-LD', async () => {
    document.head.innerHTML =
      '<link rel="canonical" href="x"><meta name="description" content="x">' +
      '<script type="application/ld+json" data-seo-jsonld>{}</script>';
    render(
      <MemoryRouter initialEntries={['/']}>
        <Harness />
      </MemoryRouter>
    );
    // first render keeps the JSON-LD that was prerendered for this page
    expect(document.head.querySelectorAll('script[data-seo-jsonld]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/`);

    await userEvent.setup().click(screen.getByText('go roadmap'));
    await waitFor(() => expect(document.title).toBe(resolveSeo('/roadmap').title));
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/roadmap`);
    expect(document.head.querySelectorAll('script[data-seo-jsonld]')).toHaveLength(0);
  });
});

describe('hydration decision', () => {
  function root(attr?: string, child = true) {
    const el = document.createElement('div');
    if (attr !== undefined) el.dataset.prerendered = attr;
    if (child) el.appendChild(document.createElement('div'));
    return el;
  }

  it('hydrates only markup prerendered for the URL being shown', () => {
    expect(shouldHydrate(root('/faq'), '/faq')).toBe(true);
    expect(shouldHydrate(root('/faq'), '/faq/')).toBe(true);
    expect(shouldHydrate(root('/'), '/')).toBe(true);
    expect(shouldHydrate(root('/faq'), '/roadmap')).toBe(false);
    expect(shouldHydrate(root('/waitlist'), '/waitlist/abc')).toBe(false);
  });

  it('renders from scratch for the empty 404 shell or the dev server', () => {
    expect(shouldHydrate(root(undefined), '/faq')).toBe(false);
    expect(shouldHydrate(root('/faq', false), '/faq')).toBe(false);
  });

  it('normalises trailing slashes and .html', () => {
    expect(normalizePath('/faq.html')).toBe('/faq');
    expect(normalizePath('/faq/')).toBe('/faq');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('')).toBe('/');
  });
});

describe('lazy dialogs', () => {
  function Toggle({ which }: { which: 'waitlist' | 'qr' }) {
    const [open, setOpen] = useState(false);
    const Dialog = which === 'waitlist' ? LazyWaitlistDialog : LazyQRCodeDialog;
    return (
      <>
        <button onClick={() => setOpen(true)}>open</button>
        <Dialog open={open} onOpenChange={setOpen} />
      </>
    );
  }

  it('does not load the waitlist dialog until it is opened', async () => {
    render(<Toggle which="waitlist" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByText('open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('does not load the QR dialog until it is opened', async () => {
    localStorage.setItem('waitlist_wallet_address', 'GhTppHPoSppnBurco1sPuYWyn3mejhsaRdRbt3dHtFyc');
    render(<Toggle which="qr" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByText('open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    localStorage.clear();
  });

  it('renders an already-open dialog straight away', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LazyWaitlistDialog open onOpenChange={() => {}} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});

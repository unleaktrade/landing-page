import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { RISK_NOTICE } from '../components/AcademyPage';
import { TIKTOK_URL, WICKMASTERS_DEMO_URL } from '../components/utils/links';

const VALID_SOLANA = 'GhTppHPoSppnBurco1sPuYWyn3mejhsaRdRbt3dHtFyc';

function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

afterEach(() => {
  window.history.pushState({}, '', '/');
  localStorage.clear();
});

describe('App routing', () => {
  it('renders the home page with Hero CTA', () => {
    renderAt('/');
    expect(screen.getAllByRole('button', { name: /request access/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/live in beta on solana devnet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /learn unleaktrade in 60 seconds/i })
    ).toBeInTheDocument();
  });

  it('renders the roadmap page', () => {
    renderAt('/roadmap');
    expect(
      screen.getByRole('heading', { name: /building solana's private market infrastructure/i })
    ).toBeInTheDocument();
  });

  it('renders the team page without member param', () => {
    renderAt('/team');
    expect(screen.getAllByText(/julien sie/i).length).toBeGreaterThan(0);
  });

  it('renders the team page scrolled to a member', () => {
    renderAt('/team/julien-sie');
    expect(screen.getAllByText(/julien sie/i).length).toBeGreaterThan(0);
  });

  it('renders the FAQ page', () => {
    renderAt('/faq');
    expect(screen.getByPlaceholderText(/search questions/i)).toBeInTheDocument();
  });

  it('deep-links to a FAQ entry via hash', async () => {
    renderAt('/faq#devnet-usdc');
    expect(
      await screen.findByText(/testing allowance, not a trade-size guideline/i)
    ).toBeInTheDocument();
    expect(document.getElementById('devnet-usdc')).not.toBeNull();
  });

  it('renders the waitlist page', () => {
    renderAt('/waitlist');
    expect(screen.getByLabelText(/your solana wallet address/i)).toBeInTheDocument();
    expect(screen.getByText(/beta live on solana devnet/i)).toBeInTheDocument();
  });

  it('renders the waitlist page with a valid sponsor locked', () => {
    renderAt(`/waitlist/${VALID_SOLANA}`);
    expect(screen.getByText(/fast pass active/i)).toBeInTheDocument();
  });

  it('short-circuits render when sponsor is invalid', () => {
    renderAt('/waitlist/not-a-valid-sponsor');
    expect(screen.queryByText(/fast pass active/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/your solana wallet address/i)).not.toBeInTheDocument();
  });

  it('renders /app as the waitlist page', () => {
    renderAt('/app');
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders the builder page', () => {
    renderAt('/builder');
    expect(screen.getAllByText(/julien sie/i).length).toBeGreaterThan(0);
  });

  it('renders the academy page with the demo link, the disabled paid offer and the risk notice', () => {
    renderAt('/academy');
    expect(screen.getByRole('heading', { level: 1, name: /unleaktrade academy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /download the free demo/i })).toHaveAttribute('href', WICKMASTERS_DEMO_URL);
    expect(screen.getByRole('button', { name: /full guide \+ 10 cheat sheets/i })).toBeDisabled();
    // The price lives only on the Stripe checkout, never on the landing page.
    expect(document.body.textContent).not.toMatch(/eur|€|\$\d/i);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /risk notice/i })).toHaveTextContent(RISK_NOTICE);
    expect(screen.getAllByRole('link', { name: /tiktok/i })[0]).toHaveAttribute('href', TIKTOK_URL);
  });

  it('links to the academy from the navigation', async () => {
    renderAt('/');
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('link', { name: /^academy$/i })[0]);
    expect(screen.getByRole('heading', { level: 1, name: /unleaktrade academy/i })).toBeInTheDocument();
  });

  it('redirects unknown routes to home', () => {
    renderAt('/totally-made-up-path');
    expect(screen.getAllByRole('button', { name: /request access/i }).length).toBeGreaterThan(0);
  });

  it('opens the waitlist dialog when the hero CTA is clicked', async () => {
    renderAt('/');
    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /request access/i });
    const before = screen.getAllByText(/request access/i).length;
    await user.click(buttons[0]);
    // The dialog is lazy-loaded on first open; its title and submit add more
    // "Request Access" text inside a real dialog.
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getAllByText(/request access/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/request access/i).length).toBeGreaterThan(before);
  });

  it('opens the CommunityCTA-triggered waitlist dialog too', async () => {
    renderAt('/');
    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /request access/i });
    // last one is CommunityCTA's
    await user.click(buttons[buttons.length - 1]);
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getAllByText(/request access/i).length).toBeGreaterThanOrEqual(1);
  });

  it('calls window.scrollTo on route change via ScrollToTop', async () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    renderAt('/');
    scrollSpy.mockClear();
    const user = userEvent.setup();
    const faqLinks = screen.getAllByRole('link', { name: /^faq$/i });
    await user.click(faqLinks[0]);
    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();
  });
});

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

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
    expect(screen.getAllByRole('button', { name: /join the waitlist/i }).length).toBeGreaterThan(0);
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

  it('renders the waitlist page', () => {
    renderAt('/waitlist');
    expect(screen.getByLabelText(/your solana wallet address/i)).toBeInTheDocument();
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

  it('redirects unknown routes to home', () => {
    renderAt('/totally-made-up-path');
    expect(screen.getAllByRole('button', { name: /join the waitlist/i }).length).toBeGreaterThan(0);
  });

  it('opens the waitlist dialog when the hero CTA is clicked', async () => {
    renderAt('/');
    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /join the waitlist/i });
    await user.click(buttons[0]);
    // Dialog heading is an additional "Join the Waitlist" text
    expect(screen.getAllByText(/join the waitlist/i).length).toBeGreaterThanOrEqual(3);
  });

  it('opens the DiscordCTA-triggered waitlist dialog too', async () => {
    renderAt('/');
    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /join the waitlist/i });
    // last one is DiscordCTA's
    await user.click(buttons[buttons.length - 1]);
    expect(screen.getAllByText(/join the waitlist/i).length).toBeGreaterThanOrEqual(3);
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

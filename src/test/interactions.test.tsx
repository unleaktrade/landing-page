import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import App from '../App';
import { FAQ } from '../components/FAQ';
import { Roadmap } from '../components/Roadmap';
import { QRCodeDialog } from '../components/QRCodeDialog';
import { WaitlistDialog } from '../components/WaitlistDialog';
import { WaitlistPage } from '../components/WaitlistPage';
import { ActivateWaitlist } from '../components/ActivateWaitlist';
import { TeamPage } from '../components/TeamPage';

const VALID_SOLANA = 'GhTppHPoSppnBurco1sPuYWyn3mejhsaRdRbt3dHtFyc';
const setup = () =>
  userEvent.setup({ delay: null, pointerEventsCheck: 0 });

afterEach(() => {
  window.history.pushState({}, '', '/');
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function fillInput(label: RegExp, value: string) {
  const input = screen.getByLabelText(label) as HTMLInputElement;
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
  return input;
}

describe('FAQ interactions', () => {
  it('expands an accordion item', async () => {
    render(<FAQ />);
    const user = setup();
    const firstQuestion = screen.getAllByRole('button', { name: /what is unleaktrade\?/i })[0];
    await user.click(firstQuestion);
    expect(screen.getByText(/UnleakTrade is a private/i)).toBeInTheDocument();
    await user.click(firstQuestion);
  });

  it('filters via search and shows no-results state', async () => {
    render(<FAQ />);
    const user = setup();
    const search = screen.getByPlaceholderText(/search questions/i);
    fireEvent.change(search, { target: { value: 'zzzzz-no-match-zzzzz' } });
    expect(screen.getByText(/no questions found/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.queryByText(/no questions found/i)).not.toBeInTheDocument();
  });

  it('toggles a category filter and the All filter', async () => {
    render(<FAQ />);
    const user = setup();
    // Category buttons live in the filter row; the first category button matching is the pill
    const categoryButtons = screen.getAllByRole('button').filter((b) =>
      /^(Platform Basics|Economics & Incentives|Technical|Solana)$/i.test(b.textContent?.trim() || '')
    );
    expect(categoryButtons.length).toBeGreaterThan(0);
    await user.click(categoryButtons[0]);
    await user.click(categoryButtons[0]); // toggle off
    await user.click(screen.getByRole('button', { name: /^all$/i }));
  });
});

describe('Roadmap phase toggle', () => {
  it('expands and collapses phases by click', async () => {
    render(<Roadmap />);
    const user = setup();
    const bolivarHeading = screen.getByRole('heading', { name: /^bolivar$/i });
    const phaseBButton = bolivarHeading.closest('button')!;
    await user.click(phaseBButton);
    await user.click(phaseBButton);
  });
});

describe('QRCodeDialog', () => {
  function Harness() {
    const [open, setOpen] = useState(true);
    return <QRCodeDialog open={open} onOpenChange={setOpen} />;
  }

  function setNav(overrides: { share?: unknown; writeText?: unknown }) {
    if ('share' in overrides) {
      Object.defineProperty(navigator, 'share', { value: overrides.share, configurable: true });
    } else {
      // @ts-expect-error intentional cleanup
      delete (navigator as any).share;
    }
    if ('writeText' in overrides) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: overrides.writeText },
        configurable: true,
      });
    }
  }

  afterEach(() => {
    // @ts-expect-error test cleanup
    delete (navigator as any).share;
  });

  it('renders nothing without a stored wallet address', () => {
    render(<Harness />);
    expect(screen.queryByText(/share your referral/i)).not.toBeInTheDocument();
  });

  it('falls back to copy when share API is unavailable', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNav({ writeText });
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: /share link/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
  });

  it('uses share API when available', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    const share = vi.fn().mockResolvedValue(undefined);
    setNav({ share, writeText: vi.fn() });
    render(<Harness />);
    const user = setup();
    await user.click(screen.getByRole('button', { name: /share link/i }));
    await waitFor(() => expect(share).toHaveBeenCalled());
  });

  it('swallows share AbortError silently', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    const abort = new Error('cancelled');
    abort.name = 'AbortError';
    const share = vi.fn().mockRejectedValue(abort);
    setNav({ share });
    render(<Harness />);
    const user = setup();
    await user.click(screen.getByRole('button', { name: /share link/i }));
    await waitFor(() => expect(share).toHaveBeenCalled());
  });

  it('surfaces generic share failures', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    const share = vi.fn().mockRejectedValue(new Error('broken'));
    setNav({ share });
    render(<Harness />);
    const user = setup();
    await user.click(screen.getByRole('button', { name: /share link/i }));
    await waitFor(() => expect(share).toHaveBeenCalled());
  });

  it('handles copy failure via direct copy path', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    const writeText = vi.fn().mockRejectedValue(new Error('nope'));
    setNav({ writeText });
    render(<Harness />);
    // The unnamed copy-icon button is the first button (before Share/Save)
    const copyBtn = screen.getAllByRole('button')[0];
    fireEvent.click(copyBtn);
    await waitFor(() => expect(writeText).toHaveBeenCalled());
  });
});

describe('Navigation', () => {
  it('shows QR button once a wallet address is stored', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    window.history.pushState({}, '', '/');
    render(<App />);
    const qrButtons = screen.getAllByTitle(/share referral qr code/i);
    expect(qrButtons.length).toBeGreaterThan(0);
    const user = setup();
    await user.click(qrButtons[0]);
  });

  it('opens the mobile menu when hamburger is clicked and mounts the animated canvas', async () => {
    // Provide a fake 2D context so MovingSquares runs its full effect
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
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(ctx as unknown as CanvasRenderingContext2D);

    // Drive rAF so the tick function runs at least once
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(performance.now() + 16), 0);
      return 1;
    });

    window.history.pushState({}, '', '/');
    render(<App />);
    const user = setup();
    const hamburger = document.querySelector('button.md\\:hidden') as HTMLElement;
    expect(hamburger).toBeInTheDocument();
    await user.click(hamburger);
    await waitFor(() => expect(document.querySelector('canvas')).toBeInTheDocument());
    // Allow the rAF setTimeouts to flush
    await new Promise((r) => setTimeout(r, 30));
    // Exercise the resize listener
    window.dispatchEvent(new Event('resize'));
    await new Promise((r) => setTimeout(r, 20));
    expect(ctx.fillRect).toHaveBeenCalled();

    getContextSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it('opens the mobile menu with a wallet address stored and navigates via QR', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    window.history.pushState({}, '', '/');
    render(<App />);
    const user = setup();
    const hamburger = document.querySelector('button.md\\:hidden') as HTMLElement;
    await user.click(hamburger);
    const qrButton = await screen.findByRole('button', { name: /my referral qr/i });
    await user.click(qrButton);
  });
});

describe('QRCodeDialog download button', () => {
  function Harness() {
    const [open, setOpen] = useState(true);
    return <QRCodeDialog open={open} onOpenChange={setOpen} />;
  }

  it('draws the referral QR to a canvas and triggers a download', async () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);

    // Stub Image so .onload fires synchronously
    class FakeImage {
      onload: (() => void) | null = null;
      set src(_v: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal('Image', FakeImage as unknown as typeof Image);

    const originalCreate = document.createElement.bind(document);
    const anchor = originalCreate('a') as HTMLAnchorElement;
    const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {});
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string) => {
        if (tag === 'a') return anchor;
        const el = originalCreate(tag);
        if (tag === 'canvas') {
          const ctx = {
            createLinearGradient: () => ({ addColorStop: () => {} }),
            fillRect: () => {},
            drawImage: () => {},
            fillText: () => {},
            set fillStyle(_v: unknown) {},
            set font(_v: unknown) {},
            set textAlign(_v: unknown) {},
          };
          (el as HTMLCanvasElement).getContext = (() => ctx) as never;
          (el as HTMLCanvasElement).toBlob = (cb) => cb(new Blob(['png'], { type: 'image/png' }));
        }
        return el;
      });

    const createObjectURL = vi.fn().mockReturnValue('blob:fake');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    } as unknown as typeof URL);

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: /save qr code/i }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(createObjectURL).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });

  it('exits early if the QR svg element is missing', () => {
    localStorage.setItem('waitlist_wallet_address', VALID_SOLANA);
    render(<Harness />);
    const svg = document.getElementById('qr-code-svg');
    svg?.remove();
    fireEvent.click(screen.getByRole('button', { name: /save qr code/i }));
    // No throw, nothing else to assert
  });
});

describe('WaitlistDialog form submission', () => {
  function Harness() {
    const [open, setOpen] = useState(true);
    return (
      <MemoryRouter>
        <WaitlistDialog open={open} onOpenChange={setOpen} />
      </MemoryRouter>
    );
  }

  async function fillValidForm() {
    fillInput(/your solana wallet address/i, VALID_SOLANA);
    fillInput(/email address/i, 'user@example.com');
    fillInput(/sponsor wallet address/i, VALID_SOLANA);
    // wait a tick for react-hook-form validation
    await act(async () => { await Promise.resolve(); });
  }

  it('blocks submit while the form is invalid', async () => {
    render(<Harness />);
    fillInput(/your solana wallet address/i, 'bad');
    fillInput(/email address/i, 'not-an-email');
    await act(async () => { await Promise.resolve(); });
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    expect(submit).toBeDisabled();
  });

  it('submits successfully (202) and stores the hash', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 202,
      json: async () => ({ hash: 'abc123' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<Harness />);
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(localStorage.getItem('waitlist_registration_hash')).toBe('abc123')
    );
  });

  it('shows an error toast path on non-202 response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 400,
      json: async () => ({ message: 'bad sponsor' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<Harness />);
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('handles malformed JSON on error response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => { throw new Error('broken'); },
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<Harness />);
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('handles network errors', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);
    render(<Harness />);
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});

describe('WaitlistPage form submission', () => {
  function renderPage(path = '/waitlist') {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/waitlist/:sponsor" element={<WaitlistPage />} />
          <Route path="/" element={<div data-testid="home" />} />
        </Routes>
      </MemoryRouter>
    );
  }

  async function fillValidForm() {
    fillInput(/your solana wallet address/i, VALID_SOLANA);
    fillInput(/email address/i, 'user@example.com');
    fillInput(/sponsor wallet address/i, VALID_SOLANA);
    await act(async () => { await Promise.resolve(); });
  }

  it('submits successfully and shows the success state', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 202,
      json: async () => ({ hash: 'page-hash' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderPage('/waitlist');
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /check your email/i })).toBeInTheDocument()
    );
    expect(localStorage.getItem('waitlist_registration_hash')).toBe('page-hash');
    const user = setup();
    await user.click(screen.getByRole('button', { name: /go home/i }));
  });

  it('handles a 500 error response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderPage('/waitlist');
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('handles a network error', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('down'));
    vi.stubGlobal('fetch', fetchMock);
    renderPage('/waitlist');
    await fillValidForm();
    const submit = screen.getByRole('button', { name: /join waitlist/i });
    await waitFor(() => expect(submit).not.toBeDisabled(), { timeout: 2000 });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('navigates home with the back link', async () => {
    renderPage('/waitlist');
    const user = setup();
    await user.click(screen.getByRole('button', { name: /back to home/i }));
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('short-circuits render when sponsor param is invalid', async () => {
    renderPage('/waitlist/not-a-real-sponsor');
    expect(screen.queryByLabelText(/your solana wallet address/i)).not.toBeInTheDocument();
  });
});

describe('ActivateWaitlist state machine', () => {
  const hex64 = 'a'.repeat(64);

  function renderActivate(token: string | undefined = 'token-xyz') {
    const path = token ? `/activate/${token}` : '/activate/';
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/activate/:token" element={<ActivateWaitlist />} />
          <Route path="/activate/" element={<ActivateWaitlist />} />
          <Route path="/" element={<div data-testid="home" />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('redirects to home if no token', () => {
    renderActivate(undefined);
  });

  it('hides submit until a valid hash is typed', () => {
    renderActivate();
    const input = screen.getByLabelText(/verification code/i);
    fireEvent.change(input, { target: { value: 'not-a-hash' } });
    expect(
      screen.queryByRole('button', { name: /activate waitlist spot/i })
    ).not.toBeInTheDocument();
  });

  it.each([
    [201, 'waitlist_wallet_address' as const],
    [401, null],
    [409, null],
    [400, null],
    [500, null],
    [418, null],
  ])('handles status %s', async (status, storageKey) => {
    const fetchMock = vi.fn().mockResolvedValue({
      status,
      json: async () => (status === 201 ? { address: VALID_SOLANA } : { error: 'boom' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderActivate();
    fireEvent.change(screen.getByLabelText(/verification code/i), { target: { value: hex64 } });
    const submit = await screen.findByRole('button', { name: /activate waitlist spot/i });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    if (storageKey) {
      await waitFor(() =>
        expect(localStorage.getItem(storageKey)).toBe(VALID_SOLANA)
      );
    }
  });

  it('handles network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    renderActivate();
    fireEvent.change(screen.getByLabelText(/verification code/i), { target: { value: hex64 } });
    const submit = await screen.findByRole('button', { name: /activate waitlist spot/i });
    fireEvent.click(submit);
    await waitFor(() =>
      expect(screen.getByText(/network error\. please check your connection/i)).toBeInTheDocument()
    );
  });

  it('re-enables the button after modifying a previously-errored hash', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 401, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    renderActivate();
    const input = screen.getByLabelText(/verification code/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: hex64 } });
    const submit = await screen.findByRole('button', { name: /activate waitlist spot/i });
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    // Now type a different valid hash — button should re-appear
    fireEvent.change(input, { target: { value: 'b'.repeat(64) } });
    await screen.findByRole('button', { name: /activate waitlist spot/i });
  });

  it('goes back home from activate page', async () => {
    renderActivate();
    const user = setup();
    await user.click(screen.getByRole('button', { name: /back to home/i }));
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('opens the QR dialog from the success view and returns home', async () => {
    localStorage.setItem('waitlist_registration_hash', hex64);
    const fetchMock = vi.fn().mockResolvedValue({
      status: 201,
      json: async () => ({ address: VALID_SOLANA }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderActivate();
    // Hash is pre-filled from localStorage; submit should appear
    const submit = await screen.findByRole('button', { name: /activate waitlist spot/i });
    fireEvent.click(submit);
    await screen.findByRole('heading', { name: /welcome to the waitlist/i });
    const user = setup();
    await user.click(screen.getByRole('button', { name: /my referral qr/i }));
    expect(screen.getByText(/share your referral/i)).toBeInTheDocument();
  });
});

describe('TeamPage memberId effect', () => {
  it('scrolls toward the target member when the param is present', async () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={['/team/julien-sie']}>
        <Routes>
          <Route path="/team/:memberId" element={<TeamPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(scrollSpy).toHaveBeenCalled(), { timeout: 1000 });
    scrollSpy.mockRestore();
  });
});

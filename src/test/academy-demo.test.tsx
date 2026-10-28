import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { TURNSTILE_SITE_KEY, WICKMASTERS_DEMO_WEBHOOK_URL } from '../components/utils/links';
import type { TurnstileRenderOptions } from '../components/utils/turnstile';

// Fake Turnstile: by default the invisible challenge passes at once.
let passChallenge = true;
let widgetOptions: TurnstileRenderOptions | undefined;
const turnstile = {
  render: vi.fn((_el: HTMLElement, options: TurnstileRenderOptions) => {
    widgetOptions = options;
    if (passChallenge) options.callback?.('turnstile-token');
    return 'widget-1';
  }),
  reset: vi.fn(),
  remove: vi.fn(),
};

async function openDemoForm() {
  window.history.pushState({}, '', '/academy');
  render(<App />);
  const user = userEvent.setup();
  const toggle = screen.getByRole('button', { name: /get the free demo/i });
  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  return user;
}

beforeEach(() => {
  passChallenge = true;
  widgetOptions = undefined;
  vi.clearAllMocks();
  window.turnstile = turnstile;
});

afterEach(() => {
  delete window.turnstile;
  vi.unstubAllGlobals();
  window.history.pushState({}, '', '/');
});

describe('Wick Masters free demo form', () => {
  it('posts the email to the Airtable webhook and confirms', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    const user = await openDemoForm();

    await user.type(screen.getByLabelText(/email address for the free demo/i), ' trader@example.com ');
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/check your inbox/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(WICKMASTERS_DEMO_WEBHOOK_URL);
    expect(WICKMASTERS_DEMO_WEBHOOK_URL).toMatch(/^https:\/\/hooks\.airtable\.com\/workflows\/v1\/genericWebhook\//);
    // Simple request: no custom headers, so the browser sends no preflight.
    expect(init).toMatchObject({ method: 'POST', mode: 'no-cors' });
    expect(init.headers).toBeUndefined();
    expect(JSON.parse(init.body)).toEqual({
      email: 'trader@example.com',
      website: '',
      source: 'academy',
      token: 'turnstile-token',
    });
    expect(turnstile.render).toHaveBeenCalledTimes(1);
    expect(widgetOptions).toMatchObject({ sitekey: TURNSTILE_SITE_KEY, action: 'free-demo' });
  });

  it('rejects an invalid email without calling the webhook', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = await openDemoForm();

    const input = screen.getByLabelText(/email address for the free demo/i);
    await user.type(input, 'not-an-email');
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));

    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows an error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const user = await openDemoForm();

    await user.type(screen.getByLabelText(/email address for the free demo/i), 'trader@example.com');
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not send your request/i);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    // The token may be spent: the widget is reset for the retry.
    expect(turnstile.reset).toHaveBeenCalledWith('widget-1');
  });

  it('waits for the Turnstile check before sending', async () => {
    passChallenge = false;
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    const user = await openDemoForm();

    await user.type(screen.getByLabelText(/email address for the free demo/i), 'trader@example.com');
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));
    expect(screen.getByText(/checking that you are human/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    // An expired token is dropped too.
    act(() => widgetOptions?.callback?.('late-token'));
    act(() => widgetOptions?.['expired-callback']?.());
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));
    expect(fetchMock).not.toHaveBeenCalled();

    act(() => widgetOptions?.callback?.('fresh-token'));
    expect(screen.queryByText(/checking that you are human/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));
    await screen.findByText(/check your inbox/i);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).token).toBe('fresh-token');
  });

  it('removes the widget when the form closes', async () => {
    const user = await openDemoForm();
    await user.click(screen.getByRole('button', { name: /get the free demo/i }));
    expect(turnstile.remove).toHaveBeenCalledWith('widget-1');
  });

  it('sends the honeypot value so the automation can drop bots', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    const user = await openDemoForm();

    await user.type(screen.getByLabelText(/^website$/i), 'spam.example');
    await user.type(screen.getByLabelText(/email address for the free demo/i), 'bot@example.com');
    await user.click(screen.getByRole('button', { name: /email me the demo/i }));

    await screen.findByRole('status');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).website).toBe('spam.example');
  });
});

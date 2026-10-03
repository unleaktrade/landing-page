import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Shorts } from '../components/Shorts';
import { Footer } from '../components/Footer';
import { PINNED_SHORT_ID, type ShortItem } from '../components/utils/shorts';
import { YOUTUBE_URL } from '../components/utils/links';

const items: ShortItem[] = [
  { id: 'ep2', title: 'Free quotes mean nothing | VS The Market #2', published: '2026-10-01T16:00:20+00:00' },
  { id: 'ep1', title: "Your quote got copied | VS The Market #1", published: '2026-09-29T16:00:19+00:00' },
  { id: 'bonds', title: 'How Bonds Keep UnleakTrade Fair', published: '2026-09-24T07:52:25+00:00' },
  { id: PINNED_SHORT_ID, title: 'We are building the best OTC desk on Solana', published: '2026-09-24T01:19:49+00:00' },
  { id: 'old', title: 'An older short that should not show', published: '2026-09-01T00:00:00+00:00' },
];

const playButtons = () => screen.getAllByRole('button', { name: /^play:/i });
const iframes = () => document.querySelectorAll('iframe');

describe('Shorts section on phones (inline playback)', () => {
  it('renders the section heading and the channel link', () => {
    render(<Shorts items={items} />);
    expect(
      screen.getByRole('heading', { name: /learn unleaktrade in 60 seconds/i })
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /more on youtube/i });
    expect(link).toHaveAttribute('href', YOUTUBE_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('shows the pinned intro first, then the three most recent, and nothing older', () => {
    render(<Shorts items={items} />);
    const names = playButtons().map((b) => b.getAttribute('aria-label'));
    expect(names).toEqual([
      'Play: We are building the best OTC desk on Solana',
      'Play: Free quotes mean nothing | VS The Market #2',
      'Play: Your quote got copied | VS The Market #1',
      'Play: How Bonds Keep UnleakTrade Fair',
    ]);
    expect(screen.queryByText(/older short/i)).not.toBeInTheDocument();
  });

  it('labels the pinned card "Start here" and episodes with their series', () => {
    render(<Shorts items={items} />);
    expect(screen.getByText(/start here/i)).toBeInTheDocument();
    expect(screen.getByText('VS The Market #2')).toBeInTheDocument();
    expect(screen.getByText('VS The Market #1')).toBeInTheDocument();
    // The series suffix is stripped from the headline itself.
    expect(screen.getByText('Free quotes mean nothing')).toBeInTheDocument();
  });

  it('loads no YouTube player until a card is clicked', () => {
    render(<Shorts items={items} />);
    expect(iframes()).toHaveLength(0);
    expect(document.querySelector('script[src*="youtube"]')).toBeNull();
  });

  it('swaps the clicked poster for a privacy-enhanced autoplaying player', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[1]);
    const frames = iframes();
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute('src')).toMatch(
      /^https:\/\/www\.youtube-nocookie\.com\/embed\/ep2\?/
    );
    expect(frames[0].getAttribute('src')).toContain('autoplay=1');
    expect(frames[0]).toHaveAttribute('title', 'Free quotes mean nothing | VS The Market #2');
    expect(frames[0].getAttribute('allow')).toContain('autoplay');
  });

  it('plays one Short at a time', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[0]);
    await user.click(playButtons()[0]); // the first remaining button is now ep2
    const frames = iframes();
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute('src')).toContain('/embed/ep2?');
    expect(playButtons()).toHaveLength(3);
  });

  it('falls back to the landscape poster when the vertical one is missing', () => {
    render(<Shorts items={items} />);
    const poster = document.querySelector('img[src*="/vi/ep2/"]') as HTMLImageElement;
    expect(poster.src).toBe('https://i.ytimg.com/vi/ep2/oar2.jpg');
    fireEvent.error(poster);
    expect(poster.src).toBe('https://i.ytimg.com/vi/ep2/hqdefault.jpg');
    expect(poster).toHaveAttribute('loading', 'lazy');
  });

  it('renders nothing when the feed is empty', () => {
    const { container } = render(<Shorts items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('uses the committed feed data by default', () => {
    render(<Shorts />);
    expect(playButtons().length).toBeGreaterThan(0);
    expect(document.querySelector(`img[src*="/vi/${PINNED_SHORT_ID}/"]`)).not.toBeNull();
  });
});

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide && query.includes('min-width: 64rem'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Shorts section on laptops (lightbox playback)', () => {
  const original = window.matchMedia;
  beforeEach(() => mockViewport(true));
  afterEach(() => {
    window.matchMedia = original;
  });

  it('opens the clicked Short in a large dialog instead of inside the card', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[1]);

    const dialog = await screen.findByRole('dialog');
    const frame = dialog.querySelector('iframe');
    expect(frame?.getAttribute('src')).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/ep2\?/);
    expect(within(dialog).getByRole('heading', { name: 'Free quotes mean nothing | VS The Market #2' })).toBeInTheDocument();
    // The card itself keeps its poster: no player in the carousel. The modal
    // hides the page from assistive tech, hence `hidden: true`.
    expect(screen.getAllByRole('button', { name: /^play:/i, hidden: true })).toHaveLength(4);
    expect(iframes()).toHaveLength(1);
  });

  it('links to the Short on YouTube from the dialog', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[1]);
    const link = within(await screen.findByRole('dialog')).getByRole('link', { name: /watch on youtube/i });
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/shorts/ep2');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('steps to the next and previous Short, wrapping around', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[3]); // last card: bonds
    const dialog = await screen.findByRole('dialog');
    const src = () => dialog.querySelector('iframe')?.getAttribute('src') ?? '';

    await user.click(within(dialog).getByRole('button', { name: /next short/i }));
    expect(src()).toContain(`/embed/${PINNED_SHORT_ID}?`);

    await user.click(within(dialog).getByRole('button', { name: /previous short/i }));
    expect(src()).toContain('/embed/bonds?');
  });

  it('steps with the arrow keys', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[0]);
    const dialog = await screen.findByRole('dialog');
    await user.keyboard('{ArrowRight}');
    expect(dialog.querySelector('iframe')?.getAttribute('src')).toContain('/embed/ep2?');
    await user.keyboard('{ArrowLeft}');
    expect(dialog.querySelector('iframe')?.getAttribute('src')).toContain(`/embed/${PINNED_SHORT_ID}?`);
  });

  it('closes with Escape and stops the player', async () => {
    render(<Shorts items={items} />);
    const user = userEvent.setup();
    await user.click(playButtons()[0]);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(iframes()).toHaveLength(0);
  });
});

describe('Footer YouTube link', () => {
  it('links to the channel in a new tab', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /youtube/i });
    expect(link).toHaveAttribute('href', YOUTUBE_URL);
    expect(link).toHaveAttribute('target', '_blank');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TeamSection } from '../components/TeamSection';
import { WorkInProgress } from '../components/WorkInProgress';

describe('TeamSection (currently unrouted)', () => {
  it('renders team members and navigates on card click', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TeamSection />} />
          <Route path="/team/:memberId" element={<div data-testid="team-member">member</div>} />
        </Routes>
      </MemoryRouter>
    );
    const heading = screen.getByRole('heading', { name: /julien sie/i });
    const card = heading.closest('div.cursor-pointer') as HTMLElement;
    expect(card).not.toBeNull();
    const user = userEvent.setup();
    await user.click(card);
    expect(screen.getByTestId('team-member')).toBeInTheDocument();
  });

  it('does not navigate when clicking a social link (stopPropagation)', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TeamSection />} />
          <Route path="/team/:memberId" element={<div data-testid="team-member">member</div>} />
        </Routes>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const linkedin = screen.getByLabelText(/linkedin/i);
    await user.click(linkedin);
    expect(screen.queryByTestId('team-member')).not.toBeInTheDocument();
  });
});

describe('WorkInProgress (currently unrouted)', () => {
  it('renders and navigates home when CTA clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/work']}>
        <Routes>
          <Route path="/work" element={<WorkInProgress />} />
          <Route path="/" element={<div data-testid="home">home</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /work in progress/i })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /return to home/i }));
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});

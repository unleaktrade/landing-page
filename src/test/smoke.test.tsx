import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App smoke', () => {
  it('renders without crashing and mounts a landmark', () => {
    render(<App />);
    expect(document.body.childElementCount).toBeGreaterThan(0);
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });
});

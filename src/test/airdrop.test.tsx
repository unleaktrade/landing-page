import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AirdropStatusCard,
  type AirdropInfo,
  type AirdropStatus,
} from '../components/AirdropStatusCard';

const SIGNATURE = '5Sig111111111111111111111111111111111111111111111111111111111111';

function makeAirdrop(overrides: Partial<AirdropInfo> = {}): AirdropInfo {
  return {
    cluster: 'devnet',
    status: 'pending',
    mint: 'M1nt1111111111111111111111111111111111111111',
    amount: 1000,
    rawAmount: '1000000000',
    retryable: false,
    ...overrides,
  };
}

describe('AirdropStatusCard', () => {
  it.each<[AirdropStatus, RegExp]>([
    ['pending', /your uusdc airdrop is on the way/i],
    ['processing', /your uusdc airdrop is on the way/i],
    ['confirmed', /uusdc delivered to your wallet/i],
    ['already_distributed', /already received its uusdc airdrop/i],
    ['failed_retryable', /temporary snag.*retried automatically/i],
    ['failed_terminal', /couldn't complete the airdrop/i],
  ])('renders distinguishing copy for status %s', (status, copy) => {
    render(<AirdropStatusCard airdrop={makeAirdrop({ status })} />);
    expect(screen.getByText(copy)).toBeInTheDocument();
  });

  it('always renders the devnet disclaimer', () => {
    render(<AirdropStatusCard airdrop={makeAirdrop({ status: 'confirmed' })} />);
    expect(
      screen.getByText(
        /uusdc is a devnet-only test token — not real usdc, no real-world monetary value/i
      )
    ).toBeInTheDocument();
  });

  it('uses the symbol from the payload when present', () => {
    render(
      <AirdropStatusCard
        airdrop={makeAirdrop({ status: 'confirmed', symbol: 'tUSDC' })}
      />
    );
    expect(screen.getByText(/1,000 tusdc delivered to your wallet/i)).toBeInTheDocument();
  });

  it('falls back to uUSDC when the payload has no symbol', () => {
    render(<AirdropStatusCard airdrop={makeAirdrop({ status: 'confirmed' })} />);
    expect(screen.getByText(/1,000 uusdc delivered to your wallet/i)).toBeInTheDocument();
  });

  it.each<AirdropStatus>(['confirmed', 'already_distributed'])(
    'links to the explorer for %s when a signature is present',
    (status) => {
      render(
        <AirdropStatusCard
          airdrop={makeAirdrop({ status, signature: SIGNATURE })}
        />
      );
      const link = screen.getByRole('link', { name: /view transaction on solana explorer/i });
      expect(link).toHaveAttribute(
        'href',
        `https://explorer.solana.com/tx/${SIGNATURE}?cluster=devnet`
      );
    }
  );

  it.each<AirdropStatus>(['confirmed', 'already_distributed'])(
    'omits the explorer link for %s without a signature',
    (status) => {
      render(<AirdropStatusCard airdrop={makeAirdrop({ status })} />);
      expect(
        screen.queryByRole('link', { name: /view transaction on solana explorer/i })
      ).not.toBeInTheDocument();
    }
  );

  it('links to Discord on terminal failure', () => {
    render(<AirdropStatusCard airdrop={makeAirdrop({ status: 'failed_terminal' })} />);
    expect(screen.getByRole('link', { name: /discord/i })).toHaveAttribute(
      'href',
      'https://discord.gg/h9Qb9S7Qjx'
    );
  });

  it('renders nothing when airdrop is null or undefined', () => {
    const { container: c1 } = render(<AirdropStatusCard airdrop={null} />);
    expect(c1).toBeEmptyDOMElement();
    const { container: c2 } = render(<AirdropStatusCard />);
    expect(c2).toBeEmptyDOMElement();
  });

  it('renders nothing for a malformed payload without a status', () => {
    const { container } = render(
      <AirdropStatusCard airdrop={{} as unknown as AirdropInfo} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the neutral pending-style variant for an unknown status', () => {
    render(
      <AirdropStatusCard
        airdrop={makeAirdrop({ status: 'weird_new_status' as AirdropStatus })}
      />
    );
    expect(
      screen.getByText(/your uusdc airdrop is on the way/i)
    ).toBeInTheDocument();
  });

  it('formats the payload amount with locale separators', () => {
    render(
      <AirdropStatusCard
        airdrop={makeAirdrop({ status: 'confirmed', amount: '2500' })}
      />
    );
    expect(screen.getByText(/2,500 uusdc delivered/i)).toBeInTheDocument();
  });

  it('falls back to the default amount when the payload amount is unusable', () => {
    render(
      <AirdropStatusCard
        airdrop={makeAirdrop({ status: 'pending', amount: 'not-a-number' })}
      />
    );
    expect(
      screen.getByText(/we're sending 1,000 uusdc/i)
    ).toBeInTheDocument();
  });
});

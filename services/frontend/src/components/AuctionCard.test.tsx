import { render, screen } from '@testing-library/react';
import { AuctionCard } from '../components/AuctionCard';

describe('AuctionCard', () => {
  it('renders auction details', () => {
    render(<AuctionCard title="Test Item" price={1.5} timeLeft={120} highestBidder="User1" />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Ξ 1.500')).toBeInTheDocument();
    expect(screen.getByText('02:00')).toBeInTheDocument();
    expect(screen.getByText('User1')).toBeInTheDocument();
  });
});
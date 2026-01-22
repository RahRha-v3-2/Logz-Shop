export interface LogItem {
  id: string;
  title: string;
  type: string;
  source: string;
  price: number;
  reliability: number;
  tags: string[];
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  size: string;
  leakedAt: string;
  region: string;
  flag: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  basePrice: number;
  duration: number;
  type: string;
}

export interface AuctionState {
  item: AuctionItem;
  timeLeft: number;
  currentPrice: number;
  highestBidder: string;
  history: any[];
  isActive: boolean;
}

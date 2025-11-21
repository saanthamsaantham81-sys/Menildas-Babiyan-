export enum AssetClass {
  FOREX = 'Forex',
  CRYPTO = 'Crypto',
  INDEX = 'Index',
  COMMODITY = 'Commodity',
  FUTURES = 'Futures',
  METALS = 'Metals',
  STOCKS = 'Stocks'
}

export enum TradeDirection {
  LONG = 'Long',
  SHORT = 'Short'
}

export enum TradeStatus {
  OPEN = 'Open',
  CLOSED = 'Closed'
}

export interface Trade {
  id: string;
  date: string;
  assetClass: AssetClass;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  status: TradeStatus;
  notes?: string;
  fees?: number;
}

export interface AccountState {
  initialBalance: number;
  currentBalance: number;
}

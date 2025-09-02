export interface MarketDataProvider {
  start(): Promise<void>;
  stop(): Promise<void>;
  reloadSymbols(): Promise<void>;
  getSubscribedCount(): number;
}

export type SymbolInfo = { symbol: string; source?: string };


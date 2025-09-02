export interface MarketDataProvider {
  start(): Promise<void>;
  stop(): Promise<void>;
  reloadSymbols(): Promise<void>;
  getSubscribedCount(): number;
}

export type SymbolInfo = { symbol: string; source?: string };

export interface CompanyInfo {
  name?: string;
  exchange?: string;
  currency?: string;
  country?: string;
  sector?: string;
  industry?: string;
  ipoDate?: string; // ISO date string
  website?: string;
  logoUrl?: string;
  marketCap?: number; // in native currency
  peRatio?: number;
  dividendYield?: number;
  description?: string;
}

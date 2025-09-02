import axios from "axios";

import type { CompanyInfo } from "@/services/providers/types";

const { FINNHUB_TOKEN } = process.env;

const FINNHUB_PROFILE = "https://finnhub.io/api/v1/stock/profile2"; // symbol
const FINNHUB_METRICS = "https://finnhub.io/api/v1/stock/metric"; // symbol, metric=all

export const fetchCompanyInfo = async (symbol: string): Promise<{ info: CompanyInfo; source: string } | null> => {
  const sym = symbol.trim().toUpperCase();
  if (!sym) return null;

  try {
    if (!FINNHUB_TOKEN) return null;

    const [profileRes, metricsRes] = await Promise.all([
      axios.get(FINNHUB_PROFILE, { params: { symbol: sym, token: FINNHUB_TOKEN }, timeout: 8000 }),
      axios.get(FINNHUB_METRICS, { params: { symbol: sym, metric: "all", token: FINNHUB_TOKEN }, timeout: 8000 }),
    ]);

    const p = profileRes.data || {};
    const m = metricsRes.data?.metric || {};

    const info: CompanyInfo = {
      name: p.name || p.ticker || undefined,
      exchange: p.exchange || p.mic || undefined,
      currency: p.currency || undefined,
      country: p.country || undefined,
      sector: p.finnhubIndustry || undefined,
      industry: p.gicsIndustry || undefined,
      ipoDate: p.ipo || undefined,
      website: p.weburl || p.website || undefined,
      logoUrl: p.logo || undefined,
      marketCap: num(m.marketCapitalization),
      peRatio: num(m.peNormalizedAnnual || m.peTTM || m.peBasicExclExtraTTM),
      dividendYield: num(m.dividendYieldIndicatedAnnual || m.dividendYieldTTM),
      description: undefined, // not in free profile
    };

    return { info, source: "finnhub" };
  } catch {
    return null;
  }
};

const num = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};


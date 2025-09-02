import { prisma } from "@/lib/prisma";

import { fetchCompanyInfo } from "@/services/providers/company-info";

export interface TickerInput {
  symbol: string;
  source?: string;
  showOnDashboard?: boolean;
}

export const listTickers = async () => {
  return prisma.ticker.findMany({ orderBy: { createdAt: "desc" } });
};

export const createTicker = async (input: Readonly<TickerInput>) => {
  const symbol = input.symbol.trim().toUpperCase();
  const source = input.source?.trim() || "finnhub";
  const showOnDashboard = Boolean(input.showOnDashboard ?? false);
  const created = await prisma.ticker.create({
    data: { symbol, source, showOnDashboard },
  });

  // Fire-and-forget enrichment (non-blocking)
  void enrichTickerById(created.id).catch(() => {});

  return created;
};

export const updateTicker = async (
  id: string,
  input: Partial<Readonly<TickerInput>>,
) => {
  const data: Partial<{ symbol: string; source: string; showOnDashboard: boolean }> = {};
  if (typeof input.symbol === "string") data.symbol = input.symbol.trim().toUpperCase();
  if (typeof input.source === "string") data.source = input.source.trim();
  if (typeof input.showOnDashboard === "boolean") data.showOnDashboard = input.showOnDashboard;
  const updated = await prisma.ticker.update({ where: { id }, data });

  // Re-enrich when updated (e.g., symbol/source changed)
  void enrichTickerById(updated.id).catch(() => {});

  return updated;
};

export const deleteTicker = async (id: string) => {
  // Cascade delete: remove related price ticks by symbol, then the ticker, atomically
  const t = await prisma.ticker.findUnique({ where: { id } });
  if (!t) throw new Error("NOT_FOUND");
  const [, deleted] = await prisma.$transaction([
    prisma.priceTick.deleteMany({ where: { symbol: t.symbol } }),
    prisma.ticker.delete({ where: { id } }),
  ]);
  return deleted;
};

export const enrichTickerById = async (id: string) => {
  const t = await prisma.ticker.findUnique({ where: { id } });
  if (!t) return;
  await enrichTickerBySymbol(t.symbol);
};

export const enrichTickerBySymbol = async (symbol: string) => {
  const res = await fetchCompanyInfo(symbol);
  if (!res) return;
  const { info, source } = res;
  await prisma.ticker.update({
    where: { symbol: symbol.trim().toUpperCase() },
    data: {
      name: info.name ?? null,
      exchange: info.exchange ?? null,
      currency: info.currency ?? null,
      country: info.country ?? null,
      sector: info.sector ?? null,
      industry: info.industry ?? null,
      ipoDate: info.ipoDate ? new Date(info.ipoDate) : null,
      website: info.website ?? null,
      logoUrl: info.logoUrl ?? null,
      marketCap: info.marketCap ?? null,
      peRatio: info.peRatio ?? null,
      dividendYield: info.dividendYield ?? null,
      description: info.description ?? null,
      enrichmentSource: source,
      lastEnrichedAt: new Date(),
    },
  });
};

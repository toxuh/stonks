import { prisma } from "@/lib/prisma";

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
  return prisma.ticker.create({
    data: { symbol, source, showOnDashboard },
  });
};

export const updateTicker = async (
  id: string,
  input: Partial<Readonly<TickerInput>>,
) => {
  const data: Partial<{ symbol: string; source: string; showOnDashboard: boolean }> = {};
  if (typeof input.symbol === "string") data.symbol = input.symbol.trim().toUpperCase();
  if (typeof input.source === "string") data.source = input.source.trim();
  if (typeof input.showOnDashboard === "boolean") data.showOnDashboard = input.showOnDashboard;
  return prisma.ticker.update({ where: { id }, data });
};

export const deleteTicker = async (id: string) => {
  return prisma.ticker.delete({ where: { id } });
};


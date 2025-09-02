import { prisma } from "@/lib/prisma";

type In = { s: string; p: number; v?: number; t: number };
export interface SaveTickInput {
  id: string;
  symbol: string;
  price: number;
  volume: number | null;
  ts: Date;
  source: string;
}

const BUF: SaveTickInput[] = [];
let flushing = false;
let interval: NodeJS.Timeout | null = null;

export const pushTrade = (t: In) => {
  BUF.push({
    id: crypto.randomUUID(),
    symbol: t.s,
    price: t.p,
    volume: t.v ?? null,
    ts: new Date(t.t),
    source: "finnhub",
  });
};

// General-purpose push for fallback/providers
export const pushTick = (input: Readonly<{ symbol: string; price: number; volume?: number | null; ts?: Date; source?: string }>) => {
  const { symbol, price, volume = null, ts = new Date(), source = "finnhub" } = input;
  BUF.push({
    id: crypto.randomUUID(),
    symbol: symbol.toUpperCase(),
    price,
    volume,
    ts,
    source,
  });
};

const flush = async () => {
  if (flushing || BUF.length === 0) return;
  flushing = true;
  const chunk = BUF.splice(0, 1000); // до 1000 за раз
  try {
    await prisma.priceTick.createMany({ data: chunk, skipDuplicates: true });
  } finally {
    flushing = false;
  }
};

export const startAutoFlush = () => {
  if (interval) return;
  interval = setInterval(flush, 500);
};

export const stopAutoFlush = async () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  await flush();
};

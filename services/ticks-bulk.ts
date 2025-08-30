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
  setInterval(flush, 500);
};

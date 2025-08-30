import { prisma } from "@/lib/prisma";

export interface SaveTickInput {
  symbol: string;
  price: number;
  volume?: number | null;
  ts: Date;
  source?: string;
}

export const saveTick = async (input: Readonly<SaveTickInput>) => {
  const { symbol, price, volume, ts, source = "finnhub" } = input;
  await prisma.priceTick.create({
    data: {
      symbol: symbol.toUpperCase(),
      price,
      volume: volume ?? null,
      ts,
      source,
    },
  });
  console.log("Tick saved:", symbol, price, volume, ts, source);
};

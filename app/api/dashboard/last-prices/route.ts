import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get("symbols") || "";
  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (symbols.length === 0) return NextResponse.json({ ok: true, items: [] });

  // Берём последние цены по каждому символу	hint: последняя запись по ts
  const items = await Promise.all(
    symbols.map(async (symbol) => {
      const last = await prisma.priceTick.findFirst({
        where: { symbol },
        orderBy: { ts: "desc" },
        select: { price: true, ts: true },
      });
      return { symbol, price: last?.price ?? null, ts: last?.ts ?? null };
    }),
  );

  return NextResponse.json({ ok: true, items });
};


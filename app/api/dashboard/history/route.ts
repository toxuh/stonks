import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "").trim().toUpperCase();
  const limit = Math.min(500, Math.max(10, Number(searchParams.get("limit")) || 50));
  if (!symbol) return NextResponse.json({ ok: true, items: [] });

  const rows = await prisma.priceTick.findMany({
    where: { symbol },
    orderBy: { ts: "desc" },
    take: limit,
    select: { price: true, ts: true, createdAt: true },
  });

  const items = rows
    .map((r) => ({ price: Number(r.price), ts: r.ts.toISOString(), createdAt: r.createdAt.toISOString() }))
    .reverse();
  return NextResponse.json({ ok: true, items });
};


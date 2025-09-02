import { NextRequest, NextResponse } from "next/server";

import { enrichTickerById } from "@/services/tickers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const POST = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    await enrichTickerById(id);
    const item = await prisma.ticker.findUnique({ where: { id } });
    return NextResponse.json({ ok: true, item });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};


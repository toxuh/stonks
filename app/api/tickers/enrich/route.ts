import { NextRequest, NextResponse } from "next/server";

import { enrichTickerById } from "@/services/tickers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const POST = async (_req: NextRequest) => {
  try {
    const items = await prisma.ticker.findMany({ select: { id: true } });
    let ok = 0;
    for (const it of items) {
      try {
        // sequential to be gentle with provider limits
        // eslint-disable-next-line no-await-in-loop
        await enrichTickerById(it.id);
        ok += 1;
      } catch {
        // ignore individual errors
      }
    }
    return NextResponse.json({ ok: true, count: ok });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};


import { NextResponse } from "next/server";
import { createTicker, listTickers } from "@/services/tickers";

export const runtime = "nodejs";

export const GET = async () => {
  const items = await listTickers();
  return NextResponse.json({ ok: true, items });
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const created = await createTicker(body);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};


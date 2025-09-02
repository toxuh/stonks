import { NextRequest, NextResponse } from "next/server";
import { deleteTicker, updateTicker } from "@/services/tickers";

export const runtime = "nodejs";

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await updateTicker(id, body);
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};

export const DELETE = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const removed = await deleteTicker(id);
    return NextResponse.json({ ok: true, item: removed });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};


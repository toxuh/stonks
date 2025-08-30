import { NextResponse } from "next/server";
import { deleteTicker, updateTicker } from "@/services/tickers";

export const runtime = "nodejs";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const body = await req.json();
    const updated = await updateTicker(params.id, body);
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const removed = await deleteTicker(params.id);
    return NextResponse.json({ ok: true, item: removed });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
};


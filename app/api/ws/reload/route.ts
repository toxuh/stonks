import { NextResponse } from "next/server";
import { reload } from "@/scripts/worker";

export const runtime = "nodejs";

export const POST = async () => {
  try {
    const res = await reload();
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
};


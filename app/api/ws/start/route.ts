import { NextResponse } from "next/server";
import { start } from "@/scripts/worker";

export const runtime = "nodejs";

export const POST = async () => {
  try {
    const res = start();
    return NextResponse.json(res);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
};


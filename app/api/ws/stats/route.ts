import { NextResponse } from "next/server";
import { getSubscribedCount, isStarted } from "@/scripts/worker";

export const runtime = "nodejs";

export const GET = async () => {
  try {
    return NextResponse.json({ ok: true, started: isStarted(), subscribed: getSubscribedCount() });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
};


import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.json({ ok: true, ts: new Date().toISOString() });

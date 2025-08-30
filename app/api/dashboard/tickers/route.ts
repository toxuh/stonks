import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const GET = async () => {
  const items = await prisma.ticker.findMany({ where: { showOnDashboard: true }, orderBy: { symbol: "asc" } });
  return NextResponse.json({ ok: true, items });
};


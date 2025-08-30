import WebSocket from "ws";

import { saveTick } from "@/services/ticks";

const { FINNHUB_TOKEN, TICKERS } = process.env;

let started = false;
let ws: WebSocket | null = null;

const symbols = (TICKERS ?? "").split(",").map((s) => s.trim().toUpperCase());
const url = FINNHUB_TOKEN ? `wss://ws.finnhub.io?token=${FINNHUB_TOKEN}` : null;

const open = () => {
  if (!url) throw new Error("FINNHUB_TOKEN is required");
  const socket = new WebSocket(url);
  ws = socket;

  socket.on("open", () => {
    console.log("WS connected");
    symbols.forEach((sym) =>
      socket.send(JSON.stringify({ type: "subscribe", symbol: sym })),
    );
  });

  socket.on("message", async (data: WebSocket.RawData) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg?.data && Array.isArray(msg.data)) {
        for (const t of msg.data) {
          await saveTick({
            symbol: t.s,
            price: t.p,
            volume: t.v ?? null,
            ts: new Date(t.t),
            source: "finnhub",
          });
        }
      }
    } catch (e) {
      console.error("Parse/save error:", e);
    }
  });

  socket.on("close", (code) => {
    console.warn("WS closed", code);
    if (started) setTimeout(open, 3000);
  });

  socket.on("error", (err) => {
    console.error("WS error", err);
    try {
      socket.close();
    } catch {}
  });
};

export const start = () => {
  if (started) {
    return { ok: true, started: true, message: "WS already running" } as const;
  }
  started = true;
  open();
  return { ok: true, started: true } as const;
};

export const isStarted = () => started;

export const stop = () => {
  if (!started) return { ok: true, started: false, message: "WS not running" } as const;
  started = false;
  if (ws) {
    try {
      ws.close();
    } catch {}
    ws = null;
  }
  return { ok: true, started: false } as const;
};

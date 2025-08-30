import WebSocket from "ws";

import { pushTrade, startAutoFlush, stopAutoFlush } from "@/services/ticks-bulk";
import { listTickers } from "@/services/tickers";

const { FINNHUB_TOKEN } = process.env;

let started = false;
let ws: WebSocket | null = null;
let currentSymbols = new Set<string>();

const url = FINNHUB_TOKEN ? `wss://ws.finnhub.io?token=${FINNHUB_TOKEN}` : null;

const fetchSymbolsFromDb = async () => {
  const items = await listTickers();
  return items.map((t) => t.symbol.trim().toUpperCase()).filter(Boolean);
};

const resubscribe = async (socket: WebSocket) => {
  const fresh = new Set(await fetchSymbolsFromDb());
  // unsubscribe removed
  for (const sym of currentSymbols) {
    if (!fresh.has(sym)) {
      socket.send(JSON.stringify({ type: "unsubscribe", symbol: sym }));
    }
  }
  // subscribe new
  for (const sym of fresh) {
    if (!currentSymbols.has(sym)) {
      socket.send(JSON.stringify({ type: "subscribe", symbol: sym }));
    }
  }
  currentSymbols = fresh;
};

const open = () => {
  if (!url) throw new Error("FINNHUB_TOKEN is required");
  const socket = new WebSocket(url);
  ws = socket;

  socket.on("open", async () => {
    console.log("WS connected");
    startAutoFlush();
    try {
      await resubscribe(socket);
    } catch (e) {
      console.error("Subscribe error:", e);
    }
  });

  socket.on("message", async (data: WebSocket.RawData) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg?.data && Array.isArray(msg.data)) {
        for (const t of msg.data) {
          pushTrade(t);
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

export const start = async () => {
  if (started) {
    return { ok: true, started: true, message: "WS already running" } as const;
  }
  const symbols = await fetchSymbolsFromDb();
  if (symbols.length === 0) {
    return { ok: false, started: false, reason: "NO_TICKERS" } as const;
  }
  started = true;
  open();
  return { ok: true, started: true } as const;
};

export const isStarted = () => started;
export const getSubscribedCount = () => currentSymbols.size;

export const stop = async () => {
  if (!started) return { ok: true, started: false, message: "WS not running" } as const;
  started = false;
  if (ws) {
    try {
      ws.close();
    } catch {}
    ws = null;
  }
  currentSymbols = new Set();
  await stopAutoFlush();
  return { ok: true, started: false } as const;
};

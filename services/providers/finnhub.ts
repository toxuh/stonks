import WebSocket from "ws";
import axios from "axios";

import type { MarketDataProvider } from "@/services/providers/types";
import { pushTick, pushTrade, startAutoFlush, stopAutoFlush } from "@/services/ticks-bulk";
import { listTickers } from "@/services/tickers";

const { FINNHUB_TOKEN } = process.env;

const FINNHUB_WS = FINNHUB_TOKEN ? `wss://ws.finnhub.io?token=${FINNHUB_TOKEN}` : null;
const FINNHUB_REST = "https://finnhub.io/api/v1/quote";

const isCrypto = (sym: string) => sym.includes(":"); // e.g. BINANCE:BTCUSDT

export class FinnhubProvider implements MarketDataProvider {
  private ws: WebSocket | null = null;
  private started = false;
  private currentSymbols = new Set<string>();
  private pollTimer: NodeJS.Timeout | null = null;
  private pollIndex = 0;

  async start(): Promise<void> {
    if (this.started) return;
    const syms = await this.fetchSymbols();
    if (syms.length === 0) throw new Error("NO_TICKERS");
    this.started = true;

    // WS for crypto only
    this.openWs();

    // Start DB flush
    startAutoFlush();

    // Start REST fallback polling for non-crypto at ~1s cadence
    this.startPolling();
  }

  async stop(): Promise<void> {
    if (!this.started) return;
    this.started = false;
    if (this.ws) {
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
    this.currentSymbols.clear();
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    await stopAutoFlush();
  }

  async reloadSymbols(): Promise<void> {
    await this.resubscribe();
  }

  getSubscribedCount(): number {
    return this.currentSymbols.size;
  }

  // --- internals ---

  private async fetchSymbols() {
    const items = await listTickers();
    return items.map((t) => t.symbol.trim().toUpperCase()).filter(Boolean);
  }

  private openWs() {
    if (!FINNHUB_WS) throw new Error("FINNHUB_TOKEN is required");
    const socket = new WebSocket(FINNHUB_WS);
    this.ws = socket;

    socket.on("open", async () => {
      try {
        await this.resubscribe();
      } catch (e) {
        console.error("Subscribe error:", e);
      }
    });

    socket.on("message", async (data: WebSocket.RawData) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg?.data && Array.isArray(msg.data)) {
          for (const t of msg.data) {
            // Finnhub trade format { s, p, v, t }
            pushTrade(t);
          }
        }
      } catch (e) {
        console.error("Parse/save error:", e);
      }
    });

    socket.on("close", () => {
      if (this.started) setTimeout(() => this.openWs(), 3000);
    });

    socket.on("error", (err) => {
      console.error("WS error", err);
      try { socket.close(); } catch {}
    });
  }

  private async resubscribe() {
    const fresh = new Set(await this.fetchSymbols());

    // Unsubscribe removed crypto
    for (const sym of this.currentSymbols) {
      if (!fresh.has(sym) && isCrypto(sym)) {
        this.ws?.send(JSON.stringify({ type: "unsubscribe", symbol: sym }));
      }
    }

    // Subscribe new crypto
    for (const sym of fresh) {
      if (!this.currentSymbols.has(sym) && isCrypto(sym)) {
        this.ws?.send(JSON.stringify({ type: "subscribe", symbol: sym }));
      }
    }

    this.currentSymbols = fresh;
  }

  private startPolling() {
    const tick = async () => {
      const symbols = Array.from(this.currentSymbols).filter((s) => !isCrypto(s));
      if (symbols.length === 0) return;

      // round-robin one symbol per second to stay within free plan limits
      this.pollIndex = (this.pollIndex + 1) % symbols.length;
      const symbol = symbols[this.pollIndex];

      try {
        const { data } = await axios.get(FINNHUB_REST, {
          params: { symbol, token: FINNHUB_TOKEN },
          timeout: 5000,
        });
        // Finnhub quote response: { c: current, t: timestamp(sec) ... }
        const price = Number(data?.c);
        const ts = data?.t ? new Date(Number(data.t) * 1000) : new Date();
        if (Number.isFinite(price) && price > 0) {
          pushTick({ symbol, price, ts, source: "finnhub-quote" });
        }
      } catch (e) {
        // swallow per-second errors; log sparingly
      }
    };

    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(tick, 1000);
  }
}


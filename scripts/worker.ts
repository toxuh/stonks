import { FinnhubProvider } from "@/services/providers/finnhub";

let provider: FinnhubProvider | null = null;
let started = false;

const ensureProvider = () => {
  if (!provider) provider = new FinnhubProvider();
  return provider;
};

export const start = async () => {
  if (started) return { ok: true, started: true, message: "WS already running" } as const;

  const p = ensureProvider();
  try {
    await p.start();
  } catch (e: any) {
    if (e?.message === "NO_TICKERS") {
      return { ok: false, started: false, reason: "NO_TICKERS" } as const;
    }
    throw e;
  }
  started = true;
  return { ok: true, started: true } as const;
};

export const isStarted = () => started;
export const getSubscribedCount = () => ensureProvider().getSubscribedCount();

export const stop = async () => {
  if (!started) return { ok: true, started: false, message: "WS not running" } as const;
  started = false;
  const p = ensureProvider();
  await p.stop();
  return { ok: true, started: false } as const;
};

export const reload = async () => {
  const p = ensureProvider();
  await p.reloadSymbols();
  return { ok: true } as const;
};

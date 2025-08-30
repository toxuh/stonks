"use client";
import { useEffect, useState } from "react";

const post = async (url: string) => {
  const res = await fetch(url, { method: "POST" });
  return res.json();
};

export default function Home() {
  const [started, setStarted] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ws/status")
      .then((r) => r.json())
      .then((d) => setStarted(Boolean(d?.started)))
      .catch(() => setStarted(false));
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-3xl font-bold">Stonks</h1>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={started === null || started}
          onClick={async () => {
            await post("/api/ws/start");
            setStarted(true);
          }}
        >
          Start WS
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          disabled={started === null || !started}
          onClick={async () => {
            await post("/api/ws/stop");
            setStarted(false);
          }}
        >
          Stop WS
        </button>
      </div>
    </div>
  );
}

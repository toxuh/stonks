"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const WsToggle = () => {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [noTickersOpen, setNoTickersOpen] = useState(false);

  useEffect(() => {
    axios
      .get("/api/ws/status")
      .then((r) => setStarted(Boolean(r.data?.started)))
      .catch(() => setStarted(false));
  }, []);

  const onChange = async (checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        await axios.post("/api/ws/start");
      } else {
        await axios.post("/api/ws/stop");
      }
      setStarted(checked);
    } catch (e: unknown) {
      // Handle 4xx from /api/ws/start (e.g., NO_TICKERS)
      if (axios.isAxiosError(e) && e.response?.data?.reason === "NO_TICKERS") {
        setNoTickersOpen(true);
        setStarted(false);
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch checked={started} disabled={loading} onCheckedChange={onChange} />
        <span className="text-sm text-muted-foreground">Data Stream</span>
      </div>
      <Dialog open={noTickersOpen} onOpenChange={setNoTickersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No tickers configured</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Add at least one ticker before starting the stream.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setNoTickersOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href="/tickers">Go to Tickers</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


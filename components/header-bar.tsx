"use client";

import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import axios from "axios";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Ctx {
  title: ReactNode | null;
  actions: ReactNode | null;
  setTitle: (n: ReactNode | null) => void;
  setActions: (n: ReactNode | null) => void;
}

const HeaderBarContext = createContext<Ctx | null>(null);

export const HeaderBarProvider = ({
  children,
}: Readonly<PropsWithChildren>) => {
  const [title, setTitle] = useState<ReactNode | null>(null);
  const [actions, setActions] = useState<ReactNode | null>(null);

  const value = useMemo(
    () => ({ title, setTitle, actions, setActions }),
    [title, actions],
  );
  return (
    <HeaderBarContext.Provider value={value}>
      {children}
    </HeaderBarContext.Provider>
  );
};

export const useHeaderBar = () => {
  const ctx = useContext(HeaderBarContext);
  if (!ctx)
    throw new Error("useHeaderBar must be used within HeaderBarProvider");
  return ctx;
};

const LiveWidget = () => {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [noTickersOpen, setNoTickersOpen] = useState(false);

  useEffect(() => {
    axios
      .get("/api/ws/status")
      .then((r) => setStarted(Boolean(r.data?.started)))
      .catch(() => setStarted(false));
  }, []);

  const onClick = async () => {
    setLoading(true);
    try {
      if (started) {
        await axios.post("/api/ws/stop");
      } else {
        await axios.post("/api/ws/start");
      }
      setStarted(!started);
    } catch (e: unknown) {
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
      <div className="hidden md:flex items-center gap-4 text-sm">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
            started
              ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
              : "bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={loading ? undefined : onClick}
        >
          <div
            className={`h-2 w-2 rounded-full ${started ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
          />
          <span
            className={`font-medium ${started ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-400"}`}
          >
            Live
          </span>
        </div>
      </div>
      <Dialog open={noTickersOpen} onOpenChange={setNoTickersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No tickers configured</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Add at least one ticker before starting the stream.
          </p>
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

export const Topbar = () => {
  const { title, actions } = useHeaderBar();

  return (
    <div className="sticky top-0 z-10 glass backdrop-blur-md bg-background/80 border-b shadow-custom-sm animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center min-h-[32px]">{title}</div>
            <div className="flex items-center">{actions}</div>
          </div>
          <Breadcrumbs />
        </div>

        <LiveWidget />
      </div>
    </div>
  );
};

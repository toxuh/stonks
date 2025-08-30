"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const WsStats = () => {
  const [subscribed, setSubscribed] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/ws/stats");
        if (!mounted) return;
        setStarted(Boolean(data?.started));
        setSubscribed(Number(data?.subscribed ?? 0));
      } catch {
        if (!mounted) return;
        setStarted(false);
        setSubscribed(0);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 2000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!started) return null;
  return <span className="text-xs text-muted-foreground">Subscribed: {subscribed}</span>;
};


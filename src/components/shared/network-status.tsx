"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/** Banner shown while the browser has no network connection. */
export function NetworkStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-gold px-4 py-2 text-sm font-semibold text-black"
    >
      <WifiOff className="size-4" /> You&apos;re offline. Check your internet connection.
    </div>
  );
}

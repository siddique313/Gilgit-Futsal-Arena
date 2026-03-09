"use client";

import { useRouter } from "next/navigation";
import { useRealtime } from "@/lib/realtime";

/**
 * Listens to API server realtime events and refreshes the current route
 * so server components re-fetch (tournaments, matches, standings, etc.).
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useRealtime(() => {
    router.refresh();
  });
  return <>{children}</>;
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

const WS_PATH = "/realtime";

export type RealtimeEvent =
  | {
      event: "tournament:updated";
      payload: { tournamentId?: string; slug?: string };
    }
  | {
      event: "match:updated";
      payload: { tournamentId: string; matchId?: string };
    }
  | { event: "standings:updated"; payload: { tournamentId: string } };

export type RealtimeHandler = (e: RealtimeEvent) => void;

let socket: Socket | null = null;
const listeners = new Set<RealtimeHandler>();

function getApiOrigin(): string | null {
  if (typeof window === "undefined") return null;
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" ? "http://localhost:5000" : "");
  return base ? base.replace(/\/$/, "") : null;
}

function ensureSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  const origin = getApiOrigin();
  if (!origin) return null;
  if (!socket) {
    socket = io(origin, {
      path: WS_PATH,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 5000,
    });
    socket.on("connect_error", () => {
      // Server down: avoid spamming console; reconnectionAttempts limits retries
    });
    socket.on(
      "tournament:updated",
      (payload: { tournamentId?: string; slug?: string }) => {
        listeners.forEach((fn) => fn({ event: "tournament:updated", payload }));
      },
    );
    socket.on(
      "match:updated",
      (payload: { tournamentId: string; matchId?: string }) => {
        listeners.forEach((fn) => fn({ event: "match:updated", payload }));
      },
    );
    socket.on("standings:updated", (payload: { tournamentId: string }) => {
      listeners.forEach((fn) => fn({ event: "standings:updated", payload }));
    });
  }
  return socket;
}

/**
 * Subscribe to realtime events from the API server (tournament, match, standings updates).
 * Call the returned function to unsubscribe.
 */
export function useRealtime(handler: RealtimeHandler): () => void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const stableHandler = useCallback(
    (e: RealtimeEvent) => handlerRef.current(e),
    [],
  );

  useEffect(() => {
    ensureSocket();
    listeners.add(stableHandler);
    return () => {
      listeners.delete(stableHandler);
    };
  }, [stableHandler]);

  return useCallback(() => listeners.delete(stableHandler), [stableHandler]);
}

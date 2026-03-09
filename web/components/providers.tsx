"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { RealtimeProvider } from "./realtime-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <RealtimeProvider>{children}</RealtimeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/layout/PublicHeader";

const FIND_HERO =
  "https://images.unsplash.com/photo-1431324155629-1a6b1dd25b61?w=800&q=80";

export default function FindTournamentsPage() {
  const [query, setQuery] = useState("");
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Futsal Game GB";

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Find Tournaments
              </h1>
              <p className="mt-2 text-muted-foreground">
                Search for public tournaments by name on {appName}.
              </p>
              <div className="mt-6 max-w-md">
                <label htmlFor="find-query" className="text-sm font-medium">
                  Tournament Name
                </label>
                <input
                  id="find-query"
                  type="text"
                  placeholder="Search by tournament name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Find Tournaments
                </button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Search for tournaments by name. Find public tournaments created
                on {appName}.
              </p>
            </div>
            <div className="relative aspect-[16/10] sm:aspect-[3/2] lg:aspect-[4/3] rounded-xl overflow-hidden border bg-muted shadow-md order-1 lg:order-2">
              <Image
                src={FIND_HERO}
                alt="Football stadium and pitch"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center text-sm text-muted-foreground">
          {appName} — Find and join tournaments.
        </div>
      </footer>
    </div>
  );
}

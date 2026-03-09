"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Search, DollarSign, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Futsal Game GB";

  return (
    <header className="sticky top-0 z-10 border-b bg-card">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden rounded p-2 hover:bg-accent shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-semibold text-primary truncate">
            {appName}
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
          <Link
            href="/dashboard/tournaments"
            className={`flex items-center gap-2 text-sm ${pathname?.startsWith("/dashboard/tournaments") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Trophy className="h-4 w-4" /> Create a Tournament
          </Link>
          <Link
            href="/find"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" /> Find Tournaments
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <DollarSign className="h-4 w-4" /> Pricing
          </Link>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded p-2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            <Moon className="h-4 w-4" />
          </button>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}

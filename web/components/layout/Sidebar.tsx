"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Share2,
  ClipboardList,
  CalendarDays,
  Lock,
  Settings,
  Menu,
  X,
  ListOrdered,
} from "lucide-react";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Score7";

const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
  { href: "/dashboard/matches", label: "Matches", icon: Calendar },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
];

const adminNav = [
  {
    href: "/dashboard/registrations",
    label: "Registrations",
    icon: ClipboardList,
  },
  { href: "/dashboard/scheduler", label: "Scheduler", icon: CalendarDays },
  { href: "/dashboard/access", label: "Access", icon: Lock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "border-l-4 border-primary bg-primary/10 text-primary font-medium"
          : "border-l-4 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </Link>
  );
}

function SidebarNavContent({
  pathname,
  base,
  mainLinks,
  isDashboard,
  onLinkClick,
}: {
  pathname: string;
  base: string;
  mainLinks: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  isDashboard: boolean;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
        {!isDashboard && (
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
            Tournament
          </p>
        )}
        {mainLinks.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={
              isDashboard
                ? href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(href) === true
                : href === base
                  ? pathname === base
                  : pathname?.startsWith(href) === true
            }
            onClick={onLinkClick}
          />
        ))}
        <div className="border-t pt-4 mt-4">
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
            Admin
          </p>
          <div className="mt-1 space-y-1">
            {adminNav.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                active={pathname?.startsWith(href) === true}
                onClick={onLinkClick}
              />
            ))}
          </div>
        </div>
      </nav>
      <div className="border-t px-2 pt-4 shrink-0">
        <Link
          href={isDashboard ? "/dashboard/share" : `${base}/share`}
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Link>
      </div>
    </>
  );
}

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  onMenuClick?: () => void;
}

export function Sidebar({ mobileOpen, onClose, onMenuClick }: SidebarProps) {
  const pathname = usePathname();
  const isTournamentContext = pathname?.match(/\/tournament\/([^/]+)/);
  const slug = pathname?.match(/\/tournament\/([^/]+)/)?.[1];
  const base = slug ? `/tournament/${slug}` : "/dashboard";

  const closeIfMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose?.();
    }
  };

  if (!isTournamentContext) {
    const navContent = (
      <SidebarNavContent
        pathname={pathname ?? ""}
        base={base}
        mainLinks={mainNav}
        isDashboard
        onLinkClick={closeIfMobile}
      />
    );
    return (
      <>
        <aside className="hidden w-56 flex-shrink-0 border-r bg-card lg:block">
          <div className="flex h-full flex-col py-4">
            <div className="flex items-center gap-2 px-3 pb-4">
              <button
                type="button"
                onClick={onMenuClick}
                className="rounded p-2 hover:bg-accent lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
              <span className="font-semibold text-primary">{appName}</span>
            </div>
            {navContent}
          </div>
        </aside>
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-64 max-w-[85vw] border-r bg-card shadow-xl transition-transform duration-200 ease-out lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="flex items-center justify-between gap-2 px-3 py-4 border-b">
            <span className="font-semibold text-primary">{appName}</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 hover:bg-accent text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex h-[calc(100%-3.5rem)] flex-col overflow-hidden">
            {navContent}
          </div>
        </aside>
      </>
    );
  }

  const tournamentNav = [
    { href: base, label: "Overview", icon: LayoutDashboard },
    { href: `${base}/teams`, label: "Teams", icon: Users },
    { href: `${base}/matches`, label: "Groups Matches", icon: Calendar },
    { href: `${base}/standings`, label: "Groups Standings", icon: ListOrdered },
    { href: `${base}/stats`, label: "Stats", icon: BarChart3 },
  ];
  const tournamentAdminNav = [
    {
      href: `${base}/registrations`,
      label: "Registrations",
      icon: ClipboardList,
    },
    { href: `${base}/scheduler`, label: "Scheduler", icon: CalendarDays },
    { href: `${base}/access`, label: "Access", icon: Lock },
    { href: `${base}/settings`, label: "Settings", icon: Settings },
  ];
  const navContent = (
    <>
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
        <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
          Tournament
        </p>
        {tournamentNav.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={
              href === base
                ? pathname === base
                : pathname?.startsWith(href) === true
            }
            onClick={closeIfMobile}
          />
        ))}
        <div className="border-t pt-4 mt-4">
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
            Admin
          </p>
          <div className="mt-1 space-y-1">
            {tournamentAdminNav.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                active={pathname?.startsWith(href) === true}
                onClick={closeIfMobile}
              />
            ))}
          </div>
        </div>
      </nav>
      <div className="border-t px-2 pt-4 shrink-0">
        <Link
          href={`${base}/share`}
          onClick={closeIfMobile}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-56 flex-shrink-0 border-r bg-card lg:block">
        <div className="flex h-full flex-col py-4">
          <div className="flex items-center gap-2 px-3 pb-4">
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded p-2 hover:bg-accent lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <span className="font-semibold text-primary">{appName}</span>
          </div>
          {navContent}
        </div>
      </aside>
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 max-w-[85vw] border-r bg-card shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-4 border-b">
          <span className="font-semibold text-primary">{appName}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 hover:bg-accent text-muted-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[calc(100%-3.5rem)] flex-col overflow-hidden">
          {navContent}
        </div>
      </aside>
    </>
  );
}

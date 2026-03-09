import Link from "next/link";
import { Trophy, Users, Calendar, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your tournaments, teams, and matches.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/tournaments"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm hover:bg-accent/50"
        >
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <span className="font-medium">Tournaments</span>
            <p className="text-sm text-muted-foreground">
              Create and manage tournaments
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/teams"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm hover:bg-accent/50"
        >
          <Users className="h-8 w-8 text-primary" />
          <div>
            <span className="font-medium">Teams</span>
            <p className="text-sm text-muted-foreground">
              Manage teams per tournament
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/matches"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm hover:bg-accent/50"
        >
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <span className="font-medium">Matches</span>
            <p className="text-sm text-muted-foreground">
              Schedule and results
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/stats"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm hover:bg-accent/50"
        >
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <span className="font-medium">Stats</span>
            <p className="text-sm text-muted-foreground">View statistics</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

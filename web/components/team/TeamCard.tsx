import { PlayerList } from "./PlayerList";
import type { Team, Player } from "@/shared/types/team";

interface TeamCardProps {
  team: Pick<Team, "id" | "name" | "logoUrl" | "groupLabel">;
  players?: Pick<Player, "id" | "name" | "avatarUrl" | "role">[];
}

export function TeamCard({ team, players = [] }: TeamCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 min-w-0">
      <div className="flex items-center gap-3">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {team.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{team.name}</h3>
          {team.groupLabel && (
            <p className="text-sm text-muted-foreground truncate">
              {team.groupLabel}
            </p>
          )}
        </div>
      </div>
      {players.length > 0 && (
        <div className="mt-4 pl-1">
          <PlayerList players={players} />
        </div>
      )}
    </div>
  );
}

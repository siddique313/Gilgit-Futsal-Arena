import type { Player } from "@/shared/types/team";

interface PlayerListProps {
  players: Pick<Player, "id" | "name" | "avatarUrl" | "role">[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <ul className="space-y-2 text-sm">
      {players.map((p) => (
        <li key={p.id} className="flex items-center gap-2">
          {p.avatarUrl ? (
            <img
              src={p.avatarUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium" />
          )}
          <span>{p.name}</span>
          {p.role && (
            <span className="text-muted-foreground">
              (
              {p.role === "captain"
                ? "C"
                : p.role === "vice_captain"
                  ? "VC"
                  : p.role === "goalkeeper"
                    ? "GK"
                    : "P"}
              )
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

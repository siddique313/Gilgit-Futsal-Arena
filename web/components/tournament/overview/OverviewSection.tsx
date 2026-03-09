"use client";

import { Pencil } from "lucide-react";

type Props = {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
};

export function OverviewSection({ title, onEdit, children }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
        <h2 className="font-semibold">{title}</h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={`Edit ${title}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-2 pl-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ClipboardList } from "lucide-react";

interface RegistrationsContentProps {
  slug: string;
  tournamentName: string;
}

export function RegistrationsContent({
  slug,
  tournamentName,
}: RegistrationsContentProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground max-w-2xl">
        Let participants sign up through a public registration page, or manage
        them yourself from the Participants page.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {!enabled ? (
          <Button
            onClick={() => setEnabled(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 text-base font-medium rounded-md"
          >
            <ClipboardList className="h-5 w-5" />
            Enable Registrations
          </Button>
        ) : (
          <Button
            disabled
            className="inline-flex items-center gap-2 bg-primary/80 text-primary-foreground px-6 py-3 text-base font-medium rounded-md cursor-not-allowed"
          >
            Registrations enabled
          </Button>
        )}
        <Link
          href={`/tournament/${slug}/teams`}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
        >
          <Users className="h-4 w-4" />
          Go to Participants Page
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        On the Participants page you can create, edit, and delete teams and
        players (CRUD), and export the participant list to CSV.
      </p>

      <section className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Here&apos;s how registrations work
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>
            Enabling registrations will create a public registration page where
            participants can sign up for your tournament.
          </li>
          <li>
            New registrations stop once the deadline is reached or the maximum
            number of participants is filled.
          </li>
          <li>
            You can{" "}
            <strong className="text-foreground">
              adjust registration details
            </strong>{" "}
            at any time and also close registrations early if needed.
          </li>
          <li>
            You can manually{" "}
            <strong className="text-foreground">
              add or remove participants
            </strong>{" "}
            from the Participants page (Create, edit, delete teams and players).
          </li>
          <li>
            Participants can cancel their registration at any time, even after
            the deadline, until the tournament is finalized.
          </li>
          <li>While registrations are open, fixtures remain hidden.</li>
          <li>
            To create the fixtures and start the tournament, you must click
            &quot;Complete Registrations.&quot;
          </li>
        </ul>
      </section>
    </div>
  );
}

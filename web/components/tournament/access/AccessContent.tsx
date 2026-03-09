"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, UserPlus } from "lucide-react";

export function AccessContent() {
  const [transferring, setTransferring] = useState(false);
  const [granting, setGranting] = useState(false);

  async function handleTransferOwnership() {
    if (
      !confirm(
        "Transfer tournament ownership? You will lose full control. This cannot be undone.",
      )
    )
      return;
    setTransferring(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setTransferring(false);
    }
  }

  async function handleGrantAccess() {
    setGranting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setGranting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-muted-foreground">
        You are the owner of this tournament.
      </p>
      <p className="text-muted-foreground">
        You can allow other users to either fully manage this tournament or just
        the results.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleTransferOwnership}
          disabled={transferring}
          variant="outline"
          className="inline-flex items-center gap-2 border-input px-4 py-3"
        >
          <Lock className="h-4 w-4" />
          {transferring ? "Processing…" : "Transfer Tournament Ownership"}
        </Button>
        <Button
          onClick={handleGrantAccess}
          disabled={granting}
          variant="outline"
          className="inline-flex items-center gap-2 border-input px-4 py-3"
        >
          <UserPlus className="h-4 w-4" />
          {granting ? "Processing…" : "Grant access to a user"}
        </Button>
      </div>
    </div>
  );
}

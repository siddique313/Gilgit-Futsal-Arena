"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  /** Optional footer: e.g. Cancel + primary button */
  footer?: React.ReactNode;
  /** Optional description for aria */
  description?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  description,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-desc" : undefined}
    >
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-card shadow-xl border border-border overflow-hidden">
        {/* Green header like screenshot */}
        <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 text-primary-foreground/90 hover:bg-primary-foreground/20 hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 bg-background">
          {description && (
            <p id="dialog-desc" className="sr-only">
              {description}
            </p>
          )}
          {children}
        </div>
        {footer != null && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

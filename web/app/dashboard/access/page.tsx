export default function AccessPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Access</h1>
      <p className="mt-1 text-muted-foreground">
        Control who can view and edit your tournaments.
      </p>
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Access settings can be configured per tournament.</p>
        <p className="mt-1 text-sm">
          Use Settings for global account and app preferences.
        </p>
      </div>
    </div>
  );
}

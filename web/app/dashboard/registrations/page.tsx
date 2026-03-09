export default function RegistrationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Registrations</h1>
      <p className="mt-1 text-muted-foreground">
        Manage team and player registrations for your tournaments.
      </p>
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Registration management is available per tournament.</p>
        <p className="mt-1 text-sm">
          Open a tournament from Overview to manage registrations there.
        </p>
      </div>
    </div>
  );
}

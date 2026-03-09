export default function SchedulerPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Scheduler</h1>
      <p className="mt-1 text-muted-foreground">
        Schedule matches and set dates, times, and venues.
      </p>
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Match scheduling is available per tournament.</p>
        <p className="mt-1 text-sm">
          Open a tournament and go to Matches to edit schedule and results.
        </p>
      </div>
    </div>
  );
}

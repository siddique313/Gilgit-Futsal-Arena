export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        App preferences, timezone, and notifications.
      </p>
      <div className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="font-medium">General</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Timezone and display options can be added here.
        </p>
      </div>
    </div>
  );
}

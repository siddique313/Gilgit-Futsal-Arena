import Link from "next/link";

export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Futsal Game GB";
  return (
    <footer className="border-t py-6 sm:py-8">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8">
        <div>
          <p className="font-semibold text-primary">{appName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Brackets, schedules and live results — all in one place.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Product
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link
                href="/dashboard/tournaments"
                className="text-muted-foreground hover:text-foreground"
              >
                Create a Tournament
              </Link>
            </li>
            <li>
              <Link
                href="/find"
                className="text-muted-foreground hover:text-foreground"
              >
                Find Tournaments
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Resources
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground"
              >
                Docs
              </Link>
            </li>
            <li>
              <a
                href="mailto:support@example.com"
                className="text-muted-foreground hover:text-foreground"
              >
                Email us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/layout/PublicHeader";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80";
const FOOTBALL_STADIUM =
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80";

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Futsal Game GB";
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero with football image */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Online tournament maker for brackets, schedules and results
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:mt-6 sm:text-lg lg:mx-0">
                  Create tournament brackets, generate fixtures and keep live
                  standings up to date in one place. For football, futsal,
                  esports and events — without complex systems or Excel files.
                </p>
                <div className="mt-6 sm:mt-10 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Link
                    href="/dashboard/tournaments"
                    className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Start Your Tournament
                  </Link>
                  <Link
                    href="/find"
                    className="inline-flex items-center rounded-lg border border-input bg-background px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium hover:bg-accent transition-colors"
                  >
                    Find Tournaments
                  </Link>
                </div>
              </div>
              <div className="relative order-1 lg:order-2 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[320px] rounded-xl overflow-hidden border bg-muted shadow-lg">
                <Image
                  src={HERO_IMAGE}
                  alt="Football on grass - tournament and match day"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Secondary section with another football image */}
        <section className="border-t bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border bg-muted shadow-md">
                <Image
                  src={FOOTBALL_STADIUM}
                  alt="Football pitch and stadium"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  Brackets, standings and live results in one place
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Run single elimination, round robin or group stages. Share
                  public links, track registrations and update scores from any
                  device.
                </p>
                <Link
                  href="/pricing"
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  See plans and pricing →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 sm:py-8 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="text-center sm:text-left">
            {appName} — Brackets, schedules and live results — all in one place.
          </span>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="/dashboard/tournaments"
              className="hover:text-foreground"
            >
              Create a Tournament
            </Link>
            <Link href="/find" className="hover:text-foreground">
              Find Tournaments
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

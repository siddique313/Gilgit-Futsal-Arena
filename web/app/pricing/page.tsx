import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/layout/PublicHeader";

const PRICING_HERO =
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80";

export default function PricingPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Futsal Game GB";
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center mb-10 lg:mb-12">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                Plans and Pricing
              </h1>
              <p className="mt-2 text-muted-foreground sm:text-lg">
                {appName} is free. We provide a full-featured free plan to
                create your tournament without any cost.
              </p>
            </div>
            <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-xl overflow-hidden border bg-muted shadow-md">
              <Image
                src={PRICING_HERO}
                alt="Football match and teamwork"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Starter (Free)</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Unlimited tournaments</li>
                <li>Single elimination</li>
                <li>Public tournaments</li>
                <li>Rankings and standings</li>
                <li>Max. 16 teams per tournament</li>
              </ul>
              <Link
                href="/dashboard/tournaments"
                className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Get started free
              </Link>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-primary">Premium</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>All Starter features</li>
                <li>Round robin, double elimination</li>
                <li>Private tournaments, custom branding</li>
                <li>Embed on your website</li>
                <li>Priority support</li>
              </ul>
              <span className="mt-6 inline-block rounded-lg border border-primary/50 px-4 py-2 text-sm font-medium text-primary">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center text-sm text-muted-foreground">
          {appName} — Simple pricing for everyone.
        </div>
      </footer>
    </div>
  );
}

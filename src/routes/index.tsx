import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Tractor, Warehouse, ShieldCheck, MapPin, Layers, CheckCircle2, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/client/components/layout/site-header";
import { SiteFooter } from "@/client/components/layout/site-footer";
import { SplitText } from "@/client/components/effects/split-text";
import { SpotlightCard } from "@/client/components/effects/spotlight-card";
import { CardCarousel, CarouselCard } from "@/client/components/effects/card-carousel";
import { CountUp } from "@/client/components/effects/count-up";
import { Button } from "@/client/components/ui/button";
import { PinLegend } from "@/client/components/map/storage-map";
import { facilities } from "@/server/seed";
import { KIND_LABEL } from "@/server/seed";
import { useGranary } from "@/shared/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const reduce = useReducedMotion();
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const role = useGranary((s) => s.role);

  if (isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl">
            <div className="mx-auto size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-mono text-xl font-bold">
              404
            </div>
            <h1 className="mt-4 text-2xl font-medium tracking-tight">404 - Page Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              The requested URL <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground">/</code> was not found or is restricted while logged in.
            </p>
            <div className="mt-6">
              <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
                <Link to={role === "farmer" ? "/farmer" : "/operator"}>
                  <ArrowLeft className="mr-2 size-4" />
                  Return to {role === "farmer" ? "Farmer Desk" : "Warehouse Desk"}
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <SiteHeader />
      <main>
        {/* HERO INTRODUCTORY SUMMARY SECTION */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent) 1px, transparent 1.4px)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Nashik & Niphad Harvest Belt Storage Network
              </span>

              <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl lg:text-[3.2rem] leading-[1.12]">
                Granary: Connecting Harvests to Storage
              </h1>

              <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-[17px]">
                Granary is a real-time digital agricultural storage network. It connects grape, onion, and perishable crop growers across Nashik with verified cold rooms, dry yards, and packhouse facilities.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md">
                  <Link to="/login">
                    Access Portal / Sign In
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Register New User</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative overflow-hidden rounded-[28px] bg-forest text-paper shadow-2xl border border-border">
                <img
                  src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1600&q=75"
                  alt="Nashik vineyard harvest"
                  className="h-[280px] w-full object-cover md:h-[360px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-px border-t border-paper/15 bg-forest/90 p-4 backdrop-blur-sm">
                  <Stat n={facilities.length} label="Registered Yards" />
                  <Stat n={240} suffix=" t" label="Peak Capacity" />
                  <Stat n={100} suffix="%" label="Live Map Sync" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT GRANARY DOES SECTION */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-medium tracking-tight md:text-4xl">
                What Granary Does
              </h2>
              <p className="mt-3 text-muted-foreground text-base">
                An end-to-end digital infrastructure designed specifically for agricultural storage management.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {/* Farmer Summary Card */}
              <SpotlightCard className="p-8 border border-border bg-background shadow-sm">
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Tractor className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-medium">For Farmers & Growers</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Find available storage space around Nashik before leaving the farm. Book cold rooms or dry yards by crop, tonnage, and days, and track stored lots directly on the interactive map until market prices improve.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Live color-coded map pins showing empty, full, and reserved bays.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Instant online booking against live remaining capacity.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Release stored harvest lots with one click when selling.
                  </li>
                </ul>
              </SpotlightCard>

              {/* Warehouse Owner Summary Card */}
              <SpotlightCard className="p-8 border border-border bg-background shadow-sm">
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Warehouse className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-medium">For Warehouse Owners & Operators</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Maximize yard utilization by listing open storage space with custom daily rental rates (₹/ton/day) and location details. Monitor network fill and active incoming lots across all your warehouse units.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Publish available storage space specifying rate, location, and space.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Green-shaded dashboard hierarchy for yards, occupancy, and fill %.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Role-restricted secure access for warehouse management.
                  </li>
                </ul>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* REGISTERED YARDS CAROUSEL OVERVIEW */}
        <section className="px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
              Active Storage Yards on the Belt
            </h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-xl">
              Explore verified cold storages, dry yards, and packhouses currently listed on the Granary network.
            </p>

            <div className="mt-6">
              <PinLegend />
            </div>

            <CardCarousel className="mt-6">
              {facilities.slice(0, 8).map((fac) => (
                <CarouselCard key={fac.id}>
                  <img
                    src={fac.photo}
                    alt={fac.name}
                    className="h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                  />
                  <div className="p-4">
                    <p className="font-medium text-sm text-foreground">{fac.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fac.city} · {KIND_LABEL[fac.kind]}
                    </p>
                    <p className="mt-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      ₹{fac.ratePerTonDay}/ton/day · {fac.capacityTons} t cap
                    </p>
                  </div>
                </CarouselCard>
              ))}
            </CardCarousel>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-4 pb-16 md:px-6 md:pb-24">
          <SpotlightCard className="mx-auto max-w-[1400px] bg-forest p-8 text-paper md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-medium tracking-tight md:text-4xl" style={{ color: "white !important" }}>
                  Ready to manage your harvest storage?
                </h2>
                <p className="mt-2 max-w-xl text-paper/75 text-sm" style={{ color: "white !important" }}>
                  Sign in or register a new user account as a Farmer or Warehouse Owner to access your dashboard.
                </p>
              </div>
              <Button asChild size="lg" className="bg-paper text-forest hover:bg-paper/90 font-medium shrink-0">
                <Link to="/login">
                  Go to Login & Registration Portal
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </SpotlightCard>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({
  n,
  label,
  decimals = 0,
  suffix = "",
}: {
  n: number;
  label: string;
  decimals?: number;
  suffix?: string;
}) {
  return (
    <div className="px-2">
      <p className="font-mono text-lg tabular-nums md:text-xl font-semibold">
        <CountUp value={n} decimals={decimals} suffix={suffix} />
      </p>
      <p className="mt-0.5 text-[11px] text-paper/70">{label}</p>
    </div>
  );
}

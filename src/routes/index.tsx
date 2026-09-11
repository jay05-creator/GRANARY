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
import { useLocale } from "@/client/components/locale-provider";
import { t } from "@/client/i18n";
import type { Role } from "@/shared/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const reduce = useReducedMotion();
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const role = useGranary((s) => s.role);
  const { locale } = useLocale();
  const farmerId = useGranary((s) => s.farmerId);
  const operatorId = useGranary((s) => s.operatorId);

  if (isAuthenticated) {
    return <AuthenticatedHome role={role} farmerId={farmerId} operatorId={operatorId} />;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <SiteHeader />
      <main>
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
                {t("home.badge", locale)}
              </span>

              <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl lg:text-[3.2rem] leading-[1.12]">
                {t("home.title", locale)}
              </h1>

              <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-[17px]">
                {t("home.heroDesc", locale)}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md">
                  <Link to="/login">
                    {t("home.accessPortal", locale)}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">{t("home.registerUser", locale)}</Link>
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
                  <Stat n={facilities.length} label={t("home.registeredYards", locale)} />
                  <Stat n={240} suffix=" T" label={t("home.peakCapacity", locale)} />
                  <Stat n={100} suffix="%" label={t("home.liveMapSync", locale)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-medium tracking-tight md:text-4xl">
                {t("home.whatItDoes", locale)}
              </h2>
              <p className="mt-3 text-muted-foreground text-base">
                {t("home.whatItDoesDesc", locale)}
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <SpotlightCard className="p-8 border border-border bg-background shadow-sm">
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Tractor className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-medium">{t("home.forFarmers", locale)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t("home.forFarmersDesc", locale)}
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t("home.farmerFeature1", locale)}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t("home.farmerFeature2", locale)}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t("home.farmerFeature3", locale)}
                  </li>
                </ul>
              </SpotlightCard>

              <SpotlightCard className="p-8 border border-border bg-background shadow-sm">
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Warehouse className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-medium">{t("home.forOperators", locale)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t("home.forOperatorsDesc", locale)}
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t("home.operatorFeature1", locale)}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t("home.operatorFeature2", locale)}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {t("home.operatorFeature3", locale)}
                  </li>
                </ul>
              </SpotlightCard>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
              {t("home.activeYards", locale)}
            </h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-xl">
              {t("home.activeYardsDesc", locale)}
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
                      ₹{fac.ratePerTonDay}/ton/day · {fac.capacityTons} T {t("common.cap", locale)}
                    </p>
                  </div>
                </CarouselCard>
              ))}
            </CardCarousel>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-6 md:pb-24">
          <SpotlightCard className="mx-auto max-w-[1400px] bg-forest p-8 text-paper md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-medium tracking-tight md:text-4xl" style={{ color: "white !important" }}>
                  {t("home.ready", locale)}
                </h2>
                <p className="mt-2 max-w-xl text-paper/75 text-sm" style={{ color: "white !important" }}>
                  {t("home.readyDesc", locale)}
                </p>
              </div>
              <Button asChild size="lg" className="bg-paper text-forest hover:bg-paper/90 font-medium shrink-0">
                <Link to="/login">
                  {t("home.goToLogin", locale)}
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

function AuthenticatedHome({ role, farmerId, operatorId }: { role: Role; farmerId: string; operatorId: string }) {
  const farmersList = useGranary((s) => s.farmersList);
  const operatorsList = useGranary((s) => s.operatorsList);
  const lots = useGranary((s) => s.lots);
  const facilities = useGranary((s) => s.facilities);
  const farmerRequests = useGranary((s) => s.farmerRequests);

  const currentFarmer = farmersList.find((f) => f.id === farmerId) || farmersList[0];
  const currentOperator = operatorsList.find((o) => o.id === operatorId) || operatorsList[0];

  const myLots = lots.filter((l) => l.farmerId === farmerId && l.status !== "released");
  const currentOp = operatorsList.find((o) => o.id === operatorId);
  const operatorFacilities = currentOp ? facilities.filter((f) => currentOp.facilityIds.includes(f.id)) : [];

  const activeRequestsCount = farmerRequests.filter(
    (r) => (role === "farmer" ? r.farmerId === farmerId : true) && r.status === "pending"
  ).length;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground relative overflow-hidden">
      <SiteHeader />
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12 max-w-[1400px] mx-auto w-full space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-emerald-900/10 to-transparent p-6 md:p-8 shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Active Session · {role === "farmer" ? "Farmer Account" : "Warehouse Owner Desk"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-300">
                  Online
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-medium tracking-tight">
                Welcome back, {role === "farmer" ? currentFarmer?.name : currentOperator?.name}!
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                {role === "farmer"
                  ? `Manage harvest storage lots in Niphad & Nashik, search cold rooms, and track requests.`
                  : `Monitor warehouse capacity, approve incoming farmer requests, and publish yard rates.`}
              </p>
            </div>

            {/* Direct Desk Launch Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md">
                <Link to={role === "farmer" ? "/farmer" : "/operator"}>
                  {role === "farmer" ? <Tractor className="mr-2 size-5" /> : <Warehouse className="mr-2 size-5" />}
                  Open {role === "farmer" ? "Farmer Desk" : "Warehouse Desk"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted"
              >
                <Link to={role === "farmer" ? "/operator" : "/farmer"}>
                  Switch to {role === "farmer" ? "Warehouse Desk" : "Farmer Desk"}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SpotlightCard className="p-5 border border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Lots</span>
              <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-3 text-2xl font-mono font-bold text-foreground">
              {role === "farmer" ? myLots.length : operatorFacilities.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {role === "farmer" ? "Stored lots in network" : "Facilities under management"}
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 border border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Requests</span>
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-3 text-2xl font-mono font-bold text-foreground">
              {activeRequestsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {role === "farmer" ? "Requests awaiting yard approval" : "Incoming requests to review"}
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 border border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Network Yards</span>
              <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-3 text-2xl font-mono font-bold text-foreground">
              {facilities.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Verified cold rooms & dry yards</p>
          </SpotlightCard>

          <SpotlightCard className="p-5 border border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Capacity</span>
              <Warehouse className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-3 text-2xl font-mono font-bold text-foreground">
              {facilities.reduce((sum, f) => sum + f.capacityTons, 0)} t
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Nashik storage network peak</p>
          </SpotlightCard>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Desk Access Card */}
          <SpotlightCard className="p-6 md:p-8 border border-border bg-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Tractor className="size-5" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Farmer Storage Desk</h3>
                <p className="text-xs text-muted-foreground">Search facilities, request bays, and track harvest lots.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse interactive maps of cold storages and dry yards across Nashik, check live daily rates, submit allocation requests, and monitor your stored crops.
            </p>
            <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
              <Link to="/farmer">
                Go to Farmer Desk <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </SpotlightCard>

          {/* Owner Desk Access Card */}
          <SpotlightCard className="p-6 md:p-8 border border-border bg-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Warehouse className="size-5" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Warehouse Owner Desk</h3>
                <p className="text-xs text-muted-foreground">Review incoming farmer requests, manage yards, and track capacity.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review pending storage applications from farmers, allocate yard space, publish daily rental rates (₹/ton/day), and view occupancy metrics.
            </p>
            <Button asChild variant="outline" className="w-full border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10">
              <Link to="/operator">
                Go to Warehouse Desk <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </SpotlightCard>
        </div>

        {/* Network Facilities Preview */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-medium">Verified Storage Facilities</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Explore available yards across Nashik and Niphad.</p>
            </div>
            <PinLegend />
          </div>

          <CardCarousel>
            {facilities.slice(0, 8).map((fac) => (
              <CarouselCard key={fac.id}>
                <img
                  src={fac.photo}
                  alt={fac.name}
                  className="h-36 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
                <div className="p-3.5">
                  <p className="font-medium text-sm text-foreground truncate">{fac.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {fac.city} · {KIND_LABEL[fac.kind]}
                  </p>
                  <p className="mt-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    ₹{fac.ratePerTonDay}/ton/day · {fac.capacityTons} t
                  </p>
                </div>
              </CarouselCard>
            ))}
          </CardCarousel>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

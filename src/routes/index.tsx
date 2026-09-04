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

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const reduce = useReducedMotion();
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const role = useGranary((s) => s.role);
  const { locale } = useLocale();

  if (isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl">
            <div className="mx-auto size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-mono text-xl font-bold">
              404
            </div>
            <h1 className="mt-4 text-2xl font-medium tracking-tight">{t("error.404", locale)}</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("error.404desc", locale)}
            </p>
            <div className="mt-6">
              <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
                <Link to={role === "farmer" ? "/farmer" : "/operator"}>
                  <ArrowLeft className="mr-2 size-4" />
                  {role === "farmer" ? t("error.returnFarmer", locale) : t("error.returnOperator", locale)}
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

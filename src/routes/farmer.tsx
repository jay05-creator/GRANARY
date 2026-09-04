import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, ShieldAlert, Sparkles, Settings, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/client/components/layout/site-header";
import { StorageMap, PinLegend } from "@/client/components/map/storage-map";
import { FacilityCard } from "@/client/components/farmer/facility-card";
import { FacilityDetail } from "@/client/components/farmer/facility-detail";
import { BookDialog } from "@/client/components/farmer/book-dialog";
import { AiRequestModal } from "@/client/components/farmer/ai-request-modal";
import { MarketTrendsModal } from "@/client/components/farmer/market-trends-modal";
import { FarmerApprovalAlertModal } from "@/client/components/farmer/approval-alert-modal";
import { Badge } from "@/client/components/ui/badge";

import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/client/components/ui/sheet";
import { CountUp } from "@/client/components/effects/count-up";
import { farmer } from "@/server/seed";
import { shortDate, tons } from "@/client/format";
import { occupancyOf, pinKindOf, useGranary } from "@/shared/store";
import type { Facility } from "@/shared/types";
import { cn } from "@/client/cn";
import { ProfileEditDialog } from "@/client/components/profile-edit-dialog";
import { signOut } from "@/shared/auth/client";
import { useCurrentUser } from "@/shared/auth/use-current-user";

export const Route = createFileRoute("/farmer")({ component: FarmerDesk });

function FarmerDesk() {
  const navigate = useNavigate();
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const role = useGranary((s) => s.role);
  const facilities = useGranary((s) => s.facilities);
  const lots = useGranary((s) => s.lots);
  const farmerId = useGranary((s) => s.farmerId);
  const farmerRequests = useGranary((s) => s.farmerRequests);
  const selectedId = useGranary((s) => s.selectedId);
  const mapFilter = useGranary((s) => s.mapFilter);
  const query = useGranary((s) => s.query);
  const selectFacility = useGranary((s) => s.selectFacility);
  const setMapFilter = useGranary((s) => s.setMapFilter);
  const setQuery = useGranary((s) => s.setQuery);
  const refreshFromDb = useGranary((s) => s.refreshFromDb);

  // Re-hydrate on mount so we pick up any lots allocated since last load
  useEffect(() => {
    refreshFromDb();
  }, []);

  const approvedNotification = useMemo(
    () =>
      farmerRequests.find(
        (r) => r.farmerId === farmerId && r.status === "approved" && !r.notifiedFarmer
      ) || null,
    [farmerRequests, farmerId]
  );
  const myLots = useMemo(
    () => lots.filter((l) => l.farmerId === farmerId && l.status !== "released"),
    [lots, farmerId],
  );
  const farmersList = useGranary((s) => s.farmersList);
  const [booking, setBooking] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(true);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [myProfile, setMyProfile] = useState<Record<string, unknown> | null>(null);

  // Fetch profile
  useEffect(() => {
    if (isAuthenticated) {
      import("@/server/modules/granary").then(({ getMyProfile }) => {
        getMyProfile().then((p) => {
          const profile = p as Record<string, unknown> | null;
          setMyProfile(profile);
          if (profile && profile.name) {
            const currentList = useGranary.getState().farmersList;
            const updated = currentList.map((f) =>
              f.id === farmerId
                ? {
                    ...f,
                    name: String(profile.name),
                    farm: String(profile.farm_or_contact || f.farm),
                    village: String(profile.village_or_company || f.village),
                  }
                : f
            );
            useGranary.setState({ farmersList: updated });
          }
        }).catch(() => {});
      }).catch(() => {});
    }
  }, [isAuthenticated, farmerId]);

  const currentUser = useCurrentUser();
  const activeFarmer = useMemo(() => {
    if (myProfile && (myProfile.name || myProfile.farm_or_contact)) {
      const name = String(myProfile.name || "Farmer");
      return {
        id: String(myProfile.user_id || farmerId),
        name,
        farm: String(myProfile.farm_or_contact || `${name}'s Farm`),
        village: String(myProfile.village_or_company || "Niphad"),
        district: "Nashik",
        crops: (myProfile.crops as string[]) || ["Grapes", "Onion"],
        lat: Number(myProfile.lat || 20.08),
        lng: Number(myProfile.lng || 74.11),
        photo: currentUser?.profileImageUrl || `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=d7e4d4`,
      };
    }
    const found = farmersList.find((f) => f.id === farmerId);
    if (found) return { ...found, photo: currentUser?.profileImageUrl || found.photo };
    return { ...farmer, photo: currentUser?.profileImageUrl || farmer.photo };
  }, [myProfile, farmersList, farmerId, currentUser]);
  const counts = useMemo(() => {
    let empty = 0;
    let full = 0;
    let mine = 0;
    for (const f of facilities) {
      const k = pinKindOf(f, lots, farmerId);
      if (k === "empty") empty += 1;
      else if (k === "full") full += 1;
      else mine += 1;
    }
    return { empty, full, mine };
  }, [facilities, lots, farmerId]);

  const dbHydrated = useGranary((s) => s.dbHydrated);

  if (!dbHydrated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-transparent">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600/30 border-t-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-transparent text-foreground">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
            <div className="mx-auto size-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="size-7" />
            </div>
            <h1 className="mt-4 text-2xl font-medium tracking-tight">Sign In Required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in or register a Farmer account to access the Farmer Desk and book harvest storage.
            </p>
            <div className="mt-6">
              <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
                <Link to="/login">Go to Login & Registration Portal</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (role === "operator") {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-transparent text-foreground">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl">
            <div className="mx-auto size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <ShieldAlert className="size-7" />
            </div>
            <h1 className="mt-4 text-2xl font-medium tracking-tight">Unauthorized Access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You are currently logged in as a <strong>Warehouse Owner</strong>. Warehouse accounts are restricted from accessing the Farmer Desk.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Button asChild className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
                <Link to="/operator">Go to Warehouse Desk</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/login">Switch / Register Account</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  const filtered = facilities.filter((f) => {
    const k = pinKindOf(f, lots, farmerId);
    if (mapFilter !== "all" && k !== mapFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      f.crops.some((c) => c.toLowerCase().includes(q))
    );
  });

  const rankedFacilities = filtered
    .map((facility) => ({
      facility,
      available: Math.max(0, facility.capacityTons - occupancyOf(facility, lots)),
    }))
    .sort((a, b) => b.available - a.available);
  const featuredFacilities = rankedFacilities.slice(0, 4).map(({ facility }) => facility);
  const remainingFacilities = rankedFacilities.slice(4).map(({ facility }) => facility);

  const selected = facilities.find((f) => f.id === selectedId) ?? null;
  const storedTons = myLots.reduce((n, l) => n + l.tons, 0);

  function pick(id: string) {
    selectFacility(id);
    if (window.matchMedia("(max-width: 1023px)").matches) setSheetOpen(true);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-transparent">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-3 py-4 md:px-5">
        <div className="flex flex-col gap-3 rounded-3xl bg-card px-4 py-4 shadow-[var(--shadow-border)] md:flex-row md:items-center md:justify-between md:px-5">
          <div className="flex items-center gap-3">
            <img
              src={activeFarmer.photo}
              alt=""
              className="size-12 rounded-2xl bg-muted outline outline-1 -outline-offset-1 outline-black/10"
            />
            <div>
              <p className="font-medium">{activeFarmer.name}</p>
              <p className="text-[13px] text-muted-foreground">
                {activeFarmer.farm} · {activeFarmer.village}
              </p>
            </div>
          </div>

          {/* AI STORAGE REQUEST & ADVISORY BUTTON */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => setProfileEditOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-2xl text-xs"
            >
              <Settings className="size-3.5 mr-1" />
              Edit Profile
            </Button>
            <Button
              onClick={() => setMarketModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-md rounded-2xl px-4 py-2.5"
            >
              <TrendingUp className="size-4 text-blue-200" />
              <span>Market Trends Review 📈</span>
            </Button>
            <Button
              onClick={() => setAiModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-2 shadow-md rounded-2xl px-4 py-2.5"
            >
              <Sparkles className="size-4 text-emerald-300" />
              <span>Generate Storage Request & AI Advisory</span>
            </Button>

            <div className="grid grid-cols-3 gap-3 md:flex md:gap-8 border-l border-border pl-3 md:pl-5">
              <MiniStat value={myLots.length} label="Active lots" />
              <MiniStat value={Number(storedTons.toFixed(1))} decimals={1} suffix=" t" label="In storage" />
              <MiniStat value={counts.empty} label="Yards open" />
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <section className="relative h-[52dvh] min-h-[340px] overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-border)] lg:h-[min(72dvh,740px)]">
            <StorageMap
              facilities={facilities}
              selectedId={selectedId}
              filter={mapFilter}
              onSelect={pick}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-col gap-2 sm:inset-x-4 sm:top-4">
              <div className="pointer-events-auto flex gap-2 overflow-x-auto rounded-2xl bg-card/95 p-2 shadow-[var(--shadow-border)] backdrop-blur-sm [scrollbar-width:none]">
                <FilterChip active={mapFilter === "all"} onClick={() => setMapFilter("all")}>
                  All {facilities.length}
                </FilterChip>
                <FilterChip
                  active={mapFilter === "empty"}
                  onClick={() => setMapFilter("empty")}
                  swatch="bg-pin-empty"
                >
                  Available {counts.empty}
                </FilterChip>
                <FilterChip
                  active={mapFilter === "full"}
                  onClick={() => setMapFilter("full")}
                  swatch="bg-pin-full"
                >
                  Full {counts.full}
                </FilterChip>
                <FilterChip
                  active={mapFilter === "mine"}
                  onClick={() => setMapFilter("mine")}
                  swatch="bg-pin-mine"
                >
                  Your harvest {counts.mine}
                </FilterChip>
              </div>
              <div className="pointer-events-auto w-fit max-w-full rounded-2xl bg-card/95 px-3 py-2 shadow-[var(--shadow-border)]">
                <PinLegend />
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search yards, crops, towns"
                className="pl-10"
              />
            </div>
            <div className="hidden min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-border)] lg:flex">
              {selected ? (
                <div className="overflow-y-auto p-4">
                  <FacilityDetail facility={selected} onBook={() => setBooking(true)} />
                </div>
              ) : (
                <YardList
                  facilities={featuredFacilities}
                  selectedId={selectedId}
                  onSelect={pick}
                />
              )}
              {selected && (
                <div className="border-t border-border p-3">
                  <Button variant="ghost" className="w-full" onClick={() => selectFacility(null)}>
                    Back to list
                  </Button>
                </div>
              )}
            </div>
            <div className="lg:hidden">
              <YardList
                facilities={featuredFacilities}
                selectedId={selectedId}
                onSelect={pick}
              />
            </div>
          </aside>
        </div>

        <section className="rounded-3xl bg-card p-4 shadow-[var(--shadow-border)] md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-medium">More storage yards</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Other yards ranked by remaining storage capacity.
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {remainingFacilities.length} more
            </span>
          </div>
          {remainingFacilities.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              The four yards with the most available space are shown beside the map.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {remainingFacilities.map((facility) => (
                <li key={facility.id}>
                  <FacilityCard
                    facility={facility}
                    selected={facility.id === selectedId}
                    onSelect={() => pick(facility.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-card p-4 shadow-[var(--shadow-border)] md:p-5">
          <h2 className="text-base font-medium">Your lots</h2>
          {myLots.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing stored yet. Pick an available pin and book a bay.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {myLots.map((lot) => {
                const fac = facilities.find((f) => f.id === lot.facilityId);
                return (
                  <li key={lot.id}>
                    <button
                      type="button"
                      onClick={() => fac && pick(fac.id)}
                      className="w-full rounded-2xl bg-muted/70 p-3 text-left transition-[background-color] duration-150 hover:bg-muted"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{lot.variety}</p>
                        <Badge variant="mine">{lot.status}</Badge>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        {fac?.name} · {tons(lot.tons)} · until {shortDate(lot.until)}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="overflow-y-auto p-5">
          <SheetTitle className="sr-only">Yard detail</SheetTitle>
          {selected && (
            <FacilityDetail
              facility={selected}
              onBook={() => {
                setSheetOpen(false);
                setBooking(true);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <BookDialog facility={selected} open={booking} onOpenChange={setBooking} />
      <AiRequestModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        defaultLocation={`${activeFarmer.village}, ${activeFarmer.district}`}
      />
      
      <MarketTrendsModal
        open={marketModalOpen}
        onOpenChange={setMarketModalOpen}
      />
      <FarmerApprovalAlertModal
        open={approvalModalOpen && !!approvedNotification}
        onOpenChange={setApprovalModalOpen}
        request={approvedNotification}
      />
      <ProfileEditDialog
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
        profile={{
          name: (myProfile?.name as string) || activeFarmer.name,
          phone: (myProfile?.phone as string) || "",
          village_or_company: (myProfile?.village_or_company as string) || activeFarmer.village,
          farm_or_contact: (myProfile?.farm_or_contact as string) || activeFarmer.farm,
        }}
        onSave={async (updates) => {
          const { updateMyProfile } = await import("@/server/modules/granary");
          await updateMyProfile({ data: updates });
          if (updates.photo) {
            const { authClient } = await import("@/shared/auth/client");
            await authClient.updateUser({ image: updates.photo });
          }
          refreshFromDb();
          const { getMyProfile } = await import("@/server/modules/granary");
          const p = (await getMyProfile()) as Record<string, unknown> | null;
          setMyProfile(p);
          if (p && p.name) {
            const currentList = useGranary.getState().farmersList;
            const updated = currentList.map((f) =>
              f.id === farmerId
                ? {
                    ...f,
                    name: String(p.name),
                    farm: String(p.farm_or_contact || f.farm),
                    village: String(p.village_or_company || f.village),
                  }
                : f
            );
            useGranary.setState({ farmersList: updated });
          }
        }}
        onDeleteAccount={async () => {
          const { deleteMyAccount } = await import("@/server/modules/granary");
          await deleteMyAccount();
          useGranary.getState().logout();
          await signOut("/login");
        }}
      />
    </div>

  );
}

function MiniStat({
  value,
  label,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  label: string;
  decimals?: number;
  suffix?: string;
}) {
  return (
    <div>
      <p className="font-mono text-lg tabular-nums">
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  swatch,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  swatch?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-[background-color,color] duration-150",
        active ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80",
      )}
    >
      {swatch && <span className={cn("size-2 rounded-full", swatch)} />}
      {children}
    </button>
  );
}

function YardList({
  facilities,
  selectedId,
  onSelect,
}: {
  facilities: Facility[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (facilities.length === 0) {
    return (
      <p className="p-5 text-sm text-muted-foreground">No yards match that filter.</p>
    );
  }
  return (
    <ul className="flex flex-col gap-2 overflow-y-auto p-3">
      {facilities.map((f) => (
        <li key={f.id}>
          <FacilityCard
            facility={f}
            selected={f.id === selectedId}
            onSelect={() => onSelect(f.id)}
          />
        </li>
      ))}
    </ul>
  );
}

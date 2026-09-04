import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  PlusCircle,
  Warehouse,
  PackageCheck,
  Activity,
  Boxes,
  MapPin,
  IndianRupee,
  ShieldAlert,
  X,
  CheckCircle2,
  Thermometer,
  Layers,
  Tractor,
  Settings,
} from "lucide-react";
import { SiteHeader } from "@/client/components/layout/site-header";
import { StorageMap, PinLegend } from "@/client/components/map/storage-map";
import { RequestReviewDialog } from "@/client/components/operator/request-review-dialog";
import { ProfileEditDialog } from "@/client/components/profile-edit-dialog";
import { signOut } from "@/shared/auth/client";

import { Badge } from "@/client/components/ui/badge";
import { Progress } from "@/client/components/ui/progress";
import { Button } from "@/client/components/ui/button";
import { CountUp } from "@/client/components/effects/count-up";
import { SpotlightCard } from "@/client/components/effects/spotlight-card";
import { KIND_LABEL } from "@/server/seed";
import { occupancyPct, shortDate, tons } from "@/client/format";
import { occupancyOf, pinKindOf, useGranary } from "@/shared/store";
import type { FacilityKind } from "@/shared/types";

export const Route = createFileRoute("/operator")({ component: OperatorDesk });

function OperatorDesk() {
  const navigate = useNavigate();
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const role = useGranary((s) => s.role);
  const all = useGranary((s) => s.facilities);
  const operatorsList = useGranary((s) => s.operatorsList);
  const lots = useGranary((s) => s.lots);
  const farmerId = useGranary((s) => s.farmerId);
  const selectedId = useGranary((s) => s.selectedId);
  const selectFacility = useGranary((s) => s.selectFacility);
  const operatorId = useGranary((s) => s.operatorId);
  const addFacility = useGranary((s) => s.addFacility);
  const farmerRequests = useGranary((s) => s.farmerRequests);
  const selectedRequestId = useGranary((s) => s.selectedRequestId);
  const selectRequest = useGranary((s) => s.selectRequest);
  const refreshFromDb = useGranary((s) => s.refreshFromDb);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [myProfile, setMyProfile] = useState<Record<string, unknown> | null>(null);

  // Re-hydrate on mount so we see latest requests and lots
  useEffect(() => {
    refreshFromDb();
  }, []);

  // Fetch profile
  useEffect(() => {
    if (isAuthenticated) {
      import("@/server/modules/granary").then(({ getMyProfile }) => {
        getMyProfile().then((p) => {
          const profile = p as Record<string, unknown> | null;
          setMyProfile(profile);
          if (profile && (profile.name || profile.village_or_company)) {
            const currentList = useGranary.getState().operatorsList;
            const updated = currentList.map((o) =>
              o.id === operatorId
                ? {
                    ...o,
                    name: String(profile.village_or_company || profile.name),
                    contact: String(profile.phone || profile.farm_or_contact || o.contact),
                  }
                : o
            );
            useGranary.setState({ operatorsList: updated });
          }
        }).catch(() => {});
      }).catch(() => {});
    }
  }, [isAuthenticated, operatorId]);

  const op = useMemo(() => {
    if (myProfile && (myProfile.name || myProfile.village_or_company || myProfile.farm_or_contact)) {
      return {
        id: String(myProfile.user_id || operatorId),
        name: String(myProfile.village_or_company || myProfile.name || "Warehouse Owner"),
        contact: String(myProfile.phone || myProfile.farm_or_contact || "Operator"),
        facilityIds: (operatorsList.find((o) => o.id === operatorId) || operatorsList[0])?.facilityIds || [],
      };
    }
    return operatorsList.find((o) => o.id === operatorId) || operatorsList[0];
  }, [myProfile, operatorsList, operatorId]);
  const pendingRequests = useMemo(
    () => farmerRequests.filter((r) => 
      r.status === "pending" && 
      !(r.ignoredByOperatorIds || []).includes(operatorId) && 
      (r.expiresAt ? new Date(r.expiresAt) > new Date() : true)
    ),
    [farmerRequests, operatorId]
  );
  const activeReviewRequest =
    farmerRequests.find((r) => r.id === selectedRequestId) || null;
  const facilities = useMemo(
    () => all.filter((f) => op.facilityIds.includes(f.id)),
    [all, op],
  );

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
              Please sign in or register a Warehouse Owner account to access the Warehouse Desk and manage storage.
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

  if (role === "farmer") {
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
              You are currently logged in as a <strong>Farmer</strong>. Farmer accounts are restricted from accessing the Warehouse Owner Desk.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Button asChild className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
                <Link to="/farmer">Go to Farmer Desk</Link>
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

  const inbound = lots.filter(
    (l) =>
      facilities.some((f) => f.id === l.facilityId) && l.status !== "released",
  );

  const used = facilities.reduce((n, f) => n + occupancyOf(f, lots), 0);
  const cap = facilities.reduce((n, f) => n + f.capacityTons, 0);
  const avail = Math.max(0, cap - used);
  const overallFill = occupancyPct(used, cap);


  return (
    <div className="flex min-h-[100dvh] flex-col bg-transparent text-foreground">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-3 py-4 md:px-5">
        
        {/* Warehouse Desk Top Banner */}
        <SpotlightCard className="p-5 md:p-6 border border-emerald-900/30 dark:border-emerald-800/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Warehouse className="size-3.5" />
                Warehouse Owner Dashboard
              </span>
              <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">
                {op.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{op.contact}</p>
            </div>

            {/* List Available Storage Action Button */}
            <div className="flex items-center gap-3">
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
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-emerald-900/20 transition-all gap-2"
              >
                <PlusCircle className="size-5" />
                List Available Storage
              </Button>
            </div>
          </div>

          {/* GREEN SHADED GROUPING METRIC CARDS */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            
            {/* Shade 1: Deep Emerald Green (Total Yards) */}
            <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/80 p-4 text-emerald-50 shadow-md">
              <div className="flex items-center justify-between text-emerald-300">
                <span className="text-[12px] font-medium uppercase tracking-wider">Total Yards</span>
                <Warehouse className="size-4 opacity-80" />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">
                <CountUp value={facilities.length} />
              </p>
              <p className="mt-1 text-[11px] text-emerald-300/80">Active registered yards</p>
            </div>

            {/* Shade 2: Rich Sage Green (Storage Occupied) */}
            <div className="rounded-2xl border border-green-700/50 bg-green-900/60 p-4 text-green-50 shadow-md">
              <div className="flex items-center justify-between text-green-300">
                <span className="text-[12px] font-medium uppercase tracking-wider">Occupied</span>
                <PackageCheck className="size-4 opacity-80" />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">
                <CountUp value={Number(used.toFixed(1))} decimals={1} suffix=" T" />
              </p>
              <p className="mt-1 text-[11px] text-green-300/80">Stored harvest lots</p>
            </div>

            {/* Shade 3: Teal Mint Green (Network Fill %) */}
            <div className="rounded-2xl border border-teal-700/50 bg-teal-950/80 p-4 text-teal-50 shadow-md">
              <div className="flex items-center justify-between text-teal-300">
                <span className="text-[12px] font-medium uppercase tracking-wider">Network Fill</span>
                <Activity className="size-4 opacity-80" />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">
                <CountUp value={overallFill} suffix="%" />
              </p>
              <p className="mt-1 text-[11px] text-teal-300/80">Occupancy load across network</p>
            </div>

            {/* Shade 4: Leaf / Lime Green (Available Capacity) */}
            <div className="rounded-2xl border border-lime-700/50 bg-lime-950/80 p-4 text-lime-50 shadow-md">
              <div className="flex items-center justify-between text-lime-300">
                <span className="text-[12px] font-medium uppercase tracking-wider">Available Space</span>
                <Boxes className="size-4 opacity-80" />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">
                <CountUp value={Number(avail.toFixed(1))} decimals={1} suffix=" T" />
              </p>
              <p className="mt-1 text-[11px] text-lime-300/80">Open storage ready to list</p>
            </div>

          </div>
        </SpotlightCard>

        {/* MAP & WAREHOUSE SECTIONS GRID */}
        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.9fr)]">
          <section className="relative h-[48dvh] min-h-[320px] overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-border)] lg:h-[min(64dvh,640px)]">
            <StorageMap
              facilities={all}
              selectedId={selectedId}
              filter="all"
              onSelect={selectFacility}
              onRequestSelect={(reqId) => selectRequest(reqId)}
              showFarm={false}
              showFarmerRequestsOnly={true}
              className="absolute inset-0"
            />
            <div className="absolute left-3 top-3 z-[500] rounded-2xl bg-card/95 px-3.5 py-2 shadow-[var(--shadow-border)] flex items-center gap-2 border border-border">
              <span className="size-3 rounded-full bg-emerald-600 border border-white animate-pulse" />
              <span className="text-xs font-semibold text-foreground">
                Farmers with Pending Storage Requests ({pendingRequests.length})
              </span>
            </div>
          </section>

          {/* DIFFERENT WAREHOUSE SECTIONS LIST (DISTINCT GREEN SHADING) */}
          <aside className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white drop-shadow-sm flex items-center gap-1.5">
                <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
                Warehouse Sections ({facilities.length})
              </h2>
              <span className="text-xs text-muted-foreground">Click to inspect on map</span>
            </div>

            {facilities.map((f) => {
              const usedF = occupancyOf(f, lots);
              const availF = Math.max(0, f.capacityTons - usedF);
              const pct = occupancyPct(usedF, f.capacityTons);
              const isSelected = selectedId === f.id;

              // Custom palette styling
              let cardBg = "bg-[#201513] border-[#4D453A]";
              let badgeBg = "bg-[#073D2D] text-emerald-400 border-emerald-500/30";
              let progressIndicator = "bg-emerald-500";

              if (pct >= 85) {
                badgeBg = "bg-red-950/40 text-red-400 border-red-500/30";
                progressIndicator = "bg-red-500";
              } else if (pct >= 50) {
                badgeBg = "bg-emerald-950/40 text-emerald-400 border-emerald-500/30";
                progressIndicator = "bg-emerald-500";
              }

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => selectFacility(f.id)}
                  className={`group relative overflow-hidden rounded-3xl p-4 text-left border transition-all shadow-[var(--shadow-border)] ${cardBg} ${
                    isSelected ? "ring-2 ring-emerald-500 shadow-md" : "hover:border-emerald-500/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-base text-white group-hover:text-emerald-400 transition-colors">
                        {f.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-300 flex items-center gap-1">
                        <MapPin className="size-3 text-emerald-500 shrink-0" />
                        {f.city} ({f.address}) · <span className="font-medium">{KIND_LABEL[f.kind]}</span>
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums ${badgeBg}`}>
                      {pct}% full
                    </span>
                  </div>

                  <Progress
                    className="mt-3.5 h-2 bg-[#4D453A]"
                    value={pct}
                    indicatorClassName={progressIndicator}
                  />

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>Occupied: <strong className="text-gray-100">{tons(usedF)}</strong> / {tons(f.capacityTons)}</span>
                    <span className="text-emerald-400 font-semibold">Available: {tons(availF)}</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-[#4D453A]/50 pt-2 text-[11px]">
                    <span className="text-gray-300 font-medium">Rate: ₹{f.ratePerTonDay}/ton/day</span>
                    {f.tempRange && (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono">
                        <Thermometer className="size-3" />
                        {f.tempRange}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </aside>
        </div>

        {/* INCOMING FARMER STORAGE REQUESTS CARDS SECTION */}
        <section className="rounded-3xl bg-card p-4 border border-emerald-500/30 shadow-[var(--shadow-border)] md:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium flex items-center gap-2 text-foreground">
              <Tractor className="size-4 text-emerald-600 dark:text-emerald-400" />
              Incoming Farmer Storage Requests ({pendingRequests.length})
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              Click pin or card to Accept / Deny Storage
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              No pending farmer storage requests currently active on the network.
            </p>
          ) : (
            <div className="mt-3 grid gap-3 grid-cols-1 md:grid-cols-3">
              {pendingRequests.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => selectRequest(req.id)}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {req.farmerName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-emerald-600 shrink-0" />
                          {req.farmerVillage}
                        </p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
                        Pending
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-background/80 p-2 rounded-xl border border-border/60 font-mono">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase">Harvest</span>
                        <p className="font-bold text-foreground">{req.tons}t {req.crop}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase">Duration</span>
                        <p className="font-bold text-emerald-700 dark:text-emerald-400">{req.days} Days</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-emerald-500/20 text-center">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1 group-hover:underline">
                      ⚡ Review & Allocate Storage →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* INBOUND HARVEST LOTS TABLE SECTION */}
        <section className="rounded-3xl bg-card p-4 border border-border shadow-[var(--shadow-border)] md:p-5">
          <h2 className="text-base font-medium flex items-center gap-2">
            <PackageCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            Active Stored Lots Across Your Yards
          </h2>
          {inbound.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No active lots currently stored on your yards.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {inbound.map((lot) => {
                const fac = all.find((f) => f.id === lot.facilityId);
                return (
                  <li key={lot.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">
                        {lot.variety} {lot.crop}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        Yard: <strong className="text-foreground">{fac?.name}</strong> ({fac?.city}) · Reserved until {shortDate(lot.until)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{tons(lot.tons)}</p>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{lot.status}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

      </div>

      {/* POP-UP MENU DIALOG FOR ACCEPTING/DENYING FARMER REQUEST */}
      <RequestReviewDialog
        open={!!selectedRequestId}
        onOpenChange={(open) => !open && selectRequest(null)}
        request={activeReviewRequest}
      />


      {/* OWNER: LIST AVAILABLE STORAGE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-card p-6 border border-border shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <PlusCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                    List Available Storage Space
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Publish your open storage capacity, daily rate, and location for farmers to book.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <ListStorageForm
                onSuccess={(newFac) => {
                  setIsModalOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProfileEditDialog
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
        profile={{
          name: (myProfile?.name as string) || op.name,
          phone: (myProfile?.phone as string) || op.contact,
          village_or_company: (myProfile?.village_or_company as string) || "",
          farm_or_contact: (myProfile?.farm_or_contact as string) || op.name,
        }}
        onSave={async (updates) => {
          const { updateMyProfile } = await import("@/server/modules/granary");
          const { photo, ...profileUpdates } = updates;
          await updateMyProfile({ data: profileUpdates });
          if (photo) {
            const { authClient } = await import("@/shared/auth/client");
            await authClient.updateUser({ image: photo });
          }
          refreshFromDb();
          const { getMyProfile } = await import("@/server/modules/granary");
          const p = (await getMyProfile()) as Record<string, unknown> | null;
          setMyProfile(p);
          if (p && (p.name || p.village_or_company)) {
            const currentList = useGranary.getState().operatorsList;
            const updated = currentList.map((o) =>
              o.id === operatorId
                ? {
                    ...o,
                    name: String(p.village_or_company || p.name),
                    contact: String(p.phone || p.farm_or_contact || o.contact),
                  }
                : o
            );
            useGranary.setState({ operatorsList: updated });
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

{/* Storage Listing Form Component */}
function ListStorageForm({ onSuccess }: { onSuccess: (fac: any) => void }) {
  const addFacility = useGranary((s) => s.addFacility);

  const [name, setName] = useState("");
  const [city, setCity] = useState("Niphad");
  const [address, setAddress] = useState("");
  const [capacityTons, setCapacityTons] = useState<number>(50);
  const [ratePerTonDay, setRatePerTonDay] = useState<number>(18);
  const [kind, setKind] = useState<FacilityKind>("cold");
  const [tempRange, setTempRange] = useState("0 to 4 C");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Grapes", "Onion"]);

  const [error, setError] = useState("");

  const cropOptions = ["Grapes", "Onion", "Raisins", "Pomegranate", "Tomato", "Grain", "Strawberry"];

  const toggleCrop = (c: string) => {
    if (selectedCrops.includes(c)) {
      setSelectedCrops(selectedCrops.filter((crop) => crop !== c));
    } else {
      setSelectedCrops([...selectedCrops, c]);
    }
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a warehouse or yard name.");
      return;
    }
    if (!address.trim()) {
      setError("Please enter the specific location address.");
      return;
    }
    if (capacityTons <= 0) {
      setError("Capacity space must be greater than zero.");
      return;
    }
    if (ratePerTonDay <= 0) {
      setError("Rental rate must be greater than zero.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      // Local store for immediate UI
      const fac = addFacility({
        name,
        city,
        address,
        capacityTons,
        ratePerTonDay,
        kind,
        tempRange: kind === "cold" ? tempRange : undefined,
        crops: selectedCrops,
      });

      // Persist to secure DB when authenticated
      try {
        const { addFacility: addFacilityServer, loadCatalog } = await import(
          "@/server/modules/granary"
        );
        await addFacilityServer({
          data: {
            name,
            city,
            address,
            capacityTons,
            ratePerTonDay,
            kind,
            tempRange: kind === "cold" ? tempRange : undefined,
            crops: selectedCrops,
          },
        });
        try {
          const catalog = await loadCatalog();
          useGranary.getState().hydrateFromDb({
            facilities: catalog.facilities,
            operatorsList: catalog.operatorsList,
          });
        } catch {
          /* ignore */
        }
      } catch (backendErr) {
        console.warn("Backend facility persist skipped:", backendErr);
      }

      onSuccess(fac);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list storage.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
          <ShieldAlert className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-foreground">Yard / Warehouse Name</label>
        <input
          type="text"
          placeholder="e.g. Sahyadri Cellar 4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground">City / Region Location</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="Niphad">Niphad</option>
            <option value="Mohadi">Mohadi</option>
            <option value="Dindori">Dindori</option>
            <option value="Nashik">Nashik</option>
            <option value="Lasalgaon">Lasalgaon</option>
            <option value="Pimpalgaon">Pimpalgaon</option>
            <option value="Sinnar">Sinnar</option>
            <option value="Igatpuri">Igatpuri</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground">Facility Kind</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as FacilityKind)}
            className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="cold">Cold Storage</option>
            <option value="dry">Dry Yard</option>
            <option value="packhouse">Packhouse</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground">Specific Street Address</label>
        <input
          type="text"
          placeholder="e.g. Plot 12, APMC Yard bypass"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground">Available Space (Tons)</label>
          <div className="relative mt-1">
            <input
              type="number"
              min={1}
              step={1}
              value={capacityTons}
              onChange={(e) => setCapacityTons(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">tons</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground">Rate (₹ / Ton / Day)</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-mono">₹</span>
            <input
              type="number"
              min={1}
              step={1}
              value={ratePerTonDay}
              onChange={(e) => setRatePerTonDay(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-muted/50 pl-7 pr-3.5 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {kind === "cold" && (
        <div>
          <label className="text-xs font-semibold text-foreground">Temperature Range</label>
          <input
            type="text"
            placeholder="e.g. 0 to 4 C"
            value={tempRange}
            onChange={(e) => setTempRange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-foreground">Crops Supported</label>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {cropOptions.map((c) => {
            const active = selectedCrops.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCrop(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c} {active ? "✓" : "+"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md"
        >
          {saving ? "Publishing…" : "Publish Available Storage Space"}
        </Button>
      </div>
    </form>
  );
}

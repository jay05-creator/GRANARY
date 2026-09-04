import { useState } from "react";
import { Clock, Snowflake, Sun, Warehouse, AlertTriangle, PackageCheck } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/client/components/ui/dialog";
import { KIND_LABEL } from "@/server/seed";
import { occupancyPct, rupees, shortDate, tons } from "@/client/format";
import { pinKindOf, pinLabel, useGranary } from "@/shared/store";
import type { Facility, Lot } from "@/shared/types";
import { Progress } from "@/client/components/ui/progress";

const kindIcon = {
  cold: Snowflake,
  dry: Sun,
  packhouse: Warehouse,
};

export function FacilityDetail({
  facility,
  onBook,
}: {
  facility: Facility;
  onBook: () => void;
}) {
  const lots = useGranary((s) => s.lots);
  const farmerId = useGranary((s) => s.farmerId);
  const used = useGranary((s) => s.occupancy(facility));
  const left = useGranary((s) => s.remaining(facility));
  const releaseLot = useGranary((s) => s.releaseLot);
  const kind = pinKindOf(facility, lots, farmerId);
  const Icon = kindIcon[facility.kind];
  const mine = lots.filter(
    (l) => l.facilityId === facility.id && l.farmerId === farmerId && l.status !== "released",
  );
  const pct = occupancyPct(used, facility.capacityTons);
  const canBook = left > 0.05;

  // Release confirmation state
  const [releaseTarget, setReleaseTarget] = useState<Lot | null>(null);
  const [releaseStep, setReleaseStep] = useState<0 | 1 | 2>(0); // 0=hidden, 1=warn, 2=type confirmation
  const [releaseText, setReleaseText] = useState("");
  const [releaseError, setReleaseError] = useState("");

  const handleReleaseClick = (lot: Lot) => {
    setReleaseTarget(lot);
    setReleaseStep(1);
    setReleaseText("");
    setReleaseError("");
  };

  const handleReleaseConfirm = () => {
    setReleaseStep(2);
    setReleaseText("");
    setReleaseError("");
  };

  const handleReleaseFinal = async () => {
    if (releaseText !== "RELEASE") {
      setReleaseError('Type RELEASE to confirm.');
      return;
    }
    if (!releaseTarget) return;
    
    try {
      const { releaseLotServer } = await import("@/server/modules/granary");
      await releaseLotServer({ data: { lotId: releaseTarget.id } });
      
      releaseLot(releaseTarget.id);
      setReleaseStep(0);
      setReleaseTarget(null);
      setReleaseText("");
    } catch (err) {
      setReleaseError(err instanceof Error ? err.message : "Server error, failed to release.");
    }
  };

  const closeReleaseDialog = () => {
    setReleaseStep(0);
    setReleaseTarget(null);
    setReleaseText("");
    setReleaseError("");
  };

  return (
    <div className="flex flex-col">
      <img
        src={facility.photo}
        alt=""
        className="h-36 w-full rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
      />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium tracking-tight">{facility.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {facility.address}, {facility.city}
          </p>
        </div>
        <Badge variant={kind}>{pinLabel(kind)}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
          <Icon className="size-3.5" />
          {KIND_LABEL[facility.kind]}
        </span>
        {facility.tempRange && (
          <span className="rounded-full bg-muted px-2.5 py-1">{facility.tempRange}</span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
          <Clock className="size-3.5" />
          {facility.hours}
        </span>
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-[12px] tabular-nums text-muted-foreground">
          <span>
            {tons(used)} of {tons(facility.capacityTons)}
          </span>
          <span>{pct}% occupied</span>
        </div>
        <Progress
          value={pct}
          indicatorClassName={
            kind === "full" ? "bg-pin-full" : kind === "mine" ? "bg-pin-mine" : "bg-pin-empty"
          }
        />
      </div>
      <p className="mt-3 text-sm">
        {rupees(facility.ratePerTonDay)}
        <span className="text-muted-foreground"> per tonne per day</span>
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Takes {facility.crops.join(", ")}. Run by {facility.operator}.
      </p>

      {mine.length > 0 && (
        <div className="mt-5">
          <p className="text-[13px] font-medium">Your lots here</p>
          <ul className="mt-2 flex flex-col gap-2">
            {mine.map((lot) => (
              <li
                key={lot.id}
                className="flex items-center justify-between rounded-xl bg-muted/70 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm">
                    {lot.variety} {lot.crop}
                  </p>
                  <p className="text-[12px] tabular-nums text-muted-foreground">
                    {tons(lot.tons)} · until {shortDate(lot.until)}
                    {lot.status === "inbound" ? " · inbound" : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReleaseClick(lot)}
                >
                  Release
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button className="mt-5 w-full" disabled={!canBook} onClick={onBook}>
        {canBook ? `Book ${tons(left)} remaining` : "Yard is full"}
      </Button>

      {/* Release Confirmation Dialog */}
      <Dialog open={releaseStep > 0} onOpenChange={(open) => { if (!open) closeReleaseDialog(); }}>
        <DialogContent className="max-w-sm rounded-3xl border border-orange-500/30 bg-card p-6 shadow-2xl">
          {releaseStep === 1 ? (
            /* Step 1: Warning */
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-8 ring-orange-500/5">
                  <AlertTriangle className="size-6" />
                </div>
                <DialogTitle className="mt-2 text-lg font-bold text-foreground">
                  Release Stored Produce?
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {releaseTarget?.variety} {releaseTarget?.crop}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tons(releaseTarget?.tons ?? 0)} stored until {shortDate(releaseTarget?.until ?? "")}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Releasing this lot will free up capacity at <strong>{facility.name}</strong>. This action removes your stored harvest from the yard and cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeReleaseDialog}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReleaseConfirm}
                  className="bg-orange-600 hover:bg-orange-500 text-white"
                >
                  I understand, continue
                </Button>
              </div>
            </>
          ) : (
            /* Step 2: Type confirmation */
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-8 ring-orange-500/5">
                  <PackageCheck className="size-6" />
                </div>
                <DialogTitle className="mt-2 text-lg font-bold text-foreground">
                  Type RELEASE to confirm
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground text-center">
                This is your last chance. The lot will be permanently removed from storage.
              </p>
              <input
                type="text"
                value={releaseText}
                onChange={(e) => { setReleaseText(e.target.value); setReleaseError(""); }}
                placeholder='Type "RELEASE" to confirm'
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && releaseText === "RELEASE") {
                    handleReleaseFinal();
                  }
                }}
                className="w-full rounded-lg border border-orange-400/40 bg-background px-3 py-2.5 text-sm font-mono text-center focus:border-orange-500 focus:outline-none"
              />
              {releaseError && (
                <p className="text-xs text-destructive text-center">{releaseError}</p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReleaseStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleReleaseFinal}
                  disabled={releaseText !== "RELEASE"}
                  className="bg-orange-600 hover:bg-orange-500 text-white"
                >
                  <PackageCheck className="mr-1.5 size-3.5" />
                  Release Produce
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

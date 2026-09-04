import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Tractor,
  Warehouse,
  MapPin,
  Calendar,
  Layers,
  Phone,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useGranary } from "@/shared/store";
import type { FarmerRequest } from "@/shared/types";
import { KIND_LABEL } from "@/server/seed";
import { tons } from "@/client/format";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: FarmerRequest | null;
}

export function RequestReviewDialog({ open, onOpenChange, request }: Props) {
  const operatorId = useGranary((s) => s.operatorId);
  const operatorsList = useGranary((s) => s.operatorsList);
  const allFacilities = useGranary((s) => s.facilities);
  const allocateStorageToFarmer = useGranary((s) => s.allocateStorageToFarmer);
  const denyFarmerRequest = useGranary((s) => s.denyFarmerRequest);
  const refreshFromDb = useGranary((s) => s.refreshFromDb);
  const occupancyOf = useGranary((s) => s.occupancy);
  const lots = useGranary((s) => s.lots);

  const operatorFacilities = useMemo(() => {
    const op = operatorsList.find((o) => o.id === operatorId);
    if (!op) return allFacilities;
    return allFacilities.filter((f) => op.facilityIds.includes(f.id));
  }, [operatorsList, operatorId, allFacilities]);

  const [action, setAction] = useState<"approve" | "deny" | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

  useEffect(() => {
    if (operatorFacilities.length > 0 && !selectedFacilityId && request) {
      // Auto-select the first facility that has enough room
      const firstAvailable = operatorFacilities.find((f) => {
        const used = occupancyOf(f);
        return f.capacityTons - used >= request.tons;
      });
      if (firstAvailable) {
        setSelectedFacilityId(firstAvailable.id);
      }
    }
  }, [operatorFacilities, selectedFacilityId, request, occupancyOf]);

  if (!request) return null;

  const targetFacilityId = selectedFacilityId;
  const selectedFacility = operatorFacilities.find((f) => f.id === targetFacilityId);


  const handleConfirmAllocation = async () => {
    if (!targetFacilityId || !selectedFacility) {
      toast.error("Please select an available storage facility to allocate.");
      return;
    }

    const used = occupancyOf(selectedFacility);
    if (selectedFacility.capacityTons - used < request.tons) {
      toast.error("The selected facility does not have enough space for this request.");
      return;
    }

    const res = allocateStorageToFarmer(request.id, targetFacilityId);

    if (res.ok) {
      try {
        const { allocateRequest } = await import("@/server/modules/granary");
        await allocateRequest({
          data: { requestId: request.id, facilityId: targetFacilityId },
        });
        // Re-hydrate store from DB so farmer sees the new lot on map
        await refreshFromDb();
      } catch (e) {
        console.warn("Backend allocate skipped:", e);
      }
      toast.success("Response sent to farmer!", {
        description: `Successfully allocated ${request.tons} tons of storage at ${selectedFacility?.name} for ${request.farmerName}.`,
      });
      onOpenChange(false);
      setAction(null);
    } else {
      toast.error(res.error || "Failed to allocate storage.");
    }
  };

  const handleConfirmDenial = async () => {
    denyFarmerRequest(request.id);
    try {
      const { denyRequest } = await import("@/server/modules/granary");
      await denyRequest({ data: { requestId: request.id } });
      await refreshFromDb();
    } catch (e) {
      console.warn("Backend deny skipped:", e);
    }
    toast.info("Request hidden from dashboard", {
      description: `You have ignored the storage request from ${request.farmerName}. It remains open for other operators to accept.`,
    });
    onOpenChange(false);
    setAction(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg z-[9999] rounded-3xl border border-border p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-medium">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Tractor className="size-5" />
            </span>
            Farmer Harvest Storage Request
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Review incoming crop storage request and allocate yard capacity or deny request.
          </DialogDescription>
        </DialogHeader>

        {/* FARMER & CROP SUMMARY CARD */}
        <div className="mt-2 rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-base flex items-center gap-1.5">
                {request.farmerName}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Village: {request.farmerVillage} · Contact: {request.farmerContact}
              </p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
              Pending Review
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-3">
            <div className="bg-background/80 p-2.5 rounded-xl border border-border">
              <span className="text-muted-foreground font-medium">Harvest Crop:</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">
                {request.tons} Tons {request.crop}
              </p>
              <span className="text-[10px] text-muted-foreground">Variety: {request.variety}</span>
            </div>

            <div className="bg-background/80 p-2.5 rounded-xl border border-border">
              <span className="text-muted-foreground font-medium">Requested Duration:</span>
              <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {request.days} Days
              </p>
              <span className="text-[10px] text-muted-foreground">Requested: {request.requestedAt}</span>
            </div>
          </div>
        </div>

        {/* DECISION ACTION CHOICE */}
        {action === null && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Action Response:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAction("approve")}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-500/20 transition-all text-center gap-2 group"
              >
                <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-bold text-sm">Allocate Storage</p>
                  <p className="text-[11px] opacity-80 mt-0.5">Assign to an available yard</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAction("deny")}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all text-center gap-2 group"
              >
                <XCircle className="size-7 text-destructive group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-bold text-sm">Ignore Request</p>
                  <p className="text-[11px] opacity-80 mt-0.5">Hide from dashboard</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ALLOCATION FACILITY SELECTION STEP */}
        {action === "approve" && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Warehouse className="size-3.5" />
                Select Storage Facility to Allocate ({operatorFacilities.length}):
              </p>
              <button
                type="button"
                onClick={() => setAction(null)}
                className="text-[11px] text-muted-foreground hover:underline"
              >
                Change Action
              </button>
            </div>

            {operatorFacilities.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 border border-border rounded-xl">
                No facilities registered under your account yet. Please add a facility first.
              </p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {operatorFacilities.map((fac) => {
                  const used = occupancyOf(fac);
                  const rem = Math.max(0, fac.capacityTons - used);
                  const isSelected = selectedFacilityId === fac.id;
                  const hasEnoughRoom = rem >= request.tons;

                  return (
                    <button
                      key={fac.id}
                      type="button"
                      disabled={!hasEnoughRoom}
                      onClick={() => setSelectedFacilityId(fac.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-500/10 shadow-sm"
                          : hasEnoughRoom
                          ? "border-border bg-card hover:border-emerald-500/40"
                          : "border-border bg-muted/40 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">{fac.name}</p>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                            {KIND_LABEL[fac.kind]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {fac.city} · Rate: ₹{fac.ratePerTonDay}/ton/day
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`font-mono text-xs font-bold ${hasEnoughRoom ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                          {rem.toFixed(1)} t Free
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono">Cap: {fac.capacityTons} t</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setAction(null)}>
                Back
              </Button>
              <Button
                onClick={handleConfirmAllocation}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md"
              >
                <Check className="mr-1.5 size-4" />
                Confirm Allocation & Send Response
              </Button>
            </div>
          </div>
        )}

        {/* DENIAL CONFIRMATION STEP */}
        {action === "deny" && (
          <div className="mt-3 space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5 shrink-0" />
              <h4 className="font-semibold text-sm">Confirm Ignoring Request</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to ignore the storage request from <strong>{request.farmerName}</strong> for {request.tons} tons of {request.crop}? It will be hidden from your dashboard but remain open for other operators.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAction(null)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmDenial}
                className="bg-red-600 text-white hover:bg-red-700 border-red-600 font-medium"
              >
                Ignore Request
              </Button>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { rupees, tons } from "@/client/format";
import { useGranary } from "@/shared/store";
import type { Facility, PricingCalculation } from "@/shared/types";

const DEFAULT_CROPS = ["Grapes", "Onion", "Tomato", "Pomegranate", "Wheat"];

export function BookDialog({
  facility,
  open,
  onOpenChange,
}: {
  facility: Facility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const remaining = useGranary((s) => (facility ? s.remaining(facility) : 0));
  const bookLot = useGranary((s) => s.bookLot);

  const availableCrops =
    facility && facility.crops && facility.crops.length > 0
      ? facility.crops
      : DEFAULT_CROPS;

  const [crop, setCrop] = useState<string>(availableCrops[0] || "Grapes");
  const [variety, setVariety] = useState("Thompson Seedless");
  const [weight, setWeight] = useState("4.5");
  const [days, setDays] = useState("21");
  const [pricing, setPricing] = useState<PricingCalculation | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  useEffect(() => {
    if (facility) {
      const crops =
        facility.crops && facility.crops.length > 0 ? facility.crops : DEFAULT_CROPS;
      setCrop(crops[0] || "Grapes");
    }
  }, [facility, open]);

  useEffect(() => {
    if (!open || !facility) return;
    const t = Number(weight);
    const d = Number(days);
    if (t <= 0 || d <= 0) {
      setPricing(null);
      return;
    }
    let active = true;
    
    async function fetchPricing() {
      setLoadingPricing(true);
      try {
        const { calculateReferencePriceServer } = await import("@/server/modules/pricing");
        const res = await calculateReferencePriceServer({
          data: {
            crop,
            tons: t,
            days: d,
            grade: "A",
            operatorBaseRate: facility?.ratePerTonDay,
          }
        });
        if (active) setPricing(res);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoadingPricing(false);
      }
    }
    fetchPricing();
    
    return () => { active = false; };
  }, [crop, weight, days, facility, open]);

  if (!facility) return null;
  const yard = facility;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = Number(weight);
    const d = Number(days);
    if (t <= 0) {
      toast.error("Enter a weight above zero.");
      return;
    }
    const remaining = Math.max(0, yard.capacityTons - (yard.baseOccupiedTons || 0)); // Roughly
    
    try {
      const { createStorageRequest, loadCatalog } = await import("@/server/modules/granary");
      await createStorageRequest({
        data: {
          crop: crop || availableCrops[0] || "Grapes",
          variety,
          tons: t,
          days: d,
          preferredFacilityId: yard.id,
        }
      });
      toast.success(`Storage request sent to ${yard.name} for approval!`);
      const catalog = await loadCatalog();
      useGranary.getState().hydrateFromDb({
        farmerRequests: catalog.farmerRequests,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send request.");
    }
  }

  const estimate = Number(weight || 0) * Number(days || 0) * yard.ratePerTonDay;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[9999]">
        <DialogHeader>
          <DialogTitle>Book Storage at {yard.name}</DialogTitle>
          <DialogDescription>
            {tons(remaining)} free · Dynamic Reference Pricing Active
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="crop">Crop Selection</Label>
            <select
              id="crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              {availableCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="variety">Variety / Grade</Label>
            <Input
              id="variety"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. Thompson Seedless"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tons">Tonnes Required</Label>
              <Input
                id="tons"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="days">Duration (Days)</Label>
              <Input
                id="days"
                inputMode="numeric"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-3 text-sm border border-emerald-100 dark:border-emerald-900/30">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center justify-between">
              Reference Price Estimate
              {loadingPricing && <span className="animate-pulse text-xs opacity-60">Calculating...</span>}
            </h4>
            {pricing ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Crop Value</span>
                  <span>{rupees(pricing.totalTransactionValue - pricing.storageFeeTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage & Handling Fee</span>
                  <span className="font-medium">{rupees(pricing.storageFeeTotal)}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200/50 dark:border-emerald-800/50 pt-1.5 mt-1.5">
                  <span className="font-medium text-emerald-900 dark:text-emerald-300">Total Transaction Value</span>
                  <span className="font-bold text-emerald-900 dark:text-emerald-300">{rupees(pricing.totalTransactionValue)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Regulated Band (Min-Max)</span>
                  <span>{rupees(pricing.totalMinLimit)} - {rupees(pricing.totalMaxLimit)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Enter crop details to see pricing...</p>
            )}
          </div>


          <Button type="submit" className="mt-1 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium">
            Confirm & Reserve Storage Bay
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import {
  Sparkles,
  ThermometerSun,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  Send,
} from "lucide-react";
import { rupees } from "@/client/format";
import { useGranary } from "@/shared/store";
import { toast } from "sonner";


export interface AiRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultLocation?: string;
}

type CropName = "Grapes" | "Onion" | "Tomato" | "Pomegranate" | "Wheat";

// Removed hardcoded CROP_DATA; will fetch from AI now

export function AiRequestModal({
  open,
  onOpenChange,
  defaultLocation = "Niphad, Nashik",
}: AiRequestModalProps) {
  const [crop, setCrop] = useState<CropName>("Grapes");
  const [tonsNeeded, setTonsNeeded] = useState<number>(5);
  const [daysRequested, setDaysRequested] = useState<number>(15);
  const [location, setLocation] = useState<string>(defaultLocation);
  const [analyzed, setAnalyzed] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [aiVerdict, setAiVerdict] = useState<any>(null);

  const createFarmerRequest = useGranary((s) => s.createFarmerRequest);

  // Dynamic calculations based on AI Verdict
  const ambientTemp = aiVerdict ? aiVerdict.ambientTemp : 0;
  const mandiRate = aiVerdict ? aiVerdict.mandiRate : 0;
  const projectedMandiRate = aiVerdict ? aiVerdict.projectedMandiRate : 0;
  const priceDiff = projectedMandiRate - mandiRate;

  const currentTotalValue = tonsNeeded * 1000 * mandiRate;
  const projectedGrossValue = tonsNeeded * 1000 * projectedMandiRate;
  const storageCostPerTonDay = 12;
  const totalStorageFee = tonsNeeded * storageCostPerTonDay * daysRequested;

  const dailyAmbientSpoilageLoss = aiVerdict
    ? tonsNeeded * 1000 * mandiRate * (aiVerdict.dailyAmbientSpoilagePercent / 100)
    : 0;

  const daysPastAmbientSafe = aiVerdict ? Math.max(0, daysRequested - aiVerdict.ambientSafeDays) : 0;
  const totalAmbientSpoilageLoss = daysPastAmbientSafe * dailyAmbientSpoilageLoss;

  const netGainInColdStorage = projectedGrossValue - currentTotalValue - totalStorageFee;
  const recommendStore = netGainInColdStorage > 0 && priceDiff > 0;

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setAnalyzed(false);
    setAiVerdict(null);
    try {
      const { generateStorageVerdict } = await import("@/server/modules/granary");
      const verdict = await generateStorageVerdict({
        data: {
          crop,
          tonsNeeded,
          daysRequested,
          location
        }
      });
      setAiVerdict(verdict);
      setAnalyzed(true);
    } catch (err: any) {
      toast.error("AI Analysis Failed", { description: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitRequest = async () => {
    setSubmitting(true);
    try {
      // Local store (demo continuity)
      createFarmerRequest({
        crop,
        variety: "Standard Grade",
        tons: tonsNeeded,
        days: daysRequested,
      });
      // Persist + AI advisory via secure backend when auth session exists
      try {
        const { createStorageRequest, loadCatalog } = await import(
          "@/server/modules/granary"
        );
        const result = (await createStorageRequest({
          data: {
            crop,
            variety: "Standard Grade",
            tons: tonsNeeded,
            days: daysRequested,
          },
        })) as any;
        if (result?.advisory) {
          toast.message("AI Advisory generated", {
            description: String(result.advisory).slice(0, 180) + "…",
            duration: 6000,
          });
        }
        try {
          const catalog = await loadCatalog();
          useGranary.getState().hydrateFromDb({
            farmerRequests: catalog.farmerRequests,
            facilities: catalog.facilities,
            lots: catalog.lots,
          });
        } catch {
          /* ignore refresh errors */
        }
      } catch (backendErr) {
        console.warn("Backend persist skipped (demo mode or unsigned-in):", backendErr);
      }
      toast.success("Storage Request Broadcasted!", {
        description: `Your request for ${tonsNeeded} tons of ${crop} has been sent to warehouse owners. You will receive a notification once approved.`,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999] rounded-3xl border border-border p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-medium">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-4" />
            </span>
            AI Storage Request & Perishability Advisor
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Calculate safe storage duration, temperature degradation risk, mandi price trends, and financial ROI.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRunAnalysis} className="mt-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value as CropName);
                  setAnalyzed(false);
                }}
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="Grapes">Grapes (Table / Wine)</option>
                <option value="Onion">Onion (Red / White)</option>
                <option value="Tomato">Tomato (Hybrid / Local)</option>
                <option value="Pomegranate">Pomegranate (Bhagwa)</option>
                <option value="Wheat">Wheat (Sharvati)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Storage Room Required (Tons)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={tonsNeeded}
                onChange={(e) => {
                  setTonsNeeded(Number(e.target.value));
                  setAnalyzed(false);
                }}
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Storage Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="180"
                value={daysRequested}
                onChange={(e) => {
                  setDaysRequested(Number(e.target.value));
                  setAnalyzed(false);
                }}
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Farmer Location / Vicinity</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setAnalyzed(false);
                }}
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {!analyzed && (
            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md mt-2"
            >
              <Sparkles className="mr-2 size-4" />
              Generate AI Advisory & ROI Analysis
            </Button>
          )}
        </form>

        {/* AI ANALYSIS RESULTS CARD */}
        {analyzed && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            {/* AI VERDICT BANNER */}
            <div
              className={`rounded-2xl border p-4 shadow-sm ${recommendStore
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      Optimal Cold Temp
                    </h4>
                    <p className="text-lg font-bold text-sky-600">{aiVerdict.optimalTemp}</p>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      Requested Duration
                    </h4>
                    <p className="text-sm font-semibold">
                      {daysRequested} Days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {recommendStore ? (
                    <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-mono font-bold uppercase tracking-wider">
                      AI RECOMMENDATION VERDICT
                    </p>
                    <h3 className="text-lg font-bold">
                      {recommendStore
                        ? "STORE IN WAREHOUSE / COLD ROOM"
                        : "SELL IMMEDIATELY AT LOCAL MANDI"}
                    </h3>
                  </div>
                </div>
                <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-mono font-semibold border border-border">
                  Net {recommendStore ? "Gain" : "Diff"}: {rupees(Math.abs(netGainInColdStorage))}
                </span>
              </div>
              <p className="mt-2 text-xs opacity-90 leading-relaxed">
                {recommendStore
                  ? `Storing ${tonsNeeded} tons of ${crop} in cold storage for ${daysRequested} days avoids ${rupees(totalAmbientSpoilageLoss)} in ambient heat decay and yields an estimated net gain of ${rupees(netGainInColdStorage)} after paying ${rupees(totalStorageFee)} in warehouse fees.`
                  : `Ambient temperature near ${location} (${ambientTemp}°C) limits safe ambient storage of ${crop} to ${aiVerdict.ambientSafeDays} days. Price dynamics indicate selling now at ₹${mandiRate}/kg avoids ${rupees(dailyAmbientSpoilageLoss)}/day in spoilage and storage costs.`}
              </p>
            </div>

            {/* TEMPERATURE & SAFE WINDOW METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-card p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ThermometerSun className="size-4 text-amber-500" />
                  Vicinity Ambient Temp
                </div>
                <p className="mt-1 text-lg font-semibold font-mono">{ambientTemp}°C</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Location: {location}</p>
              </div>

              <div className="rounded-2xl border border-border p-4 bg-background">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                  <Calendar className="size-4 text-emerald-600" /> Safe Ambient Window
                </div>
                <div className="text-2xl font-bold flex items-baseline gap-1">
                  <span className="text-emerald-600">{aiVerdict.ambientSafeDays}</span>
                  <span className="text-emerald-600 text-base">Days</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cold Room: {aiVerdict.coldStorageSafeDays} Days
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldAlert className="size-4 text-destructive" />
                  Daily Spoilage Loss
                </div>
                <p className="mt-1 text-lg font-semibold font-mono text-destructive">
                  {rupees(dailyAmbientSpoilageLoss)}/day
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Past Day {aiVerdict.ambientSafeDays} ambient</p>
              </div>
            </div>

            {/* PRESENT MANDI RATES & PREDICTED RETURN */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Nashik Mandi Rate & Profitability Breakdown
              </h4>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Present Mandi Rate:</span>
                  <p className="font-mono font-semibold text-sm text-foreground mt-0.5">₹{mandiRate}/kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Projected ({daysRequested}d):</span>
                  <p className="font-mono font-semibold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{projectedMandiRate}/kg ({priceDiff >= 0 ? "+" : ""}{priceDiff} ₹/kg)
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Immediate Sale:</span>
                  <p className="font-mono font-semibold text-sm text-foreground mt-0.5">{rupees(currentTotalValue)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cold Storage Fees:</span>
                  <p className="font-mono font-semibold text-sm text-foreground mt-0.5">{rupees(totalStorageFee)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setAnalyzed(false)}>
                Recalculate
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md"
                >
                  <Send className="mr-1.5 size-3.5" />
                  {submitting ? "Submitting…" : "Submit Request to Network"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

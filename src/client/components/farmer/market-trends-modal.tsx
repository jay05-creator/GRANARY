import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  IndianRupee,
  Activity,
  Loader2,
  Sparkles,
} from "lucide-react";
import { rupees } from "@/client/format";
import { useGranary } from "@/shared/store";

export interface MarketTrendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AiRecommendation {
  lotId: string;
  currentPrice: number;
  projectedPrice30Days: number;
  trendReasoning: string;
  recommendation: "SELL" | "STORE";
}

export function MarketTrendsModal({
  open,
  onOpenChange,
}: MarketTrendsModalProps) {
  const lots = useGranary((s) => s.lots);
  const farmerId = useGranary((s) => s.farmerId);
  const facilities = useGranary((s) => s.facilities);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisories, setAdvisories] = useState<Record<string, AiRecommendation>>({});

  const myLots = useMemo(
    () => lots.filter((l) => l.farmerId === farmerId && l.status !== "released"),
    [lots, farmerId]
  );

  useEffect(() => {
    if (open && myLots.length > 0 && Object.keys(advisories).length === 0) {
      const fetchAdvisories = async () => {
        setLoading(true);
        setError(null);
        try {
          const { generateRealMarketAdvisory } = await import("@/server/modules/granary");
          
          const lotsPayload = myLots.map(l => {
            const fac = facilities.find(f => f.id === l.facilityId);
            return {
              id: l.id,
              crop: l.crop,
              tons: l.tons,
              facilityRate: fac ? fac.ratePerTonDay : 12
            };
          });

          const results = (await generateRealMarketAdvisory({
            data: { lots: lotsPayload }
          })) as any;

          const newAdvisories: Record<string, AiRecommendation> = {};
          if (Array.isArray(results)) {
            for (const res of results) {
              newAdvisories[res.lotId] = res;
            }
          }
          setAdvisories(newAdvisories);
        } catch (err: any) {
          setError(err.message || "Failed to fetch AI analysis. Check API key configuration.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchAdvisories();
    }
  }, [open, myLots, facilities, advisories]);

  // Reset when closed so we fetch fresh next time
  useEffect(() => {
    if (!open) {
      setAdvisories({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[9999] rounded-3xl border border-border p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-medium">
            <span className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Activity className="size-4" />
            </span>
            Real-Time AI Market Analysis
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Gemini AI is analyzing current market conditions in India to recommend whether you should hold or sell your active lots.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {myLots.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-muted/30 border border-border">
              <h3 className="text-lg font-medium">No Active Lots</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You don't have any produce stored in a warehouse right now. Book storage to track market trends for your crops!
              </p>
              <Button className="mt-4 rounded-xl" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : loading ? (
             <div className="text-center py-16 px-4 rounded-2xl bg-muted/10 border border-border flex flex-col items-center justify-center space-y-4">
              <Loader2 className="size-8 animate-spin text-blue-500" />
              <p className="font-medium text-foreground">Gemini AI is analyzing market trends...</p>
              <p className="text-xs text-muted-foreground">Evaluating live prices, weather patterns, and historical supply chains.</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
              <h3 className="font-medium">Analysis Failed</h3>
              <p className="text-sm mt-2 opacity-90">{error}</p>
              <Button className="mt-4 rounded-xl" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {myLots.map((lot) => {
                const facility = facilities.find(f => f.id === lot.facilityId);
                const facilityName = facility ? facility.name : "Unknown Facility";
                const avgStorageCostPerTonDay = facility ? facility.ratePerTonDay : 12;

                const aiData = advisories[lot.id];
                if (!aiData) return null;

                const currentTotalValue = lot.tons * 1000 * aiData.currentPrice;
                const projected30DayValue = lot.tons * 1000 * aiData.projectedPrice30Days;
                
                const costFor30Days = lot.tons * avgStorageCostPerTonDay * 30;
                const net30DayValue = projected30DayValue - costFor30Days;
                
                const recommendation = aiData.recommendation;

                return (
                  <div key={lot.id} className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-muted/40 px-5 py-3 border-b border-border flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{lot.tons} tons of {lot.crop}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Stored at {facilityName}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        recommendation === "STORE" 
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" 
                          : "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/30"
                      }`}>
                        AI: {recommendation === "STORE" ? "HOLD & STORE" : "SELL NOW"}
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      {/* Data Breakdown */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <IndianRupee className="size-4" />
                            <span className="text-xs font-semibold uppercase">Current Value</span>
                          </div>
                          <div className="text-2xl font-bold">{rupees(currentTotalValue)}</div>
                          <div className="text-xs text-muted-foreground mt-1">at {rupees(aiData.currentPrice)}/kg</div>
                        </div>
                        
                        <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
                          {recommendation === "STORE" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500" />
                          ) : (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-500" />
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Calendar className="size-4" />
                            <span className="text-xs font-semibold uppercase">30-Day Outlook</span>
                          </div>
                          <div className="text-2xl font-bold">{rupees(projected30DayValue)}</div>
                          <div className="text-xs text-muted-foreground mt-1">at {rupees(aiData.projectedPrice30Days)}/kg</div>
                        </div>
                      </div>

                      {/* Detailed Math */}
                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                          <Sparkles className="size-4" />
                          Gemini AI Analysis
                        </h4>
                        <p className="text-sm text-foreground/90">{aiData.trendReasoning}</p>
                        <div className="border-t border-border/50 pt-3 mt-3">
                          <div className="flex justify-between text-sm py-1">
                            <span className="text-muted-foreground">Est. 30-Day Storage Fees</span>
                            <span className="font-medium text-destructive">-{rupees(costFor30Days)}</span>
                          </div>
                          <div className="flex justify-between text-sm py-1 font-semibold">
                            <span>Net Value if Sold in 30 Days</span>
                            <span className={net30DayValue > currentTotalValue ? "text-emerald-600" : "text-foreground"}>
                              {rupees(net30DayValue)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-end pt-2">
                <Button 
                  type="button" 
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
                >
                  Close & return to Desk
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

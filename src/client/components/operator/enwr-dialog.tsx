import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { toast } from "sonner";
import { useGranary } from "@/shared/store";
import type { Lot } from "@/shared/types";
import { FileCheck } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lot: Lot | null;
}

export function EnwrDialog({ open, onOpenChange, lot }: Props) {
  const [enwrValue, setEnwrValue] = useState(lot?.enwr || "");
  const [isLoading, setIsLoading] = useState(false);
  const updateLot = useGranary((s) => s.updateLot);

  // Update local state when a new lot is selected
  useEffect(() => {
    if (lot) setEnwrValue(lot.enwr || "");
  }, [lot]);

  const handleSave = async () => {
    if (!lot) return;
    
    setIsLoading(true);
    try {
      const { updateLotServer } = await import("@/server/modules/granary");
      const res = await updateLotServer({ data: { lotId: lot.id, enwr: enwrValue } });
      if (res.ok) {
        updateLot(lot.id, { enwr: enwrValue });
        toast.success("ENWR Generated successfully", {
          description: `The ENWR number has been attached to the lot and the farmer has been updated.`,
        });
        onOpenChange(false);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to update ENWR number");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm z-[9999] rounded-3xl border border-border p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-medium">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="size-5" />
            </span>
            Generate ENWR
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Issue an Electronic Negotiable Warehouse Receipt for this stored lot.
          </DialogDescription>
        </DialogHeader>

        {lot && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
              <p className="font-semibold">{lot.variety} {lot.crop}</p>
              <p className="text-xs text-muted-foreground mt-1">Lot ID: {lot.id}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">ENWR Number</label>
              <Input
                value={enwrValue}
                onChange={(e) => setEnwrValue(e.target.value)}
                placeholder="e.g. ENWR-12345"
                className="w-full"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || !enwrValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? "Saving..." : "Save ENWR"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

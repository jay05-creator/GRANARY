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
  PartyPopper,
  Warehouse,
  Phone,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Calendar,
} from "lucide-react";
import { useGranary } from "@/shared/store";
import type { FarmerRequest } from "@/shared/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: FarmerRequest | null;
}

export function FarmerApprovalAlertModal({ open, onOpenChange, request }: Props) {
  const dismissFarmerNotification = useGranary((s) => s.dismissFarmerNotification);
  const selectFacility = useGranary((s) => s.selectFacility);

  if (!request) return null;

  const handleAcknowledge = () => {
    dismissFarmerNotification(request.id);
    if (request.allocatedFacilityId) {
      selectFacility(request.allocatedFacilityId);
    }
    onOpenChange(false);
  };

  const cleanPhone = request.operatorContact?.replace(/[^0-9]/g, "") || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md z-[9999] rounded-3xl border border-emerald-500/40 bg-card p-6 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
            <PartyPopper className="size-7" />
          </div>
          <DialogTitle className="mt-3 text-xl font-bold text-foreground">
            🎉 Storage Request Approved!
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Your harvest storage allocation request has been reviewed and approved by the warehouse owner.
          </DialogDescription>
        </DialogHeader>

        {/* DETAILS CARD */}
        <div className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              Allocation Confirmed
            </span>
            <Badge className="bg-emerald-700 text-white font-mono text-[10px]">
              {request.tons} Tons {request.crop}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground font-medium">Allocated Storage Facility:</span>
              <p className="font-semibold text-sm text-foreground flex items-center gap-1 mt-0.5">
                <Warehouse className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {request.allocatedFacilityName || "Nashik Cold Storage Bay"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-muted-foreground">Warehouse Owner:</span>
                <p className="font-medium text-foreground">{request.operatorName || "Yard Manager"}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Approved Duration:</span>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">{request.days} Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* INITIATE CONTACT NOTICE */}
        <div className="rounded-2xl border border-border bg-muted/30 p-3.5 text-center">
          <p className="text-xs text-foreground font-medium leading-relaxed">
            Please initiate contact with the warehouse owner to confirm transport arrival and logistics proceedings.
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Operator Contact: <strong className="text-foreground font-mono">{request.operatorContact}</strong>
          </p>
        </div>

        {/* CONTACT ACTIONS & DISMISS BUTTON */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md"
            >
              <a href={`tel:${cleanPhone || "9822012345"}`}>
                <Phone className="mr-1.5 size-4" />
                Call Owner
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-medium text-xs hover:bg-emerald-500/10"
            >
              <a
                href={`https://wa.me/91${cleanPhone || "9822012345"}?text=${encodeURIComponent(
                  `Hello! My storage request for ${request.tons} tons of ${request.crop} was approved for ${request.allocatedFacilityName}. I am contacting you to confirm arrival.`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquare className="mr-1.5 size-4 text-emerald-600" />
                WhatsApp
              </a>
            </Button>
          </div>

          <Button
            onClick={handleAcknowledge}
            variant="ghost"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Acknowledge & View Yard on Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

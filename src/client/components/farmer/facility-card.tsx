import { MapPin, Snowflake, Sun, Warehouse } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Progress } from "@/client/components/ui/progress";
import { KIND_LABEL } from "@/server/seed";
import { occupancyPct, rupees, tons } from "@/client/format";
import { pinKindOf, pinLabel, useGranary } from "@/shared/store";
import type { Facility } from "@/shared/types";
import { cn } from "@/client/cn";

const kindIcon = {
  cold: Snowflake,
  dry: Sun,
  packhouse: Warehouse,
};

export function FacilityCard({
  facility,
  selected,
  onSelect,
}: {
  facility: Facility;
  selected: boolean;
  onSelect: () => void;
}) {
  const lots = useGranary((s) => s.lots);
  const farmerId = useGranary((s) => s.farmerId);
  const used = useGranary((s) => s.occupancy(facility));
  const left = useGranary((s) => s.remaining(facility));
  const kind = pinKindOf(facility, lots, farmerId);
  const Icon = kindIcon[facility.kind];
  const pct = occupancyPct(used, facility.capacityTons);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-2xl bg-card p-3.5 text-left shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5",
        selected && "ring-2 ring-ring",
      )}
    >
      <div className="flex gap-3">
        <img
          src={facility.photo}
          alt=""
          className="size-16 shrink-0 rounded-xl object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-medium">{facility.name}</p>
            <Badge variant={kind}>{pinLabel(kind)}</Badge>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
            <MapPin className="size-3" />
            {facility.city}
            <span className="mx-1">·</span>
            <Icon className="size-3" />
            {KIND_LABEL[facility.kind]}
          </p>
          <div className="mt-2">
            <Progress
              value={pct}
              indicatorClassName={
                kind === "full"
                  ? "bg-pin-full"
                  : kind === "mine"
                    ? "bg-pin-mine"
                    : "bg-pin-empty"
              }
            />
            <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">
              <span>{tons(left)} free</span>
              <span>{rupees(facility.ratePerTonDay)}/t·day</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

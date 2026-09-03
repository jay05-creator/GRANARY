import { useEffect, useRef } from "react";
import { Home } from "lucide-react";
import { farmer, farmers } from "@/server/seed";
import { pinColor, pinKindOf, useGranary } from "@/shared/store";
import type { Facility, MapFilter, PinKind } from "@/shared/types";

interface Props {
  facilities: Facility[];
  selectedId: string | null;
  filter: MapFilter;
  onSelect: (id: string) => void;
  onRequestSelect?: (requestId: string) => void;
  showFarm?: boolean;
  showFarmerRequestsOnly?: boolean;
  className?: string;
}

export function StorageMap({
  facilities,
  selectedId,
  filter,
  onSelect,
  onRequestSelect,
  showFarm = true,
  showFarmerRequestsOnly = false,
  className,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onRequestSelectRef = useRef(onRequestSelect);
  onRequestSelectRef.current = onRequestSelect;

  const lots = useGranary((s) => s.lots);
  const farmerId = useGranary((s) => s.farmerId);
  const farmersList = useGranary((s) => s.farmersList);
  const farmerRequests = useGranary((s) => s.farmerRequests);
  const selectedRequestId = useGranary((s) => s.selectedRequestId);
  const selectRequest = useGranary((s) => s.selectRequest);

  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | undefined;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !host.current) return;
      const map = L.map(host.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
      }).setView([20.08, 74.05], 9);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      paint(L);
      map.invalidateSize();
      ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(host.current);
    })();

    return () => {
      cancelled = true;
      ro?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    import("leaflet").then((L) => paint(L));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities, selectedId, filter, lots, farmerId, showFarm, showFarmerRequestsOnly, farmersList, farmerRequests, selectedRequestId]);

  function paint(L: typeof import("leaflet")) {
    const group = markersRef.current;
    if (!group) return;
    group.clearLayers();

    // IF OWNER DASHBOARD MAP: SHOW FARMERS WHO HAVE SUBMITTED STORAGE REQUESTS
    if (showFarmerRequestsOnly) {
      const pendingRequests = farmerRequests.filter((r) => r.status === "pending");

      pendingRequests.forEach((req) => {
        const isSelected = selectedRequestId === req.id;
        const icon = L.divIcon({
          className: "granary-pin-wrap",
          html: `<div class="relative cursor-pointer">
            <span class="farm-pin ${isSelected ? "ring-4 ring-amber-400 animate-bounce" : ""}" style="background:#047857; color:#ffffff; width:34px; height:34px; display:grid; place-items:center; border-radius:50%; border:2px solid #ffffff; box-shadow:0 4px 14px rgba(4,120,87,0.45);" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/></svg>
            </span>
            <span class="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-sm">!</span>
          </div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([req.lat, req.lng], {
          icon,
          zIndexOffset: 600,
        }).addTo(group);

        marker.bindTooltip(
          `<div class="p-1">
            <strong style="color:#047857;">🌾 Farmer Storage Request: ${req.farmerName}</strong><br/>
            Crop: <strong>${req.tons}t ${req.crop}</strong> (${req.variety})<br/>
            Village: ${req.farmerVillage} · Duration: ${req.days} days<br/>
            <span style="color:#c8922a; font-weight:600; text-transform:uppercase; font-size:10px;">⚡ Click pin to Accept / Deny</span>
          </div>`,
          { direction: "top", offset: [0, -14], opacity: 0.95 }
        );

        marker.on("click", () => {
          selectRequest(req.id);
          if (onRequestSelectRef.current) {
            onRequestSelectRef.current(req.id);
          }
        });
      });

      // ALSO PAINT OWNER'S OWN FACILITIES ON THE MAP
      for (const fac of facilities) {
        const kind = pinKindOf(fac, lots, farmerId);
        const selected = selectedId === fac.id;
        const icon = L.divIcon({
          className: "granary-pin-wrap",
          html: `<span class="granary-pin granary-pin--${kind}${selected ? " is-selected" : ""}"><i></i></span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 22],
        });
        const marker = L.marker([fac.lat, fac.lng], {
          icon,
          zIndexOffset: selected ? 400 : 100,
        }).addTo(group);
        marker.bindTooltip(
          `<strong>${fac.name}</strong><br/>${fac.city} (${fac.capacityTons}t capacity)`,
          { direction: "top", offset: [0, -14], opacity: 0.95 }
        );
        marker.on("click", () => onSelectRef.current(fac.id));
      }
      return;
    }


    if (showFarm) {
      const currentFarmer = (farmersList || farmers).find((f) => f.id === farmerId) || farmer;
      const icon = L.divIcon({
        className: "granary-pin-wrap",
        html: `<span class="farm-pin" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/></svg>
        </span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([currentFarmer.lat, currentFarmer.lng], { icon, zIndexOffset: 200 })
        .addTo(group)
        .bindTooltip(`${currentFarmer.farm}, ${currentFarmer.village}`, {
          direction: "top",
          offset: [0, -12],
        });
    }

    for (const fac of facilities) {
      const kind = pinKindOf(fac, lots, farmerId);
      if (filter !== "all" && kind !== filter) continue;
      const selected = selectedId === fac.id;
      const icon = L.divIcon({
        className: "granary-pin-wrap",
        html: `<span class="granary-pin granary-pin--${kind}${selected ? " is-selected" : ""}"><i></i></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22],
      });
      const marker = L.marker([fac.lat, fac.lng], {
        icon,
        zIndexOffset: selected ? 400 : kind === "mine" ? 300 : 100,
      }).addTo(group);
      marker.bindTooltip(
        `<strong>${fac.name}</strong><br/>${pinCaption(kind)} · ${fac.city}`,
        { direction: "top", offset: [0, -14], opacity: 0.95 },
      );
      marker.on("click", () => onSelectRef.current(fac.id));
    }
  }

  return (
    <div className={className}>
      <div ref={host} className="h-full w-full rounded-[inherit]" />
    </div>
  );
}

function pinCaption(kind: PinKind) {
  if (kind === "mine") return "Your harvest";
  if (kind === "full") return "Full";
  return "Available";
}

export function PinLegend({ showFarm = true }: { showFarm?: boolean }) {
  const items: { kind: PinKind; label: string }[] = [
    { kind: "empty", label: "Available" },
    { kind: "full", label: "Full" },
    { kind: "mine", label: "Your harvest" },
  ];
  return (
    <ul className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
      {items.map((item) => (
        <li key={item.kind} className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: pinColor(item.kind) }}
          />
          {item.label}
        </li>
      ))}
      {showFarm && (
        <li className="inline-flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded-[4px] bg-foreground text-background">
            <Home className="size-2.5" />
          </span>
          Your farm
        </li>
      )}
    </ul>
  );
}

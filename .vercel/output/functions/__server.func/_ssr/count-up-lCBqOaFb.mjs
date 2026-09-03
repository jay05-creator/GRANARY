import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { j as House } from "../_libs/lucide-react.mjs";
import { i as pinKindOf, l as farmer, o as useGranary, r as pinColor } from "./router-BUJej2Ex.mjs";
import { i as cn } from "./button-oUzGrMHr.mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/count-up-lCBqOaFb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StorageMap({ facilities, selectedId, filter, onSelect, onRequestSelect, showFarm = true, showFarmerRequestsOnly = false, className }) {
	const host = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const markersRef = (0, import_react.useRef)(null);
	const onSelectRef = (0, import_react.useRef)(onSelect);
	onSelectRef.current = onSelect;
	const onRequestSelectRef = (0, import_react.useRef)(onRequestSelect);
	onRequestSelectRef.current = onRequestSelect;
	const lots = useGranary((s) => s.lots);
	const farmerId = useGranary((s) => s.farmerId);
	const farmersList = useGranary((s) => s.farmersList);
	const farmerRequests = useGranary((s) => s.farmerRequests);
	const selectedRequestId = useGranary((s) => s.selectedRequestId);
	const selectRequest = useGranary((s) => s.selectRequest);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let ro;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (cancelled || !host.current) return;
			const map = L.map(host.current, {
				zoomControl: false,
				attributionControl: true,
				scrollWheelZoom: true
			}).setView([20.08, 74.05], 9);
			L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
				attribution: "&copy; OpenStreetMap &copy; CARTO",
				subdomains: "abcd",
				maxZoom: 19
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
	}, []);
	(0, import_react.useEffect)(() => {
		import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then((L) => paint(L));
	}, [
		facilities,
		selectedId,
		filter,
		lots,
		farmerId,
		showFarm,
		showFarmerRequestsOnly,
		farmersList,
		farmerRequests,
		selectedRequestId
	]);
	function paint(L) {
		const group = markersRef.current;
		if (!group) return;
		group.clearLayers();
		if (showFarmerRequestsOnly) {
			farmerRequests.filter((r) => r.status === "pending").forEach((req) => {
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
					iconAnchor: [17, 17]
				});
				const marker = L.marker([req.lat, req.lng], {
					icon,
					zIndexOffset: 600
				}).addTo(group);
				marker.bindTooltip(`<div class="p-1">
            <strong style="color:#047857;">🌾 Farmer Storage Request: ${req.farmerName}</strong><br/>
            Crop: <strong>${req.tons}t ${req.crop}</strong> (${req.variety})<br/>
            Village: ${req.farmerVillage} · Duration: ${req.days} days<br/>
            <span style="color:#c8922a; font-weight:600; text-transform:uppercase; font-size:10px;">⚡ Click pin to Accept / Deny</span>
          </div>`, {
					direction: "top",
					offset: [0, -14],
					opacity: .95
				});
				marker.on("click", () => {
					selectRequest(req.id);
					if (onRequestSelectRef.current) onRequestSelectRef.current(req.id);
				});
			});
			for (const fac of facilities) {
				const kind = pinKindOf(fac, lots, farmerId);
				const selected = selectedId === fac.id;
				const icon = L.divIcon({
					className: "granary-pin-wrap",
					html: `<span class="granary-pin granary-pin--${kind}${selected ? " is-selected" : ""}"><i></i></span>`,
					iconSize: [22, 22],
					iconAnchor: [11, 22]
				});
				const marker = L.marker([fac.lat, fac.lng], {
					icon,
					zIndexOffset: selected ? 400 : 100
				}).addTo(group);
				marker.bindTooltip(`<strong>${fac.name}</strong><br/>${fac.city} (${fac.capacityTons}t capacity)`, {
					direction: "top",
					offset: [0, -14],
					opacity: .95
				});
				marker.on("click", () => onSelectRef.current(fac.id));
			}
			return;
		}
		if (showFarm) {
			const icon = L.divIcon({
				className: "granary-pin-wrap",
				html: `<span class="farm-pin" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/></svg>
        </span>`,
				iconSize: [28, 28],
				iconAnchor: [14, 14]
			});
			L.marker([farmer.lat, farmer.lng], {
				icon,
				zIndexOffset: 200
			}).addTo(group).bindTooltip("Kulkarni Vineyards, Niphad", {
				direction: "top",
				offset: [0, -12]
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
				iconAnchor: [11, 22]
			});
			const marker = L.marker([fac.lat, fac.lng], {
				icon,
				zIndexOffset: selected ? 400 : kind === "mine" ? 300 : 100
			}).addTo(group);
			marker.bindTooltip(`<strong>${fac.name}</strong><br/>${pinCaption(kind)} · ${fac.city}`, {
				direction: "top",
				offset: [0, -14],
				opacity: .95
			});
			marker.on("click", () => onSelectRef.current(fac.id));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: host,
			className: "h-full w-full rounded-[inherit]"
		})
	});
}
function pinCaption(kind) {
	if (kind === "mine") return "Your harvest";
	if (kind === "full") return "Full";
	return "Available";
}
function PinLegend({ showFarm = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground",
		children: [[
			{
				kind: "empty",
				label: "Available"
			},
			{
				kind: "full",
				label: "Full"
			},
			{
				kind: "mine",
				label: "Your harvest"
			}
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "inline-flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-2.5 rounded-full",
				style: { background: pinColor(item.kind) }
			}), item.label]
		}, item.kind)), showFarm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "inline-flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-4 place-items-center rounded-[4px] bg-foreground text-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-2.5" })
			}), "Your farm"]
		})]
	});
}
/** React Bits-inspired CountUp. */
function CountUp({ value, decimals = 0, suffix = "", className }) {
	const reduce = useReducedMotion();
	const [shown, setShown] = (0, import_react.useState)(reduce ? value : 0);
	const ref = (0, import_react.useRef)(null);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (reduce) {
			setShown(value);
			return;
		}
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => {
			if (!entry?.isIntersecting || started.current) return;
			started.current = true;
			const start = performance.now();
			const from = 0;
			const dur = 900;
			const tick = (now) => {
				const t = Math.min(1, (now - start) / dur);
				const eased = 1 - Math.pow(1 - t, 3);
				setShown(from + (value - from) * eased);
				if (t < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		}, { threshold: .4 });
		io.observe(el);
		return () => io.disconnect();
	}, [value, reduce]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		className: cn("tabular-nums", className),
		children: [shown.toFixed(decimals), suffix]
	});
}
//#endregion
export { PinLegend as n, StorageMap as r, CountUp as t };

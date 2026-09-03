import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as __exportAll } from "./ssr.mjs";
import { F as object, M as literal, P as number, R as string, z as union } from "../_libs/@better-auth/core+[...].mjs";
import { t as auth } from "./server-0w8Z6cbM.mjs";
import { o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BUJej2Ex.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var ThemeContext = (0, import_react.createContext)({
	theme: "light",
	toggle: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const next = localStorage.getItem("granary-theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(next);
		document.documentElement.classList.toggle("dark", next === "dark");
	}, []);
	function toggle() {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			localStorage.setItem("granary-theme", next);
			document.documentElement.classList.toggle("dark", next === "dark");
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			toggle
		},
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
var TooltipProvider = Provider;
var u = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
var DEMO_FARMER_ID = "farmer-meera";
var DEMO_OPERATOR_ID = "op-sahyadri";
var farmer = {
	id: DEMO_FARMER_ID,
	name: "Meera Kulkarni",
	farm: "Kulkarni Vineyards",
	village: "Niphad",
	district: "Nashik",
	crops: [
		"Grapes",
		"Raisins",
		"Onions"
	],
	lat: 20.0797,
	lng: 74.1106,
	photo: "https://api.dicebear.com/9.x/lorelei/svg?seed=MeeraKulkarni&backgroundColor=d7e4d4"
};
var farmers = [
	farmer,
	{
		id: "farmer-devidas",
		name: "Devidas Patil",
		farm: "Patil Organic Farm",
		village: "Lasalgaon",
		district: "Nashik",
		crops: ["Onion", "Pomegranate"],
		lat: 20.142,
		lng: 74.23,
		photo: "https://api.dicebear.com/9.x/lorelei/svg?seed=DevidasPatil&backgroundColor=e4d7c8"
	},
	{
		id: "farmer-anjali",
		name: "Anjali Deshmukh",
		farm: "Deshmukh Orchards",
		village: "Dindori",
		district: "Nashik",
		crops: ["Grapes", "Strawberry"],
		lat: 20.201,
		lng: 73.83,
		photo: "https://api.dicebear.com/9.x/lorelei/svg?seed=AnjaliDeshmukh&backgroundColor=d4e0d8"
	},
	{
		id: "farmer-ramesh",
		name: "Ramesh Pawar",
		farm: "Pawar Farm Estates",
		village: "Pimpalgaon",
		district: "Nashik",
		crops: [
			"Onion",
			"Grain",
			"Raisins"
		],
		lat: 20.165,
		lng: 73.99,
		photo: "https://api.dicebear.com/9.x/lorelei/svg?seed=RameshPawar&backgroundColor=f0e6d2"
	}
];
var operators = [
	{
		id: DEMO_OPERATOR_ID,
		name: "Sahyadri Cold Chain",
		contact: "ops@sahyadri-chain.in",
		facilityIds: [
			"fac-mohadi",
			"fac-igatpuri",
			"fac-dindori"
		]
	},
	{
		id: "op-coldstar",
		name: "ColdStar Nashik",
		contact: "yard@coldstar.in",
		facilityIds: ["fac-midc", "fac-ozar"]
	},
	{
		id: "op-godavari",
		name: "Godavari Cold Chain",
		contact: "desk@godavari-cold.in",
		facilityIds: ["fac-kopargaon", "fac-yeola"]
	},
	{
		id: "op-deccan",
		name: "Deccan Warehousing",
		contact: "hello@deccan-wh.in",
		facilityIds: [
			"fac-pimpalgaon",
			"fac-sinnar",
			"fac-chandwad"
		]
	},
	{
		id: "op-lasal",
		name: "Lasalgaon Yard Co-op",
		contact: "yard@lasalgaon.coop",
		facilityIds: ["fac-lasalgaon", "fac-manmad"]
	}
];
var facilities = [
	{
		id: "fac-mohadi",
		name: "Sahyadri Packhouse",
		operatorId: DEMO_OPERATOR_ID,
		operator: "Sahyadri Cold Chain",
		kind: "packhouse",
		lat: 20.0194,
		lng: 73.8702,
		address: "Mohadi Road, near grape collection shed",
		city: "Mohadi",
		capacityTons: 86,
		baseOccupiedTons: 41,
		ratePerTonDay: 18,
		tempRange: "0 to 2 C",
		crops: ["Grapes", "Pomegranate"],
		photo: u("photo-1537640538966-79f369143f8f"),
		hours: "Open 5:00 to 22:00"
	},
	{
		id: "fac-midc",
		name: "ColdStar Nashik MIDC",
		operatorId: "op-coldstar",
		operator: "ColdStar Nashik",
		kind: "cold",
		lat: 19.9912,
		lng: 73.7874,
		address: "Plot 14, Satpur MIDC",
		city: "Nashik",
		capacityTons: 120,
		baseOccupiedTons: 64,
		ratePerTonDay: 22,
		tempRange: "-2 to 4 C",
		crops: [
			"Grapes",
			"Tomato",
			"Pomegranate"
		],
		photo: u("photo-1586528116311-ad8dd3c8310d"),
		hours: "Open all day"
	},
	{
		id: "fac-kopargaon",
		name: "Godavari Cold Chain",
		operatorId: "op-godavari",
		operator: "Godavari Cold Chain",
		kind: "cold",
		lat: 19.8854,
		lng: 74.4761,
		address: "Ahmednagar Road, Kopargaon",
		city: "Kopargaon",
		capacityTons: 70,
		baseOccupiedTons: 70,
		ratePerTonDay: 16,
		tempRange: "0 to 5 C",
		crops: ["Sugarcane jaggery", "Onion"],
		photo: u("photo-1587293852726-70cdb56c2866"),
		hours: "Open 6:00 to 21:00"
	},
	{
		id: "fac-lasalgaon",
		name: "Lasalgaon Onion Yard",
		operatorId: "op-lasal",
		operator: "Lasalgaon Yard Co-op",
		kind: "dry",
		lat: 20.1426,
		lng: 74.2326,
		address: "APMC yard, Lasalgaon",
		city: "Lasalgaon",
		capacityTons: 240,
		baseOccupiedTons: 240,
		ratePerTonDay: 9,
		crops: ["Onion"],
		photo: u("photo-1518977676601-b53f82aba655", 1200),
		hours: "Open 6:00 to 19:00"
	},
	{
		id: "fac-pimpalgaon",
		name: "Deccan Dry Store",
		operatorId: "op-deccan",
		operator: "Deccan Warehousing",
		kind: "dry",
		lat: 20.1648,
		lng: 73.9921,
		address: "Pimpalgaon Baswant bypass",
		city: "Pimpalgaon",
		capacityTons: 54,
		baseOccupiedTons: 0,
		ratePerTonDay: 11,
		crops: [
			"Onion",
			"Raisins",
			"Grain"
		],
		photo: u("photo-1464226184884-fa280b87c399"),
		hours: "Open 7:00 to 20:00"
	},
	{
		id: "fac-igatpuri",
		name: "Igatpuri Hill Cold",
		operatorId: DEMO_OPERATOR_ID,
		operator: "Sahyadri Cold Chain",
		kind: "cold",
		lat: 19.6957,
		lng: 73.5626,
		address: "Ghoti Road, Igatpuri ghat",
		city: "Igatpuri",
		capacityTons: 38,
		baseOccupiedTons: 4,
		ratePerTonDay: 24,
		tempRange: "2 to 6 C",
		crops: ["Grapes", "Strawberry"],
		photo: u("photo-1574943320219-553eb213f72d"),
		hours: "Open 6:00 to 20:00"
	},
	{
		id: "fac-manmad",
		name: "Manmad Junction Store",
		operatorId: "op-lasal",
		operator: "Lasalgaon Yard Co-op",
		kind: "dry",
		lat: 20.2515,
		lng: 74.4381,
		address: "Near railway goods siding",
		city: "Manmad",
		capacityTons: 96,
		baseOccupiedTons: 28,
		ratePerTonDay: 10,
		crops: [
			"Onion",
			"Raisins",
			"Grain"
		],
		photo: u("photo-1625246333195-78d9c38ad449"),
		hours: "Open 5:30 to 21:00"
	},
	{
		id: "fac-sinnar",
		name: "Sinnar Agri Hub",
		operatorId: "op-deccan",
		operator: "Deccan Warehousing",
		kind: "packhouse",
		lat: 19.849,
		lng: 74.0009,
		address: "Sinnar-Shirdi highway, km 6",
		city: "Sinnar",
		capacityTons: 62,
		baseOccupiedTons: 19,
		ratePerTonDay: 14,
		tempRange: "4 to 8 C",
		crops: ["Tomato", "Grapes"],
		photo: u("photo-1500595046743-cd271d694d30"),
		hours: "Open 6:00 to 22:00"
	},
	{
		id: "fac-ozar",
		name: "Ozar Airfield Cold",
		operatorId: "op-coldstar",
		operator: "ColdStar Nashik",
		kind: "cold",
		lat: 20.0947,
		lng: 73.928,
		address: "Airfield road, Ozar",
		city: "Ozar",
		capacityTons: 48,
		baseOccupiedTons: 12,
		ratePerTonDay: 21,
		tempRange: "-1 to 3 C",
		crops: ["Grapes", "Pomegranate"],
		photo: u("photo-1510812431401-41d2bd2722f3"),
		hours: "Open all day"
	},
	{
		id: "fac-yeola",
		name: "Yeola Grain Bank",
		operatorId: "op-godavari",
		operator: "Godavari Cold Chain",
		kind: "dry",
		lat: 20.0426,
		lng: 74.489,
		address: "Paithan road, Yeola",
		city: "Yeola",
		capacityTons: 110,
		baseOccupiedTons: 110,
		ratePerTonDay: 8,
		crops: ["Grain", "Onion"],
		photo: u("photo-1625246333195-78d9c38ad449", 1200),
		hours: "Open 7:00 to 19:00"
	},
	{
		id: "fac-chandwad",
		name: "Chandwad Crate Yard",
		operatorId: "op-deccan",
		operator: "Deccan Warehousing",
		kind: "dry",
		lat: 20.3293,
		lng: 74.2446,
		address: "Malegaon road, Chandwad",
		city: "Chandwad",
		capacityTons: 44,
		baseOccupiedTons: 0,
		ratePerTonDay: 9,
		crops: ["Onion", "Grain"],
		photo: u("photo-1464226184884-fa280b87c399", 1200),
		hours: "Open 7:00 to 20:00"
	},
	{
		id: "fac-dindori",
		name: "Dindori Grape Cellar",
		operatorId: DEMO_OPERATOR_ID,
		operator: "Sahyadri Cold Chain",
		kind: "cold",
		lat: 20.2045,
		lng: 73.8294,
		address: "Vani road, Dindori",
		city: "Dindori",
		capacityTons: 52,
		baseOccupiedTons: 18,
		ratePerTonDay: 19,
		tempRange: "0 to 2 C",
		crops: ["Grapes"],
		photo: u("photo-1596591877040-96ce140e1f66"),
		hours: "Open 5:00 to 21:00"
	}
];
var lots = [
	{
		id: "lot-1",
		facilityId: "fac-mohadi",
		farmerId: DEMO_FARMER_ID,
		crop: "Grapes",
		variety: "Thompson Seedless",
		tons: 6.2,
		storedAt: "2026-08-12",
		until: "2026-09-08",
		status: "stored"
	},
	{
		id: "lot-2",
		facilityId: "fac-dindori",
		farmerId: DEMO_FARMER_ID,
		crop: "Grapes",
		variety: "Sharad Seedless",
		tons: 8.4,
		storedAt: "2026-08-18",
		until: "2026-09-14",
		status: "stored"
	},
	{
		id: "lot-3",
		facilityId: "fac-manmad",
		farmerId: DEMO_FARMER_ID,
		crop: "Raisins",
		variety: "Dried Thompson",
		tons: 3.8,
		storedAt: "2026-08-04",
		until: "2026-10-02",
		status: "stored"
	},
	{
		id: "lot-4",
		facilityId: "fac-ozar",
		farmerId: DEMO_FARMER_ID,
		crop: "Grapes",
		variety: "Flame Seedless",
		tons: 4.1,
		storedAt: "2026-08-24",
		until: "2026-09-20",
		status: "inbound"
	}
];
var KIND_LABEL = {
	cold: "Cold room",
	dry: "Dry yard",
	packhouse: "Packhouse"
};
var farmerRequests = [
	{
		id: "req-devidas-1",
		farmerId: "farmer-devidas",
		farmerName: "Devidas Patil",
		farmerVillage: "Lasalgaon",
		farmerContact: "+91 98220 54321",
		crop: "Onion",
		variety: "Red Nashik",
		tons: 12,
		days: 45,
		lat: 20.142,
		lng: 74.23,
		requestedAt: "2026-08-25",
		status: "pending"
	},
	{
		id: "req-anjali-1",
		farmerId: "farmer-anjali",
		farmerName: "Anjali Deshmukh",
		farmerVillage: "Dindori",
		farmerContact: "+91 98223 99887",
		crop: "Grapes",
		variety: "Thompson Seedless",
		tons: 7.5,
		days: 25,
		lat: 20.201,
		lng: 73.83,
		requestedAt: "2026-08-26",
		status: "pending"
	},
	{
		id: "req-ramesh-1",
		farmerId: "farmer-ramesh",
		farmerName: "Ramesh Pawar",
		farmerVillage: "Pimpalgaon",
		farmerContact: "+91 98221 11223",
		crop: "Tomato",
		variety: "Hybrid Red",
		tons: 5,
		days: 14,
		lat: 20.165,
		lng: 73.99,
		requestedAt: "2026-08-26",
		status: "pending"
	}
];
function occupancyOf(facility, lots) {
	const extra = lots.filter((l) => l.facilityId === facility.id && l.status !== "released").reduce((sum, l) => sum + l.tons, 0);
	return Math.min(facility.capacityTons, facility.baseOccupiedTons + extra);
}
function pinKindOf(facility, lots, farmerId) {
	if (lots.some((l) => l.facilityId === facility.id && l.farmerId === farmerId && l.status !== "released")) return "mine";
	if (facility.capacityTons - occupancyOf(facility, lots) <= .05) return "full";
	return "empty";
}
var useGranary = create((set, get) => ({
	role: "farmer",
	farmerId: DEMO_FARMER_ID,
	operatorId: DEMO_OPERATOR_ID,
	isAuthenticated: false,
	facilities,
	farmersList: farmers,
	operatorsList: operators,
	lots,
	selectedId: null,
	mapFilter: "all",
	query: "",
	farmerRequests,
	selectedRequestId: null,
	dbHydrated: false,
	hydrateFromDb: (payload) => set((state) => ({
		facilities: payload.facilities ?? state.facilities,
		lots: payload.lots ?? state.lots,
		farmerRequests: payload.farmerRequests ?? state.farmerRequests,
		farmersList: payload.farmersList?.length ? payload.farmersList : state.farmersList,
		operatorsList: payload.operatorsList?.length ? payload.operatorsList : state.operatorsList,
		dbHydrated: true
	})),
	refreshFromDb: async () => {
		try {
			const { loadCatalog } = await import("./granary-KzI4M3Z_.mjs");
			const catalog = await loadCatalog();
			get().hydrateFromDb({
				facilities: catalog.facilities,
				lots: catalog.lots,
				farmerRequests: catalog.farmerRequests,
				farmersList: catalog.farmersList,
				operatorsList: catalog.operatorsList
			});
		} catch (err) {
			console.warn("[granary] refreshFromDb failed:", err);
		}
	},
	selectRequest: (id) => set({ selectedRequestId: id }),
	createFarmerRequest: ({ crop, variety, tons, days, lat, lng }) => {
		const state = get();
		const currentFarmer = state.farmersList.find((f) => f.id === state.farmerId) || farmer;
		const req = {
			id: `req-${Date.now()}`,
			farmerId: state.farmerId,
			farmerName: currentFarmer.name,
			farmerVillage: currentFarmer.village,
			farmerContact: "+91 98220 99887",
			crop,
			variety: variety || "Standard",
			tons,
			days,
			lat: lat || currentFarmer.lat,
			lng: lng || currentFarmer.lng,
			requestedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			status: "pending"
		};
		set({ farmerRequests: [req, ...state.farmerRequests] });
		return req;
	},
	allocateStorageToFarmer: (requestId, facilityId) => {
		const state = get();
		const req = state.farmerRequests.find((r) => r.id === requestId);
		if (!req) return {
			ok: false,
			error: "Request not found."
		};
		const facility = state.facilities.find((f) => f.id === facilityId);
		if (!facility) return {
			ok: false,
			error: "Yard facility not found."
		};
		const op = state.operatorsList.find((o) => o.id === state.operatorId) || operators[0];
		const storedAt = /* @__PURE__ */ new Date();
		const until = new Date(storedAt);
		until.setDate(until.getDate() + req.days);
		const newLot = {
			id: `lot-${Date.now()}`,
			facilityId,
			farmerId: req.farmerId,
			crop: req.crop,
			variety: req.variety,
			tons: req.tons,
			storedAt: storedAt.toISOString().slice(0, 10),
			until: until.toISOString().slice(0, 10),
			status: "inbound"
		};
		set({
			farmerRequests: state.farmerRequests.map((r) => r.id === requestId ? {
				...r,
				status: "approved",
				allocatedFacilityId: facility.id,
				allocatedFacilityName: facility.name,
				operatorId: op.id,
				operatorName: op.name,
				operatorContact: op.contact,
				notifiedFarmer: false
			} : r),
			lots: [...state.lots, newLot],
			selectedId: facilityId,
			selectedRequestId: null
		});
		return {
			ok: true,
			lot: newLot
		};
	},
	denyFarmerRequest: (requestId) => {
		set({
			farmerRequests: get().farmerRequests.map((r) => r.id === requestId ? {
				...r,
				status: "denied",
				notifiedFarmer: false
			} : r),
			selectedRequestId: null
		});
	},
	dismissFarmerNotification: (requestId) => {
		set({ farmerRequests: get().farmerRequests.map((r) => r.id === requestId ? {
			...r,
			notifiedFarmer: true
		} : r) });
	},
	setRole: (role) => set({ role }),
	login: (role, id) => {
		if (role === "farmer") set({
			role: "farmer",
			farmerId: id,
			isAuthenticated: true
		});
		else set({
			role: "operator",
			operatorId: id,
			isAuthenticated: true
		});
	},
	logout: () => {
		set({ isAuthenticated: false });
	},
	registerUser: (input) => {
		const state = get();
		if (input.role === "farmer") {
			const newFarmer = {
				id: `farmer-${Date.now()}`,
				name: input.name,
				farm: input.farmOrCompany || `${input.name}'s Farm`,
				village: input.villageOrContact || "Niphad",
				district: "Nashik",
				crops: input.crops && input.crops.length > 0 ? input.crops : ["Grapes", "Onion"],
				lat: 20.08,
				lng: 74.11,
				photo: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(input.name)}&backgroundColor=d7e4d4`
			};
			set({
				role: "farmer",
				farmerId: newFarmer.id,
				isAuthenticated: true,
				farmersList: [...state.farmersList, newFarmer]
			});
			return {
				role: "farmer",
				id: newFarmer.id
			};
		} else {
			const newOp = {
				id: `op-${Date.now()}`,
				name: input.farmOrCompany || `${input.name} Warehousing`,
				contact: input.phone || `${input.name}@granary-storage.in`,
				facilityIds: []
			};
			set({
				role: "operator",
				operatorId: newOp.id,
				isAuthenticated: true,
				operatorsList: [...state.operatorsList, newOp]
			});
			return {
				role: "operator",
				id: newOp.id
			};
		}
	},
	selectFacility: (id) => set({ selectedId: id }),
	setMapFilter: (mapFilter) => set({ mapFilter }),
	setQuery: (query) => set({ query }),
	occupancy: (facility) => occupancyOf(facility, get().lots),
	remaining: (facility) => Math.max(0, facility.capacityTons - occupancyOf(facility, get().lots)),
	pinKind: (facility) => pinKindOf(facility, get().lots, get().farmerId),
	myLots: () => get().lots.filter((l) => l.farmerId === get().farmerId && l.status !== "released"),
	operatorFacilities: () => {
		const state = get();
		const op = state.operatorsList.find((o) => o.id === state.operatorId);
		if (!op) return [];
		return state.facilities.filter((f) => op.facilityIds.includes(f.id));
	},
	addFacility: (input) => {
		const state = get();
		const currentOp = state.operatorsList.find((o) => o.id === state.operatorId);
		const opName = currentOp ? currentOp.name : "Yard Operator";
		const lat = input.lat || 20 + (Math.random() - .5) * .3;
		const lng = input.lng || 73.9 + (Math.random() - .5) * .3;
		const newFacility = {
			id: `fac-${Date.now()}`,
			name: input.name,
			operatorId: state.operatorId,
			operator: opName,
			kind: input.kind,
			lat: Number(lat.toFixed(4)),
			lng: Number(lng.toFixed(4)),
			address: input.address,
			city: input.city,
			capacityTons: input.capacityTons,
			baseOccupiedTons: 0,
			ratePerTonDay: input.ratePerTonDay,
			tempRange: input.tempRange || (input.kind === "cold" ? "0 to 4 C" : void 0),
			crops: input.crops.length > 0 ? input.crops : ["Grapes", "Onion"],
			photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=75",
			hours: "Open 6:00 to 22:00"
		};
		set({
			facilities: [...state.facilities, newFacility],
			operatorsList: state.operatorsList.map((o) => o.id === state.operatorId ? {
				...o,
				facilityIds: [...o.facilityIds, newFacility.id]
			} : o),
			selectedId: newFacility.id
		});
		return newFacility;
	},
	bookLot: ({ facilityId, crop, variety, tons, days }) => {
		const state = get();
		const facility = state.facilities.find((f) => f.id === facilityId);
		if (!facility) return {
			ok: false,
			error: "Yard not found."
		};
		const remaining = Math.max(0, facility.capacityTons - occupancyOf(facility, state.lots));
		if (tons <= 0) return {
			ok: false,
			error: "Enter a weight above zero."
		};
		if (tons > remaining + .001) return {
			ok: false,
			error: `Only ${remaining.toFixed(1)} t left at this yard.`
		};
		const storedAt = /* @__PURE__ */ new Date();
		const until = new Date(storedAt);
		until.setDate(until.getDate() + days);
		const lot = {
			id: `lot-${Date.now()}`,
			facilityId,
			farmerId: state.farmerId,
			crop,
			variety,
			tons,
			storedAt: storedAt.toISOString().slice(0, 10),
			until: until.toISOString().slice(0, 10),
			status: "stored"
		};
		set({
			lots: [...state.lots, lot],
			selectedId: facilityId
		});
		return {
			ok: true,
			lot
		};
	},
	releaseLot: (lotId) => set({ lots: get().lots.map((l) => l.id === lotId ? {
		...l,
		status: "released"
	} : l) })
}));
function pinLabel(kind) {
	if (kind === "mine") return "Your harvest";
	if (kind === "full") return "Full";
	return "Available";
}
function pinColor(kind) {
	if (kind === "mine") return "#c8922a";
	if (kind === "full") return "#c45c3e";
	return "#3f7a52";
}
/**
* Client hook: seed demo rows into PGLite/Neon once, then hydrate Zustand
* from the database so maps and dashboards reflect persisted state.
* Also restores auth state from the session on page refresh.
*/
function useDbHydrate() {
	const hydrateFromDb = useGranary((s) => s.hydrateFromDb);
	const login = useGranary((s) => s.login);
	const dbHydrated = useGranary((s) => s.dbHydrated);
	const isAuthenticated = useGranary((s) => s.isAuthenticated);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (started.current || dbHydrated) return;
		started.current = true;
		(async () => {
			try {
				const { seedDemoCatalog, loadCatalog } = await import("./granary-KzI4M3Z_.mjs");
				await seedDemoCatalog();
				const catalog = await loadCatalog();
				if (catalog.facilityCount > 0) hydrateFromDb({
					facilities: catalog.facilities,
					lots: catalog.lots,
					farmerRequests: catalog.farmerRequests,
					farmersList: catalog.farmersList,
					operatorsList: catalog.operatorsList
				});
				else hydrateFromDb({});
				if (!isAuthenticated) try {
					const { getMyProfile } = await import("./granary-KzI4M3Z_.mjs");
					const profile = await getMyProfile();
					if (profile) {
						const role = profile.role === "operator" ? "operator" : "farmer";
						login(role, String(profile.user_id));
					}
				} catch {}
			} catch (err) {
				console.warn("[granary] DB hydrate failed, using seed data:", err);
				hydrateFromDb({});
			}
		})();
	}, [
		dbHydrated,
		hydrateFromDb,
		isAuthenticated,
		login
	]);
	return dbHydrated;
}
var styles_default = "/assets/styles-D33-Suc3.css";
var APP_NAME = "Granary";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Book cold rooms and dry yards around Nashik. Watch your harvest on a live map."
			},
			{
				name: "theme-color",
				content: "#1B5E3B"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: RootDocument,
	errorComponent: RootErrorBoundary
});
function DbHydrateGate({ children }) {
	useDbHydrate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function RootErrorBoundary({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("html", {
		lang: "en",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("body", {
			className: "antialiased",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								className: "size-7",
								fill: "none",
								viewBox: "0 0 24 24",
								strokeWidth: 1.5,
								stroke: "currentColor",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-medium tracking-tight text-foreground",
							children: "Something went wrong"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "An unexpected error occurred. Please try refreshing the page."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-destructive/70 font-mono break-all",
							children: error.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => window.location.reload(),
							className: "mt-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium transition-colors",
							children: "Refresh Page"
						})
					]
				})
			})
		})
	});
}
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
					delayDuration: 200,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DbHydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						position: "bottom-right",
						toastOptions: { className: "font-sans !bg-card !text-card-foreground !border-border !shadow-[var(--shadow-border)]" }
					})]
				}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$3 = () => import("./routes-dGO30dHX.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./farmer-DFYsW65m.mjs");
var Route$3 = createFileRoute("/farmer")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./login-DOj8Vbr-.mjs");
/**
* Client-side rate limiter for auth attempts.
* Blocks further attempts after MAX_ATTEMPTS within WINDOW_MS.
*/
/** Stagger children animation variants */
var Route$2 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
/** Visual password strength bar with criteria checklist. */
var $$splitComponentImporter = () => import("./operator-PTRqsd2P.mjs");
var Route$1 = createFileRoute("/operator")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	FarmerRoute: Route$3.update({
		id: "/farmer",
		path: "/farmer",
		getParentRoute: () => Route$5
	}),
	LoginRoute: Route$2.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$5
	}),
	OperatorRoute: Route$1.update({
		id: "/operator",
		path: "/operator",
		getParentRoute: () => Route$5
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { pinLabel as a, facilities as c, operators as d, useTheme as f, pinKindOf as i, farmer as l, occupancyOf as n, useGranary as o, pinColor as r, KIND_LABEL as s, router_exports as t, farmers as u };

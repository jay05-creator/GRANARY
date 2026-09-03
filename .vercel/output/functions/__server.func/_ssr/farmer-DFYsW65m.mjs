import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { E as MapPin, F as Clock, H as Calendar, R as CircleCheck, S as PartyPopper, T as MessageSquare, _ as Settings, d as Sun, f as Sparkles, g as ShieldAlert, n as Warehouse, o as TriangleAlert, p as Snowflake, s as TrendingUp, t as X, u as ThermometerSun, v as Send, x as Phone, y as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as pinLabel, i as pinKindOf, l as farmer, n as occupancyOf, o as useGranary, s as KIND_LABEL } from "./router-BUJej2Ex.mjs";
import { a as occupancyPct, c as tons, i as cn, o as rupees, r as SiteHeader, s as shortDate, t as Button } from "./button-oUzGrMHr.mjs";
import { n as PinLegend, r as StorageMap, t as CountUp } from "./count-up-lCBqOaFb.mjs";
import { a as DialogHeader, c as Progress, i as DialogDescription, n as Dialog$1, o as DialogTitle$1, r as DialogContent$1, s as ProfileEditDialog, t as Badge } from "./profile-edit-dialog-B-Dl4QdL.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/farmer-DFYsW65m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var kindIcon$1 = {
	cold: Snowflake,
	dry: Sun,
	packhouse: Warehouse
};
function FacilityCard({ facility, selected, onSelect }) {
	const lots = useGranary((s) => s.lots);
	const farmerId = useGranary((s) => s.farmerId);
	const used = useGranary((s) => s.occupancy(facility));
	const left = useGranary((s) => s.remaining(facility));
	const kind = pinKindOf(facility, lots, farmerId);
	const Icon = kindIcon$1[facility.kind];
	const pct = occupancyPct(used, facility.capacityTons);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("w-full rounded-2xl bg-card p-3.5 text-left shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5", selected && "ring-2 ring-ring"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: facility.photo,
				alt: "",
				className: "size-16 shrink-0 rounded-xl object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: facility.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: kind,
							children: pinLabel(kind)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
							facility.city,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-1",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }),
							KIND_LABEL[facility.kind]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: pct,
							indicatorClassName: kind === "full" ? "bg-pin-full" : kind === "mine" ? "bg-pin-mine" : "bg-pin-empty"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [tons(left), " free"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [rupees(facility.ratePerTonDay), "/t·day"] })]
						})]
					})
				]
			})]
		})
	});
}
var kindIcon = {
	cold: Snowflake,
	dry: Sun,
	packhouse: Warehouse
};
function FacilityDetail({ facility, onBook }) {
	const lots = useGranary((s) => s.lots);
	const farmerId = useGranary((s) => s.farmerId);
	const used = useGranary((s) => s.occupancy(facility));
	const left = useGranary((s) => s.remaining(facility));
	const releaseLot = useGranary((s) => s.releaseLot);
	const kind = pinKindOf(facility, lots, farmerId);
	const Icon = kindIcon[facility.kind];
	const mine = lots.filter((l) => l.facilityId === facility.id && l.farmerId === farmerId && l.status !== "released");
	const pct = occupancyPct(used, facility.capacityTons);
	const canBook = left > .05;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: facility.photo,
				alt: "",
				className: "h-36 w-full rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium tracking-tight",
					children: facility.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						facility.address,
						", ",
						facility.city
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: kind,
					children: pinLabel(kind)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2 text-[12px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), KIND_LABEL[facility.kind]]
					}),
					facility.tempRange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-muted px-2.5 py-1",
						children: facility.tempRange
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), facility.hours]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex justify-between text-[12px] tabular-nums text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						tons(used),
						" of ",
						tons(facility.capacityTons)
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct, "% occupied"] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: pct,
					indicatorClassName: kind === "full" ? "bg-pin-full" : kind === "mine" ? "bg-pin-mine" : "bg-pin-empty"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: [rupees(facility.ratePerTonDay), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: " per tonne per day"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[13px] text-muted-foreground",
				children: [
					"Takes ",
					facility.crops.join(", "),
					". Run by ",
					facility.operator,
					"."
				]
			}),
			mine.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-medium",
					children: "Your lots here"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-col gap-2",
					children: mine.map((lot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-xl bg-muted/70 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								lot.variety,
								" ",
								lot.crop
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] tabular-nums text-muted-foreground",
							children: [
								tons(lot.tons),
								" · until ",
								shortDate(lot.until),
								lot.status === "inbound" ? " · inbound" : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => releaseLot(lot.id),
							children: "Release"
						})]
					}, lot.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-5 w-full",
				disabled: !canBook,
				onClick: onBook,
				children: canBook ? `Book ${tons(left)} remaining` : "Yard is full"
			})
		]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-[13px] font-medium text-foreground", className),
		...props
	});
}
var DEFAULT_CROPS = [
	"Grapes",
	"Onion",
	"Tomato",
	"Pomegranate",
	"Wheat"
];
function BookDialog({ facility, open, onOpenChange }) {
	const remaining = useGranary((s) => facility ? s.remaining(facility) : 0);
	const bookLot = useGranary((s) => s.bookLot);
	const availableCrops = facility && facility.crops && facility.crops.length > 0 ? facility.crops : DEFAULT_CROPS;
	const [crop, setCrop] = (0, import_react.useState)(availableCrops[0] || "Grapes");
	const [variety, setVariety] = (0, import_react.useState)("Thompson Seedless");
	const [weight, setWeight] = (0, import_react.useState)("4.5");
	const [days, setDays] = (0, import_react.useState)("21");
	(0, import_react.useEffect)(() => {
		if (facility) {
			const crops = facility.crops && facility.crops.length > 0 ? facility.crops : DEFAULT_CROPS;
			setCrop(crops[0] || "Grapes");
		}
	}, [facility, open]);
	if (!facility) return null;
	const yard = facility;
	function submit(e) {
		e.preventDefault();
		const result = bookLot({
			facilityId: yard.id,
			crop: crop || availableCrops[0] || "Grapes",
			variety,
			tons: Number(weight),
			days: Number(days)
		});
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		toast.success(`Booked ${tons(result.lot.tons)} at ${yard.name}`);
		onOpenChange(false);
	}
	const estimate = Number(weight || 0) * Number(days || 0) * yard.ratePerTonDay;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "z-[9999]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle$1, { children: ["Book Storage at ", yard.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				tons(remaining),
				" free · ",
				rupees(yard.ratePerTonDay),
				" per tonne per day"
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-4 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "crop",
							children: "Crop Selection"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "crop",
							value: crop,
							onChange: (e) => setCrop(e.target.value),
							className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none",
							children: availableCrops.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "variety",
							children: "Variety / Grade"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "variety",
							value: variety,
							onChange: (e) => setVariety(e.target.value),
							placeholder: "e.g. Thompson Seedless"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "tons",
								children: "Tonnes Required"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "tons",
								inputMode: "decimal",
								value: weight,
								onChange: (e) => setWeight(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "days",
								children: "Duration (Days)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "days",
								inputMode: "numeric",
								value: days,
								onChange: (e) => setDays(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium text-muted-foreground mt-1",
						children: ["Total Estimate: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: rupees(Number.isFinite(estimate) ? estimate : 0)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-1 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium",
						children: "Confirm & Reserve Storage Bay"
					})
				]
			})]
		})
	});
}
var CROP_DATA = {
	Grapes: {
		currentPrice: 45,
		projectedPrice: 54,
		ambientSafeDays: 4,
		coldStorageSafeDays: 30,
		dailySpoilagePercent: 3.5,
		optimalTemp: "0°C – 2°C (90% RH)"
	},
	Onion: {
		currentPrice: 18,
		projectedPrice: 22,
		ambientSafeDays: 14,
		coldStorageSafeDays: 60,
		dailySpoilagePercent: 1.8,
		optimalTemp: "15°C – 20°C (Dry ventilated)"
	},
	Tomato: {
		currentPrice: 24,
		projectedPrice: 21,
		ambientSafeDays: 5,
		coldStorageSafeDays: 18,
		dailySpoilagePercent: 4,
		optimalTemp: "8°C – 12°C"
	},
	Pomegranate: {
		currentPrice: 95,
		projectedPrice: 112,
		ambientSafeDays: 10,
		coldStorageSafeDays: 45,
		dailySpoilagePercent: 2,
		optimalTemp: "5°C – 7°C"
	},
	Wheat: {
		currentPrice: 26,
		projectedPrice: 29,
		ambientSafeDays: 90,
		coldStorageSafeDays: 180,
		dailySpoilagePercent: .2,
		optimalTemp: "18°C – 22°C (Dry silos)"
	}
};
function AiRequestModal({ open, onOpenChange, defaultLocation = "Niphad, Nashik" }) {
	const [crop, setCrop] = (0, import_react.useState)("Grapes");
	const [tonsNeeded, setTonsNeeded] = (0, import_react.useState)(5);
	const [daysRequested, setDaysRequested] = (0, import_react.useState)(15);
	const [location, setLocation] = (0, import_react.useState)(defaultLocation);
	const [analyzed, setAnalyzed] = (0, import_react.useState)(false);
	const createFarmerRequest = useGranary((s) => s.createFarmerRequest);
	const cropInfo = CROP_DATA[crop];
	const ambientTemp = 31;
	const mandiRate = cropInfo.currentPrice;
	const projectedMandiRate = cropInfo.projectedPrice;
	const priceDiff = projectedMandiRate - mandiRate;
	const currentTotalValue = tonsNeeded * 1e3 * mandiRate;
	const projectedGrossValue = tonsNeeded * 1e3 * projectedMandiRate;
	const totalStorageFee = tonsNeeded * 12 * daysRequested;
	const dailyAmbientSpoilageLoss = tonsNeeded * 1e3 * mandiRate * (cropInfo.dailySpoilagePercent / 100);
	const totalAmbientSpoilageLoss = Math.max(0, daysRequested - cropInfo.ambientSafeDays) * dailyAmbientSpoilageLoss;
	const netGainInColdStorage = projectedGrossValue - currentTotalValue - totalStorageFee;
	const recommendStore = netGainInColdStorage > 0 && priceDiff > 0;
	const handleRunAnalysis = (e) => {
		e.preventDefault();
		setAnalyzed(true);
	};
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const handleSubmitRequest = async () => {
		setSubmitting(true);
		try {
			createFarmerRequest({
				crop,
				variety: "Standard Grade",
				tons: tonsNeeded,
				days: daysRequested
			});
			try {
				const { createStorageRequest, loadCatalog } = await import("./granary-KzI4M3Z_.mjs");
				const result = await createStorageRequest({ data: {
					crop,
					variety: "Standard Grade",
					tons: tonsNeeded,
					days: daysRequested
				} });
				if (result?.advisory) toast.message("AI Advisory generated", {
					description: String(result.advisory).slice(0, 180) + "…",
					duration: 6e3
				});
				try {
					const catalog = await loadCatalog();
					useGranary.getState().hydrateFromDb({
						farmerRequests: catalog.farmerRequests,
						facilities: catalog.facilities,
						lots: catalog.lots
					});
				} catch {}
			} catch (backendErr) {
				console.warn("Backend persist skipped (demo mode or unsigned-in):", backendErr);
			}
			toast.success("Storage Request Broadcasted!", { description: `Your request for ${tonsNeeded} tons of ${crop} has been sent to warehouse owners. You will receive a notification once approved.` });
			onOpenChange(false);
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto z-[9999] rounded-3xl border border-border p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle$1, {
					className: "flex items-center gap-2 text-xl font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
					}), "AI Storage Request & Perishability Advisor"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: "Calculate safe storage duration, temperature degradation risk, mandi price trends, and financial ROI."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRunAnalysis,
					className: "mt-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Crop Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: crop,
								onChange: (e) => {
									setCrop(e.target.value);
									setAnalyzed(false);
								},
								className: "mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Grapes",
										children: "Grapes (Table / Wine)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Onion",
										children: "Onion (Red / White)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Tomato",
										children: "Tomato (Hybrid / Local)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Pomegranate",
										children: "Pomegranate (Bhagwa)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Wheat",
										children: "Wheat (Sharvati)"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Storage Room Required (Tons)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0.5",
								step: "0.5",
								value: tonsNeeded,
								onChange: (e) => {
									setTonsNeeded(Number(e.target.value));
									setAnalyzed(false);
								},
								className: "mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Storage Duration (Days)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "1",
								max: "180",
								value: daysRequested,
								onChange: (e) => {
									setDaysRequested(Number(e.target.value));
									setAnalyzed(false);
								},
								className: "mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Farmer Location / Vicinity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: location,
								onChange: (e) => {
									setLocation(e.target.value);
									setAnalyzed(false);
								},
								className: "mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
							})] })]
						}),
						!analyzed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 size-4" }), "Generate AI Advisory & ROI Analysis"]
						})
					]
				}),
				analyzed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4 border-t border-border pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-2xl border p-4 shadow-sm ${recommendStore ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200" : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [recommendStore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6 text-emerald-600 dark:text-emerald-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-6 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono font-bold uppercase tracking-wider",
										children: "AI RECOMMENDATION VERDICT"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold",
										children: recommendStore ? "STORE IN WAREHOUSE / COLD ROOM" : "SELL IMMEDIATELY AT LOCAL MANDI"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-background/80 px-3 py-1 text-xs font-mono font-semibold border border-border",
									children: [
										"Net ",
										recommendStore ? "Gain" : "Diff",
										": ",
										rupees(Math.abs(netGainInColdStorage))
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs opacity-90 leading-relaxed",
								children: recommendStore ? `Storing ${tonsNeeded} tons of ${crop} in cold storage for ${daysRequested} days avoids ${rupees(totalAmbientSpoilageLoss)} in ambient heat decay and yields an estimated net gain of ${rupees(netGainInColdStorage)} after paying ${rupees(totalStorageFee)} in warehouse fees.` : `Ambient temperature near ${location} (${ambientTemp}°C) limits safe ambient storage of ${crop} to ${cropInfo.ambientSafeDays} days. Price dynamics indicate selling now at ₹${mandiRate}/kg avoids ${rupees(dailyAmbientSpoilageLoss)}/day in spoilage and storage costs.`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermometerSun, { className: "size-4 text-amber-500" }), "Vicinity Ambient Temp"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-lg font-semibold font-mono",
											children: [ambientTemp, "°C"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: ["Location: ", location]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-emerald-600 dark:text-emerald-400" }), "Safe Ambient Window"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-lg font-semibold font-mono text-emerald-600 dark:text-emerald-400",
											children: [cropInfo.ambientSafeDays, " Days"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: [
												"Cold Room: ",
												cropInfo.coldStorageSafeDays,
												" Days"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-destructive" }), "Daily Spoilage Loss"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-lg font-semibold font-mono text-destructive",
											children: [rupees(dailyAmbientSpoilageLoss), "/day"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: [
												"Past Day ",
												cropInfo.ambientSafeDays,
												" ambient"
											]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5 text-emerald-600 dark:text-emerald-400" }), "Nashik Mandi Rate & Profitability Breakdown"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Present Mandi Rate:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono font-semibold text-sm text-foreground mt-0.5",
										children: [
											"₹",
											mandiRate,
											"/kg"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"Projected (",
											daysRequested,
											"d):"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono font-semibold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5",
										children: [
											"₹",
											projectedMandiRate,
											"/kg (",
											priceDiff >= 0 ? "+" : "",
											priceDiff,
											" ₹/kg)"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Immediate Sale:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-semibold text-sm text-foreground mt-0.5",
										children: rupees(currentTotalValue)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Cold Storage Fees:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-semibold text-sm text-foreground mt-0.5",
										children: rupees(totalStorageFee)
									})] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setAnalyzed(false),
								children: "Recalculate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleSubmitRequest,
									disabled: submitting,
									className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 size-3.5" }), submitting ? "Submitting…" : "Submit Request to Network"]
								})
							})]
						})
					]
				})
			]
		})
	});
}
function FarmerApprovalAlertModal({ open, onOpenChange, request }) {
	const dismissFarmerNotification = useGranary((s) => s.dismissFarmerNotification);
	const selectFacility = useGranary((s) => s.selectFacility);
	if (!request) return null;
	const handleAcknowledge = () => {
		dismissFarmerNotification(request.id);
		if (request.allocatedFacilityId) selectFacility(request.allocatedFacilityId);
		onOpenChange(false);
	};
	const cleanPhone = request.operatorContact?.replace(/[^0-9]/g, "") || "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "max-w-md z-[9999] rounded-3xl border border-emerald-500/40 bg-card p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "size-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
							className: "mt-3 text-xl font-bold text-foreground",
							children: "🎉 Storage Request Approved!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Your harvest storage allocation request has been reviewed and approved by the warehouse owner."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-emerald-500/20 pb-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), "Allocation Confirmed"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-emerald-700 text-white font-mono text-[10px]",
							children: [
								request.tons,
								" Tons ",
								request.crop
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground font-medium",
							children: "Allocated Storage Facility:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-sm text-foreground flex items-center gap-1 mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), request.allocatedFacilityName || "Nashik Cold Storage Bay"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Warehouse Owner:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground",
								children: request.operatorName || "Yard Manager"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Approved Duration:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium text-emerald-700 dark:text-emerald-300",
								children: [request.days, " Days"]
							})] })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-muted/30 p-3.5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-foreground font-medium leading-relaxed",
						children: "Please initiate contact with the warehouse owner to confirm transport arrival and logistics proceedings."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground mt-1",
						children: ["Operator Contact: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-mono",
							children: request.operatorContact
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${cleanPhone || "9822012345"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1.5 size-4" }), "Call Owner"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-medium text-xs hover:bg-emerald-500/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://wa.me/91${cleanPhone || "9822012345"}?text=${encodeURIComponent(`Hello! My storage request for ${request.tons} tons of ${request.crop} was approved for ${request.allocatedFacilityName}. I am contacting you to confirm arrival.`)}`,
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-1.5 size-4 text-emerald-600" }), "WhatsApp"]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleAcknowledge,
						variant: "ghost",
						className: "w-full text-xs text-muted-foreground hover:text-foreground",
						children: "Acknowledge & View Yard on Map"
					})]
				})
			]
		})
	});
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-forest/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 bg-card text-card-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out", side === "right" && "inset-y-0 right-0 h-full w-full max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", side === "bottom" && "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-3xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		className: cn("text-lg font-medium tracking-tight", className),
		...props
	});
}
function FarmerDesk() {
	const isAuthenticated = useGranary((s) => s.isAuthenticated);
	const role = useGranary((s) => s.role);
	const facilities = useGranary((s) => s.facilities);
	const lots = useGranary((s) => s.lots);
	const farmerId = useGranary((s) => s.farmerId);
	const farmerRequests = useGranary((s) => s.farmerRequests);
	const selectedId = useGranary((s) => s.selectedId);
	const mapFilter = useGranary((s) => s.mapFilter);
	const query = useGranary((s) => s.query);
	const selectFacility = useGranary((s) => s.selectFacility);
	const setMapFilter = useGranary((s) => s.setMapFilter);
	const setQuery = useGranary((s) => s.setQuery);
	const refreshFromDb = useGranary((s) => s.refreshFromDb);
	(0, import_react.useEffect)(() => {
		refreshFromDb();
	}, []);
	const approvedNotification = (0, import_react.useMemo)(() => farmerRequests.find((r) => r.farmerId === farmerId && r.status === "approved" && !r.notifiedFarmer) || null, [farmerRequests, farmerId]);
	const myLots = (0, import_react.useMemo)(() => lots.filter((l) => l.farmerId === farmerId && l.status !== "released"), [lots, farmerId]);
	const [booking, setBooking] = (0, import_react.useState)(false);
	const [sheetOpen, setSheetOpen] = (0, import_react.useState)(false);
	const [aiModalOpen, setAiModalOpen] = (0, import_react.useState)(false);
	const [approvalModalOpen, setApprovalModalOpen] = (0, import_react.useState)(true);
	const [profileEditOpen, setProfileEditOpen] = (0, import_react.useState)(false);
	const [myProfile, setMyProfile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isAuthenticated) import("./granary-KzI4M3Z_.mjs").then(({ getMyProfile }) => {
			getMyProfile().then((p) => setMyProfile(p)).catch(() => {});
		}).catch(() => {});
	}, [isAuthenticated]);
	const counts = (0, import_react.useMemo)(() => {
		let empty = 0;
		let full = 0;
		let mine = 0;
		for (const f of facilities) {
			const k = pinKindOf(f, lots, farmerId);
			if (k === "empty") empty += 1;
			else if (k === "full") full += 1;
			else mine += 1;
		}
		return {
			empty,
			full,
			mine
		};
	}, [
		facilities,
		lots,
		farmerId
	]);
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[100dvh] flex-col bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto size-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl font-medium tracking-tight",
						children: "Sign In Required"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Please sign in or register a Farmer account to access the Farmer Desk and book harvest storage."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Go to Login & Registration Portal"
							})
						})
					})
				]
			})
		})]
	});
	if (role === "operator") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[100dvh] flex-col bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl font-medium tracking-tight",
						children: "Unauthorized Access"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"You are currently logged in as a ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Warehouse Owner" }),
							". Warehouse accounts are restricted from accessing the Farmer Desk."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/operator",
								children: "Go to Warehouse Desk"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Switch / Register Account"
							})
						})]
					})
				]
			})
		})]
	});
	const rankedFacilities = facilities.filter((f) => {
		const k = pinKindOf(f, lots, farmerId);
		if (mapFilter !== "all" && k !== mapFilter) return false;
		if (!query.trim()) return true;
		const q = query.toLowerCase();
		return f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q) || f.crops.some((c) => c.toLowerCase().includes(q));
	}).map((facility) => ({
		facility,
		available: Math.max(0, facility.capacityTons - occupancyOf(facility, lots))
	})).sort((a, b) => b.available - a.available);
	const featuredFacilities = rankedFacilities.slice(0, 4).map(({ facility }) => facility);
	const remainingFacilities = rankedFacilities.slice(4).map(({ facility }) => facility);
	const selected = facilities.find((f) => f.id === selectedId) ?? null;
	const storedTons = myLots.reduce((n, l) => n + l.tons, 0);
	function pick(id) {
		selectFacility(id);
		if (window.matchMedia("(max-width: 1023px)").matches) setSheetOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[100dvh] flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-3 py-4 md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 rounded-3xl bg-card px-4 py-4 shadow-[var(--shadow-border)] md:flex-row md:items-center md:justify-between md:px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: farmer.photo,
								alt: "",
								className: "size-12 rounded-2xl bg-muted outline outline-1 -outline-offset-1 outline-black/10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: farmer.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[13px] text-muted-foreground",
								children: [
									farmer.farm,
									" · ",
									farmer.village
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setProfileEditOpen(true),
									variant: "outline",
									size: "sm",
									className: "rounded-2xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5 mr-1" }), "Edit Profile"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAiModalOpen(true),
									className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-2 shadow-md rounded-2xl px-4 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-emerald-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generate Storage Request & AI Advisory" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-3 md:flex md:gap-8 border-l border-border pl-3 md:pl-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
											value: myLots.length,
											label: "Active lots"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
											value: Number(storedTons.toFixed(1)),
											decimals: 1,
											suffix: " t",
											label: "In storage"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
											value: counts.empty,
											label: "Yards open"
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "relative h-[52dvh] min-h-[340px] overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-border)] lg:h-[min(72dvh,740px)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorageMap, {
								facilities,
								selectedId,
								filter: mapFilter,
								onSelect: pick,
								className: "absolute inset-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-col gap-2 sm:inset-x-4 sm:top-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pointer-events-auto flex gap-2 overflow-x-auto rounded-2xl bg-card/95 p-2 shadow-[var(--shadow-border)] backdrop-blur-sm [scrollbar-width:none]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterChip, {
											active: mapFilter === "all",
											onClick: () => setMapFilter("all"),
											children: ["All ", facilities.length]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterChip, {
											active: mapFilter === "empty",
											onClick: () => setMapFilter("empty"),
											swatch: "bg-pin-empty",
											children: ["Available ", counts.empty]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterChip, {
											active: mapFilter === "full",
											onClick: () => setMapFilter("full"),
											swatch: "bg-pin-full",
											children: ["Full ", counts.full]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterChip, {
											active: mapFilter === "mine",
											onClick: () => setMapFilter("mine"),
											swatch: "bg-pin-mine",
											children: ["Your harvest ", counts.mine]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-auto w-fit max-w-full rounded-2xl bg-card/95 px-3 py-2 shadow-[var(--shadow-border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinLegend, {})
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "flex min-h-0 flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "Search yards, crops, towns",
										className: "pl-10"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-border)] lg:flex",
									children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-y-auto p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacilityDetail, {
											facility: selected,
											onBook: () => setBooking(true)
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YardList, {
										facilities: featuredFacilities,
										selectedId,
										onSelect: pick
									}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-t border-border p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											className: "w-full",
											onClick: () => selectFacility(null),
											children: "Back to list"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "lg:hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YardList, {
										facilities: featuredFacilities,
										selectedId,
										onSelect: pick
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-card p-4 shadow-[var(--shadow-border)] md:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-medium",
								children: "More storage yards"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Other yards ranked by remaining storage capacity."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 font-mono text-xs text-muted-foreground",
								children: [remainingFacilities.length, " more"]
							})]
						}), remainingFacilities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "The four yards with the most available space are shown beside the map."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
							children: remainingFacilities.map((facility) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacilityCard, {
								facility,
								selected: facility.id === selectedId,
								onSelect: () => pick(facility.id)
							}) }, facility.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-card p-4 shadow-[var(--shadow-border)] md:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium",
							children: "Your lots"
						}), myLots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "Nothing stored yet. Pick an available pin and book a bay."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4",
							children: myLots.map((lot) => {
								const fac = facilities.find((f) => f.id === lot.facilityId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => fac && pick(fac.id),
									className: "w-full rounded-2xl bg-muted/70 p-3 text-left transition-[background-color] duration-150 hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: lot.variety
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "mine",
											children: lot.status
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[12px] text-muted-foreground",
										children: [
											fac?.name,
											" · ",
											tons(lot.tons),
											" · until ",
											shortDate(lot.until)
										]
									})]
								}) }, lot.id);
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: sheetOpen,
				onOpenChange: setSheetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "bottom",
					className: "overflow-y-auto p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "sr-only",
						children: "Yard detail"
					}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacilityDetail, {
						facility: selected,
						onBook: () => {
							setSheetOpen(false);
							setBooking(true);
						}
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookDialog, {
				facility: selected,
				open: booking,
				onOpenChange: setBooking
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiRequestModal, {
				open: aiModalOpen,
				onOpenChange: setAiModalOpen,
				defaultLocation: `${farmer.village}, Nashik`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FarmerApprovalAlertModal, {
				open: approvalModalOpen && !!approvedNotification,
				onOpenChange: setApprovalModalOpen,
				request: approvedNotification
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileEditDialog, {
				open: profileEditOpen,
				onOpenChange: setProfileEditOpen,
				profile: {
					name: myProfile?.name || farmer.name,
					phone: myProfile?.phone || "",
					village_or_company: myProfile?.village_or_company || farmer.village,
					farm_or_contact: myProfile?.farm_or_contact || farmer.farm
				},
				onSave: async (updates) => {
					const { updateMyProfile } = await import("./granary-KzI4M3Z_.mjs");
					await updateMyProfile({ data: updates });
					refreshFromDb();
					const { getMyProfile } = await import("./granary-KzI4M3Z_.mjs");
					const p = await getMyProfile();
					setMyProfile(p);
				}
			})
		]
	});
}
function MiniStat({ value, label, decimals = 0, suffix = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-lg tabular-nums",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
			value,
			decimals,
			suffix
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] text-muted-foreground",
		children: label
	})] });
}
function FilterChip({ active, onClick, children, swatch }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-[background-color,color] duration-150", active ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"),
		children: [swatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", swatch) }), children]
	});
}
function YardList({ facilities, selectedId, onSelect }) {
	if (facilities.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-5 text-sm text-muted-foreground",
		children: "No yards match that filter."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-2 overflow-y-auto p-3",
		children: facilities.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacilityCard, {
			facility: f,
			selected: f.id === selectedId,
			onSelect: () => onSelect(f.id)
		}) }, f.id))
	});
}
//#endregion
export { FarmerDesk as component };

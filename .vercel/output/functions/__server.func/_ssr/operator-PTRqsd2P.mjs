import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as Layers, B as Check, C as PackageCheck, E as MapPin, I as CircleX, K as Activity, L as CirclePlus, R as CircleCheck, W as Boxes, _ as Settings, c as Tractor, g as ShieldAlert, l as Thermometer, n as Warehouse, o as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as occupancyOf, o as useGranary, s as KIND_LABEL } from "./router-BUJej2Ex.mjs";
import { a as occupancyPct, c as tons, r as SiteHeader, s as shortDate, t as Button } from "./button-oUzGrMHr.mjs";
import { r as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { r as StorageMap, t as CountUp } from "./count-up-lCBqOaFb.mjs";
import { a as DialogHeader, c as Progress, i as DialogDescription, n as Dialog, o as DialogTitle, r as DialogContent, s as ProfileEditDialog, t as Badge } from "./profile-edit-dialog-B-Dl4QdL.mjs";
import { t as SpotlightCard } from "./spotlight-card-CwvJ6BMR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/operator-PTRqsd2P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequestReviewDialog({ open, onOpenChange, request }) {
	const operatorId = useGranary((s) => s.operatorId);
	const operatorsList = useGranary((s) => s.operatorsList);
	const allFacilities = useGranary((s) => s.facilities);
	const allocateStorageToFarmer = useGranary((s) => s.allocateStorageToFarmer);
	const denyFarmerRequest = useGranary((s) => s.denyFarmerRequest);
	const refreshFromDb = useGranary((s) => s.refreshFromDb);
	const occupancyOf = useGranary((s) => s.occupancy);
	useGranary((s) => s.lots);
	const operatorFacilities = (0, import_react.useMemo)(() => {
		const op = operatorsList.find((o) => o.id === operatorId);
		if (!op) return allFacilities;
		return allFacilities.filter((f) => op.facilityIds.includes(f.id));
	}, [
		operatorsList,
		operatorId,
		allFacilities
	]);
	const [action, setAction] = (0, import_react.useState)(null);
	const [selectedFacilityId, setSelectedFacilityId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (operatorFacilities.length > 0 && !selectedFacilityId) setSelectedFacilityId(operatorFacilities[0].id);
	}, [operatorFacilities, selectedFacilityId]);
	if (!request) return null;
	const targetFacilityId = selectedFacilityId || operatorFacilities[0]?.id || "";
	const selectedFacility = operatorFacilities.find((f) => f.id === targetFacilityId);
	const handleConfirmAllocation = async () => {
		if (!targetFacilityId) {
			toast.error("Please select an available storage facility to allocate.");
			return;
		}
		const res = allocateStorageToFarmer(request.id, targetFacilityId);
		if (res.ok) {
			try {
				const { allocateRequest } = await import("./granary-KzI4M3Z_.mjs");
				await allocateRequest({ data: {
					requestId: request.id,
					facilityId: targetFacilityId
				} });
				await refreshFromDb();
			} catch (e) {
				console.warn("Backend allocate skipped:", e);
			}
			toast.success("Response sent to farmer!", { description: `Successfully allocated ${request.tons} tons of storage at ${selectedFacility?.name} for ${request.farmerName}.` });
			onOpenChange(false);
			setAction(null);
		} else toast.error(res.error || "Failed to allocate storage.");
	};
	const handleConfirmDenial = async () => {
		denyFarmerRequest(request.id);
		try {
			const { denyRequest } = await import("./granary-KzI4M3Z_.mjs");
			await denyRequest({ data: { requestId: request.id } });
			await refreshFromDb();
		} catch (e) {
			console.warn("Backend deny skipped:", e);
		}
		toast.info("Response sent to farmer", { description: `Storage request from ${request.farmerName} has been denied. Notification sent to farmer.` });
		onOpenChange(false);
		setAction(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg z-[9999] rounded-3xl border border-border p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-xl font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tractor, { className: "size-5" })
					}), "Farmer Harvest Storage Request"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: "Review incoming crop storage request and allocate yard capacity or deny request."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 rounded-2xl border border-border bg-muted/30 p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-foreground text-base flex items-center gap-1.5",
							children: request.farmerName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-emerald-600 dark:text-emerald-400 shrink-0" }),
								"Village: ",
								request.farmerVillage,
								" · Contact: ",
								request.farmerContact
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]",
							children: "Pending Review"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-background/80 p-2.5 rounded-xl border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Harvest Crop:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono font-semibold text-foreground mt-0.5",
									children: [
										request.tons,
										" Tons ",
										request.crop
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["Variety: ", request.variety]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-background/80 p-2.5 rounded-xl border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Requested Duration:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5",
									children: [request.days, " Days"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["Requested: ", request.requestedAt]
								})
							]
						})]
					})]
				}),
				action === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Select Action Response:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAction("approve"),
							className: "flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-500/20 transition-all text-center gap-2 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-7 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-sm",
								children: "Allocate Storage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] opacity-80 mt-0.5",
								children: "Assign to an available yard"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAction("deny"),
							className: "flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all text-center gap-2 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-7 text-destructive group-hover:scale-110 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-sm",
								children: "Deny Request"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] opacity-80 mt-0.5",
								children: "Send denial notice"
							})] })]
						})]
					})]
				}),
				action === "approve" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-3.5" }),
									"Select Storage Facility to Allocate (",
									operatorFacilities.length,
									"):"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAction(null),
								className: "text-[11px] text-muted-foreground hover:underline",
								children: "Change Action"
							})]
						}),
						operatorFacilities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground p-3 border border-border rounded-xl",
							children: "No facilities registered under your account yet. Please add a facility first."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 max-h-[220px] overflow-y-auto pr-1",
							children: operatorFacilities.map((fac) => {
								const used = occupancyOf(fac);
								const rem = Math.max(0, fac.capacityTons - used);
								const isSelected = selectedFacilityId === fac.id;
								const hasEnoughRoom = rem >= request.tons;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !hasEnoughRoom,
									onClick: () => setSelectedFacilityId(fac.id),
									className: `w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${isSelected ? "border-emerald-600 bg-emerald-500/10 shadow-sm" : hasEnoughRoom ? "border-border bg-card hover:border-emerald-500/40" : "border-border bg-muted/40 opacity-50 cursor-not-allowed"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-sm text-foreground",
											children: fac.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] py-0 px-1.5 font-mono",
											children: KIND_LABEL[fac.kind]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											fac.city,
											" · Rate: ₹",
											fac.ratePerTonDay,
											"/ton/day"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `font-mono text-xs font-bold ${hasEnoughRoom ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`,
											children: [rem.toFixed(1), " t Free"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground font-mono",
											children: [
												"Cap: ",
												fac.capacityTons,
												" t"
											]
										})]
									})]
								}, fac.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setAction(null),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleConfirmAllocation,
								className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 size-4" }), "Confirm Allocation & Send Response"]
							})]
						})
					]
				}),
				action === "deny" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-semibold text-sm",
								children: "Confirm Denial of Storage Request"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								"Are you sure you want to deny the storage request from ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: request.farmerName }),
								" for ",
								request.tons,
								" tons of ",
								request.crop,
								"? A response will be sent to the farmer."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setAction(null),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleConfirmDenial,
								className: "bg-red-600 text-white hover:bg-red-700 border-red-600 font-medium",
								children: "Deny & Send Response"
							})]
						})
					]
				})
			]
		})
	});
}
function OperatorDesk() {
	const isAuthenticated = useGranary((s) => s.isAuthenticated);
	const role = useGranary((s) => s.role);
	const all = useGranary((s) => s.facilities);
	const operatorsList = useGranary((s) => s.operatorsList);
	const lots = useGranary((s) => s.lots);
	useGranary((s) => s.farmerId);
	const selectedId = useGranary((s) => s.selectedId);
	const selectFacility = useGranary((s) => s.selectFacility);
	const operatorId = useGranary((s) => s.operatorId);
	useGranary((s) => s.addFacility);
	const farmerRequests = useGranary((s) => s.farmerRequests);
	const selectedRequestId = useGranary((s) => s.selectedRequestId);
	const selectRequest = useGranary((s) => s.selectRequest);
	const refreshFromDb = useGranary((s) => s.refreshFromDb);
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [profileEditOpen, setProfileEditOpen] = (0, import_react.useState)(false);
	const [myProfile, setMyProfile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		refreshFromDb();
	}, []);
	(0, import_react.useEffect)(() => {
		if (isAuthenticated) import("./granary-KzI4M3Z_.mjs").then(({ getMyProfile }) => {
			getMyProfile().then((p) => setMyProfile(p)).catch(() => {});
		}).catch(() => {});
	}, [isAuthenticated]);
	const op = operatorsList.find((o) => o.id === operatorId) || operatorsList[0];
	const pendingRequests = (0, import_react.useMemo)(() => farmerRequests.filter((r) => r.status === "pending"), [farmerRequests]);
	const activeReviewRequest = farmerRequests.find((r) => r.id === selectedRequestId) || null;
	const facilities = (0, import_react.useMemo)(() => all.filter((f) => op.facilityIds.includes(f.id)), [all, op]);
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
						children: "Please sign in or register a Warehouse Owner account to access the Warehouse Desk and manage storage."
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
	if (role === "farmer") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Farmer" }),
							". Farmer accounts are restricted from accessing the Warehouse Owner Desk."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/farmer",
								children: "Go to Farmer Desk"
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
	const inbound = lots.filter((l) => facilities.some((f) => f.id === l.facilityId) && l.status !== "released");
	const used = facilities.reduce((n, f) => n + occupancyOf(f, lots), 0);
	const cap = facilities.reduce((n, f) => n + f.capacityTons, 0);
	const avail = Math.max(0, cap - used);
	const overallFill = occupancyPct(used, cap);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[100dvh] flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-3 py-4 md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
						className: "p-5 md:p-6 border border-emerald-900/30 dark:border-emerald-800/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-3.5" }), "Warehouse Owner Dashboard"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-1 text-2xl font-medium tracking-tight md:text-3xl",
									children: op.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: op.contact
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setProfileEditOpen(true),
									variant: "outline",
									size: "sm",
									className: "rounded-2xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5 mr-1" }), "Edit Profile"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setIsModalOpen(true),
									size: "lg",
									className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-emerald-900/20 transition-all gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-5" }), "List Available Storage"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-emerald-700/50 bg-emerald-950/80 p-4 text-emerald-50 shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-emerald-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[12px] font-medium uppercase tracking-wider",
												children: "Total Yards"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-4 opacity-80" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, { value: facilities.length })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-emerald-300/80",
											children: "Active registered yards"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-green-700/50 bg-green-900/60 p-4 text-green-50 shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-green-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[12px] font-medium uppercase tracking-wider",
												children: "Occupied"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "size-4 opacity-80" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
												value: Number(used.toFixed(1)),
												decimals: 1,
												suffix: " t"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-green-300/80",
											children: "Stored harvest lots"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-teal-700/50 bg-teal-950/80 p-4 text-teal-50 shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-teal-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[12px] font-medium uppercase tracking-wider",
												children: "Network Fill"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 opacity-80" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
												value: overallFill,
												suffix: "%"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-teal-300/80",
											children: "Occupancy load across network"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-lime-700/50 bg-lime-950/80 p-4 text-lime-50 shadow-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-lime-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[12px] font-medium uppercase tracking-wider",
												children: "Available Space"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-4 opacity-80" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
												value: Number(avail.toFixed(1)),
												decimals: 1,
												suffix: " t"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-lime-300/80",
											children: "Open storage ready to list"
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.9fr)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "relative h-[48dvh] min-h-[320px] overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-border)] lg:h-[min(64dvh,640px)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorageMap, {
								facilities: all,
								selectedId,
								filter: "all",
								onSelect: selectFacility,
								onRequestSelect: (reqId) => selectRequest(reqId),
								showFarm: false,
								showFarmerRequestsOnly: true,
								className: "absolute inset-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-3 top-3 z-[500] rounded-2xl bg-card/95 px-3.5 py-2 shadow-[var(--shadow-border)] flex items-center gap-2 border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-full bg-emerald-600 border border-white animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-foreground",
									children: [
										"Farmers with Pending Storage Requests (",
										pendingRequests.length,
										")"
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "flex flex-col gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-emerald-600 dark:text-emerald-400" }),
										"Warehouse Sections (",
										facilities.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Click to inspect on map"
								})]
							}), facilities.map((f) => {
								const usedF = occupancyOf(f, lots);
								const availF = Math.max(0, f.capacityTons - usedF);
								const pct = occupancyPct(usedF, f.capacityTons);
								const isSelected = selectedId === f.id;
								let cardBg = "bg-card border-border";
								let badgeBg = "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300";
								let progressIndicator = "bg-emerald-500";
								if (pct >= 85) {
									cardBg = "bg-lime-950/10 border-lime-700/40 dark:bg-lime-950/25";
									badgeBg = "bg-lime-500/20 text-lime-800 border-lime-500/40 dark:text-lime-300 dark:bg-lime-900/50";
									progressIndicator = "bg-lime-500";
								} else if (pct >= 50) {
									cardBg = "bg-emerald-950/10 border-emerald-700/40 dark:bg-emerald-950/25";
									badgeBg = "bg-emerald-600/20 text-emerald-800 border-emerald-600/40 dark:text-emerald-300 dark:bg-emerald-900/50";
									progressIndicator = "bg-emerald-600";
								}
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => selectFacility(f.id),
									className: `group relative overflow-hidden rounded-3xl p-4 text-left border transition-all shadow-[var(--shadow-border)] ${cardBg} ${isSelected ? "ring-2 ring-emerald-500 shadow-md" : "hover:border-emerald-500/50"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors",
												children: f.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-0.5 text-xs text-muted-foreground flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-emerald-600 dark:text-emerald-400 shrink-0" }),
													f.city,
													" (",
													f.address,
													") · ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: KIND_LABEL[f.kind]
													})
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums ${badgeBg}`,
												children: [pct, "% full"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
											className: "mt-3.5 h-2",
											value: pct,
											indicatorClassName: progressIndicator
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center justify-between text-xs text-muted-foreground font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Occupied: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: tons(usedF)
												}),
												" / ",
												tons(f.capacityTons)
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-emerald-700 dark:text-emerald-400 font-semibold",
												children: ["Available: ", tons(availF)]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground font-medium",
												children: [
													"Rate: ₹",
													f.ratePerTonDay,
													"/ton/day"
												]
											}), f.tempRange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-mono",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "size-3" }), f.tempRange]
											})]
										})
									]
								}, f.id);
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-card p-4 border border-emerald-500/30 shadow-[var(--shadow-border)] md:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-base font-medium flex items-center gap-2 text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tractor, { className: "size-4 text-emerald-600 dark:text-emerald-400" }),
									"Incoming Farmer Storage Requests (",
									pendingRequests.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground font-mono",
								children: "Click pin or card to Accept / Deny Storage"
							})]
						}), pendingRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "No pending farmer storage requests currently active on the network."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-3 grid-cols-1 md:grid-cols-3",
							children: pendingRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => selectRequest(req.id),
								className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-sm text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors",
										children: req.farmerName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-emerald-600 shrink-0" }), req.farmerVillage]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-[10px]",
										children: "Pending"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-2 text-xs bg-background/80 p-2 rounded-xl border border-border/60 font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: "Harvest"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-foreground",
										children: [
											req.tons,
											"t ",
											req.crop
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: "Duration"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-emerald-700 dark:text-emerald-400",
										children: [req.days, " Days"]
									})] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 pt-2 border-t border-emerald-500/20 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1 group-hover:underline",
										children: "⚡ Review & Allocate Storage →"
									})
								})]
							}, req.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-card p-4 border border-border shadow-[var(--shadow-border)] md:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-base font-medium flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400" }), "Active Stored Lots Across Your Yards"]
						}), inbound.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "No active lots currently stored on your yards."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border",
							children: inbound.map((lot) => {
								const fac = all.find((f) => f.id === lot.facilityId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium",
										children: [
											lot.variety,
											" ",
											lot.crop
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[12px] text-muted-foreground",
										children: [
											"Yard: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: fac?.name
											}),
											" (",
											fac?.city,
											") · Reserved until ",
											shortDate(lot.until)
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400",
											children: tons(lot.tons)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase font-mono",
											children: lot.status
										})]
									})]
								}, lot.id);
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestReviewDialog, {
				open: !!selectedRequestId,
				onOpenChange: (open) => !open && selectRequest(null),
				request: activeReviewRequest
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-[9999] flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					onClick: () => setIsModalOpen(false),
					className: "fixed inset-0 bg-black/60 backdrop-blur-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						scale: .95,
						y: 15
					},
					animate: {
						opacity: 1,
						scale: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						scale: .95,
						y: 15
					},
					className: "relative z-10 w-full max-w-lg rounded-3xl bg-card p-6 border border-border shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-lg font-semibold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-5 text-emerald-600 dark:text-emerald-400" }), "List Available Storage Space"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Publish your open storage capacity, daily rate, and location for farmers to book."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsModalOpen(false),
							className: "rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListStorageForm, { onSuccess: (newFac) => {
						setIsModalOpen(false);
					} })]
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileEditDialog, {
				open: profileEditOpen,
				onOpenChange: setProfileEditOpen,
				profile: {
					name: myProfile?.name || op.name,
					phone: myProfile?.phone || op.contact,
					village_or_company: myProfile?.village_or_company || "",
					farm_or_contact: myProfile?.farm_or_contact || op.name
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
function ListStorageForm({ onSuccess }) {
	const addFacility = useGranary((s) => s.addFacility);
	const [name, setName] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("Niphad");
	const [address, setAddress] = (0, import_react.useState)("");
	const [capacityTons, setCapacityTons] = (0, import_react.useState)(50);
	const [ratePerTonDay, setRatePerTonDay] = (0, import_react.useState)(18);
	const [kind, setKind] = (0, import_react.useState)("cold");
	const [tempRange, setTempRange] = (0, import_react.useState)("0 to 4 C");
	const [selectedCrops, setSelectedCrops] = (0, import_react.useState)(["Grapes", "Onion"]);
	const [error, setError] = (0, import_react.useState)("");
	const cropOptions = [
		"Grapes",
		"Onion",
		"Raisins",
		"Pomegranate",
		"Tomato",
		"Grain",
		"Strawberry"
	];
	const toggleCrop = (c) => {
		if (selectedCrops.includes(c)) setSelectedCrops(selectedCrops.filter((crop) => crop !== c));
		else setSelectedCrops([...selectedCrops, c]);
	};
	const [saving, setSaving] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Please enter a warehouse or yard name.");
			return;
		}
		if (!address.trim()) {
			setError("Please enter the specific location address.");
			return;
		}
		if (capacityTons <= 0) {
			setError("Capacity space must be greater than zero.");
			return;
		}
		if (ratePerTonDay <= 0) {
			setError("Rental rate must be greater than zero.");
			return;
		}
		setSaving(true);
		setError("");
		try {
			const fac = addFacility({
				name,
				city,
				address,
				capacityTons,
				ratePerTonDay,
				kind,
				tempRange: kind === "cold" ? tempRange : void 0,
				crops: selectedCrops
			});
			try {
				const { addFacility: addFacilityServer, loadCatalog } = await import("./granary-KzI4M3Z_.mjs");
				await addFacilityServer({ data: {
					name,
					city,
					address,
					capacityTons,
					ratePerTonDay,
					kind,
					tempRange: kind === "cold" ? tempRange : void 0,
					crops: selectedCrops
				} });
				try {
					const catalog = await loadCatalog();
					useGranary.getState().hydrateFromDb({
						facilities: catalog.facilities,
						operatorsList: catalog.operatorsList
					});
				} catch {}
			} catch (backendErr) {
				console.warn("Backend facility persist skipped:", backendErr);
			}
			onSuccess(fac);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to list storage.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "mt-4 space-y-4",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 shrink-0" }), error]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold text-foreground",
				children: "Yard / Warehouse Name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "e.g. Sahyadri Cellar 4",
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "mt-1 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold text-foreground",
					children: "City / Region Location"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: city,
					onChange: (e) => setCity(e.target.value),
					className: "mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Niphad",
							children: "Niphad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Mohadi",
							children: "Mohadi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Dindori",
							children: "Dindori"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Nashik",
							children: "Nashik"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Lasalgaon",
							children: "Lasalgaon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Pimpalgaon",
							children: "Pimpalgaon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Sinnar",
							children: "Sinnar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Igatpuri",
							children: "Igatpuri"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold text-foreground",
					children: "Facility Kind"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: kind,
					onChange: (e) => setKind(e.target.value),
					className: "mt-1 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "cold",
							children: "Cold Storage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "dry",
							children: "Dry Yard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "packhouse",
							children: "Packhouse"
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold text-foreground",
				children: "Specific Street Address"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "e.g. Plot 12, APMC Yard bypass",
				value: address,
				onChange: (e) => setAddress(e.target.value),
				className: "mt-1 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold text-foreground",
					children: "Available Space (Tons)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						step: 1,
						value: capacityTons,
						onChange: (e) => setCapacityTons(Number(e.target.value)),
						className: "w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-3 top-2.5 text-xs text-muted-foreground",
						children: "tons"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold text-foreground",
					children: "Rate (₹ / Ton / Day)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-3 top-2.5 text-xs text-muted-foreground font-mono",
						children: "₹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						step: 1,
						value: ratePerTonDay,
						onChange: (e) => setRatePerTonDay(Number(e.target.value)),
						className: "w-full rounded-xl border border-border bg-muted/50 pl-7 pr-3.5 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
					})]
				})] })]
			}),
			kind === "cold" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold text-foreground",
				children: "Temperature Range"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "e.g. 0 to 4 C",
				value: tempRange,
				onChange: (e) => setTempRange(e.target.value),
				className: "mt-1 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold text-foreground",
				children: "Crops Supported"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 flex flex-wrap gap-1.5",
				children: cropOptions.map((c) => {
					const active = selectedCrops.includes(c);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => toggleCrop(c),
						className: `rounded-full px-3 py-1 text-xs font-medium transition-all ${active ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`,
						children: [
							c,
							" ",
							active ? "✓" : "+"
						]
					}, c);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border pt-4 flex items-center justify-end gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					className: "w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md",
					children: saving ? "Publishing…" : "Publish Available Storage Space"
				})
			})
		]
	});
}
//#endregion
export { OperatorDesk as component };

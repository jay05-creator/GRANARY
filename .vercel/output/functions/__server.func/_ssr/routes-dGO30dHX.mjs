import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as MapPin, F as Clock, G as ArrowRight, N as FileCheck2, R as CircleCheck, V as ChartColumn, c as Tractor, h as ShieldCheck, m as Smartphone, n as Warehouse, s as TrendingUp } from "../_libs/lucide-react.mjs";
import { c as facilities, o as useGranary, s as KIND_LABEL } from "./router-BUJej2Ex.mjs";
import { i as cn, r as SiteHeader, t as Button } from "./button-oUzGrMHr.mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { n as PinLegend, t as CountUp } from "./count-up-lCBqOaFb.mjs";
import { t as SiteFooter } from "./site-footer-syhel2tB.mjs";
import { t as SpotlightCard } from "./spotlight-card-CwvJ6BMR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-dGO30dHX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Skiper UI-inspired card carousel: snap-scroll with drag. */
function CardCarousel({ children, className }) {
	const ref = (0, import_react.useRef)(null);
	const drag = (0, import_react.useRef)({
		down: false,
		startX: 0,
		scroll: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className),
		onPointerDown: (e) => {
			const el = ref.current;
			if (!el) return;
			drag.current = {
				down: true,
				startX: e.clientX,
				scroll: el.scrollLeft
			};
			el.setPointerCapture(e.pointerId);
		},
		onPointerMove: (e) => {
			if (!drag.current.down || !ref.current) return;
			ref.current.scrollLeft = drag.current.scroll - (e.clientX - drag.current.startX);
		},
		onPointerUp: () => {
			drag.current.down = false;
		},
		children
	});
}
function CarouselCard({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: cn("snap-start shrink-0 w-[min(78vw,320px)] overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-border)]", className),
		children
	});
}
function Home() {
	useReducedMotion();
	const isAuthenticated = useGranary((s) => s.isAuthenticated);
	const role = useGranary((s) => s.role);
	if (isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] flex flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative overflow-hidden border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0 opacity-[0.25]",
							style: {
								backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--primary) 50%, transparent) 1px, transparent 1.4px)",
								backgroundSize: "20px 20px"
							},
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto max-w-4xl px-4 py-14 md:py-20 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }),
										"Welcome back, ",
										role === "farmer" ? "Farmer" : "Operator"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-5 text-3xl font-medium tracking-tight md:text-5xl",
									children: "Granary — Agricultural Storage Network"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed",
									children: "A real-time digital platform connecting grape, onion, and perishable crop growers across the Nashik belt with verified cold rooms, dry yards, and packhouse facilities. Manage your harvest storage, track lots, and optimize storage utilization — all from one dashboard."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 flex flex-wrap items-center justify-center gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: role === "farmer" ? "/farmer" : "/operator",
											children: [
												"Go to ",
												role === "farmer" ? "Farmer" : "Warehouse",
												" Desk",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })
											]
										})
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-b border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-4xl px-4 py-14 md:py-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-medium tracking-tight md:text-3xl text-center",
									children: "What Granary Does"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-center text-muted-foreground text-sm max-w-xl mx-auto",
									children: "End-to-end digital infrastructure for agricultural storage management."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
									children: [
										{
											icon: MapPin,
											title: "Live Storage Map",
											desc: "Interactive map with color-coded pins showing available, full, and your reserved storage bays across the Nashik belt in real time."
										},
										{
											icon: ChartColumn,
											title: "Real-Time Capacity",
											desc: "View live occupancy and remaining capacity for every registered yard — cold rooms, dry yards, and packhouses — before making a booking."
										},
										{
											icon: Smartphone,
											title: "Mobile-First Booking",
											desc: "Book cold rooms or dry yards by crop type, tonnage, and duration directly from your phone. Get instant confirmation and lot tracking."
										},
										{
											icon: FileCheck2,
											title: "WDRA Verification",
											desc: "Warehouse owners submit legal deeds, capacity audits, and WDRA accreditation documents for verified, trustworthy listings."
										},
										{
											icon: TrendingUp,
											title: "Harvest Lot Tracking",
											desc: "Track stored harvest lots from inbound to release. Monitor status, expiry, and facility assignment on a single dashboard."
										},
										{
											icon: Clock,
											title: "AI Advisory",
											desc: "Receive rule-based storage recommendations for temperature, humidity, and best practices tailored to your specific crop and region."
										}
									].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
										className: "p-6 border border-border bg-background shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-4 text-sm font-semibold",
												children: title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
												children: desc
											})
										]
									}, title))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-14 md:py-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto max-w-4xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
									className: "p-8 border border-border bg-card shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tractor, { className: "size-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-5 text-lg font-medium",
											children: "For Farmers & Growers"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-muted-foreground leading-relaxed",
											children: "Find available storage space around Nashik before leaving the farm. Book cold rooms or dry yards by crop, tonnage, and days. Track stored harvest lots on the interactive map until market prices improve."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "mt-4 space-y-2 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Live map with empty, full, and reserved bay indicators"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Instant online booking against live remaining capacity"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Release stored lots with one click when selling"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "AI-powered storage advisory for each crop type"]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
									className: "p-8 border border-border bg-card shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-5 text-lg font-medium",
											children: "For Warehouse Owners & Operators"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-muted-foreground leading-relaxed",
											children: "Maximize yard utilization by listing open storage space with custom daily rental rates and location details. Monitor network fill and incoming lots across all your warehouse units."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "mt-4 space-y-2 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Publish storage space with rate, location, and capacity"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Green-shaded dashboard for yards, occupancy, and fill %"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Review and allocate incoming farmer storage requests"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Upload WDRA accreditation and capacity audit documents"]
												})
											]
										})
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-t border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-4xl px-4 py-14 md:py-16",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-medium tracking-tight text-center",
								children: "Network at a Glance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center",
								children: [
									{
										n: facilities.length,
										label: "Registered Yards"
									},
									{
										n: 240,
										suffix: " t",
										label: "Total Capacity"
									},
									{
										n: 3,
										label: "Facility Types"
									},
									{
										n: 6,
										label: "Cities Covered"
									}
								].map(({ n, suffix = "", label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-2xl font-semibold tabular-nums",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
										value: n,
										suffix
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: label
								})] }, label))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-14 md:py-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
							className: "mx-auto max-w-4xl bg-emerald-700 p-8 text-white md:p-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-medium tracking-tight",
									children: "Ready to manage your harvest storage?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-lg mx-auto text-white/75 text-sm",
									children: "Head to your dashboard to start booking, listing, or tracking your storage operations."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "mt-6 bg-white text-emerald-700 hover:bg-white/90 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: role === "farmer" ? "/farmer" : "/operator",
										children: [
											"Go to ",
											role === "farmer" ? "Farmer" : "Warehouse",
											" Desk",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })
										]
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 opacity-[0.35]",
						style: {
							backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent) 1px, transparent 1.4px)",
							backgroundSize: "22px 22px"
						},
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400" }), "Nashik & Niphad Harvest Belt Storage Network"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-4 text-3xl font-medium tracking-tight md:text-5xl lg:text-[3.2rem] leading-[1.12]",
									children: "Granary: Connecting Harvests to Storage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-[17px]",
									children: "Granary is a real-time digital agricultural storage network. It connects grape, onion, and perishable crop growers across Nashik with verified cold rooms, dry yards, and packhouse facilities."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/login",
											children: ["Access Portal / Sign In", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/login",
											children: "Register New User"
										})
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-[28px] bg-forest text-paper shadow-2xl border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1600&q=75",
										alt: "Nashik vineyard harvest",
										className: "h-[280px] w-full object-cover md:h-[360px]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-px border-t border-paper/15 bg-forest/90 p-4 backdrop-blur-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												n: facilities.length,
												label: "Registered Yards"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												n: 240,
												suffix: " t",
												label: "Peak Capacity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												n: 100,
												suffix: "%",
												label: "Live Map Sync"
											})
										]
									})
								]
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-b border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center max-w-2xl mx-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-medium tracking-tight md:text-4xl",
								children: "What Granary Does"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-muted-foreground text-base",
								children: "An end-to-end digital infrastructure designed specifically for agricultural storage management."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
								className: "p-8 border border-border bg-background shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tractor, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-5 text-xl font-medium",
										children: "For Farmers & Growers"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground leading-relaxed",
										children: "Find available storage space around Nashik before leaving the farm. Book cold rooms or dry yards by crop, tonnage, and days, and track stored lots directly on the interactive map until market prices improve."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "mt-5 space-y-2.5 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Live color-coded map pins showing empty, full, and reserved bays."]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Instant online booking against live remaining capacity."]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Release stored harvest lots with one click when selling."]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
								className: "p-8 border border-border bg-background shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-5 text-xl font-medium",
										children: "For Warehouse Owners & Operators"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground leading-relaxed",
										children: "Maximize yard utilization by listing open storage space with custom daily rental rates (₹/ton/day) and location details. Monitor network fill and active incoming lots across all your warehouse units."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "mt-5 space-y-2.5 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Publish available storage space specifying rate, location, and space."]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Green-shaded dashboard hierarchy for yards, occupancy, and fill %."]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), "Role-restricted secure access for warehouse management."]
											})
										]
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-4 py-16 md:px-6 md:py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-[1400px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-medium tracking-tight md:text-3xl",
								children: "Active Storage Yards on the Belt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-muted-foreground text-sm max-w-xl",
								children: "Explore verified cold storages, dry yards, and packhouses currently listed on the Granary network."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinLegend, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardCarousel, {
								className: "mt-6",
								children: facilities.slice(0, 8).map((fac) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CarouselCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: fac.photo,
									alt: fac.name,
									className: "h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-sm text-foreground",
											children: fac.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: [
												fac.city,
												" · ",
												KIND_LABEL[fac.kind]
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400",
											children: [
												"₹",
												fac.ratePerTonDay,
												"/ton/day · ",
												fac.capacityTons,
												" t cap"
											]
										})
									]
								})] }, fac.id))
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-4 pb-16 md:px-6 md:pb-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
						className: "mx-auto max-w-[1400px] bg-forest p-8 text-paper md:p-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-medium tracking-tight md:text-4xl",
								children: "Ready to manage your harvest storage?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-xl text-paper/75 text-sm",
								children: "Sign in or register a new user account as a Farmer or Warehouse Owner to access your dashboard."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "bg-paper text-forest hover:bg-paper/90 font-medium shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/login",
									children: ["Go to Login & Registration Portal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
								})
							})]
						})
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Stat({ n, label, decimals = 0, suffix = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-lg tabular-nums md:text-xl font-semibold",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
				value: n,
				decimals,
				suffix
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-[11px] text-paper/70",
			children: label
		})]
	});
}
//#endregion
export { Home as component };

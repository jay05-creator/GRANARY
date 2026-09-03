import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { D as LogOut, O as LogIn, d as Sun, r as User, w as Moon, z as ChevronDown } from "../_libs/lucide-react.mjs";
import { d as operators, f as useTheme, o as useGranary, u as farmers } from "./router-BUJej2Ex.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as format, t as parseISO } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-oUzGrMHr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function GranaryMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "10",
				width: "7",
				height: "18",
				rx: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12.5",
				y: "4",
				width: "7",
				height: "24",
				rx: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "12",
				width: "7",
				height: "16",
				rx: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "14",
				width: "3",
				height: "3",
				rx: "0.5",
				fill: "var(--background)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14.5",
				y: "8",
				width: "3",
				height: "3",
				rx: "0.5",
				fill: "var(--background)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "16",
				width: "3",
				height: "3",
				rx: "0.5",
				fill: "var(--background)"
			})
		]
	});
}
function GranaryWordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 text-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GranaryMark, { className: "size-7 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[17px] font-medium tracking-tight",
			children: "Granary"
		})]
	});
}
/** Skiper UI-inspired theme toggle with cross-fading icons. */
function ThemeToggle({ className }) {
	const { theme, toggle } = useTheme();
	const dark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggle,
		"aria-label": dark ? "Switch to light" : "Switch to dark",
		className: cn("relative grid size-11 place-items-center rounded-full border border-border bg-card text-foreground transition-[background-color,box-shadow] duration-150 hover:shadow-[var(--shadow-border)]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("absolute transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", dark ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("absolute transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", dark ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
		})]
	});
}
function tons(n) {
	return `${n.toLocaleString("en-IN", { maximumFractionDigits: 1 })} t`;
}
function rupees(n) {
	return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
function shortDate(iso) {
	try {
		return format(parseISO(iso), "d MMM");
	} catch {
		return iso;
	}
}
function occupancyPct(used, cap) {
	if (cap <= 0) return 0;
	return Math.min(100, Math.round(used / cap * 100));
}
function SiteHeader() {
	const navigate = useNavigate();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const lots = useGranary((s) => s.lots);
	const role = useGranary((s) => s.role);
	const farmerId = useGranary((s) => s.farmerId);
	const operatorId = useGranary((s) => s.operatorId);
	const farmersList = useGranary((s) => s.farmersList);
	const operatorsList = useGranary((s) => s.operatorsList);
	const isAuthenticated = useGranary((s) => s.isAuthenticated);
	const logout = useGranary((s) => s.logout);
	const activeFarmer = (farmersList || farmers).find((f) => f.id === farmerId) || farmers[0];
	const activeOperator = (operatorsList || operators).find((o) => o.id === operatorId) || operators[0];
	const activeUser = role === "farmer" ? activeFarmer.name : activeOperator.name;
	const mine = lots.filter((l) => l.farmerId === farmerId && l.status !== "released");
	const stored = mine.reduce((n, l) => n + l.tons, 0);
	const isEntryPage = path === "/" || path.startsWith("/login");
	const onDesk = path.startsWith("/farmer") || path.startsWith("/operator");
	const handleLogout = () => {
		logout();
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GranaryWordmark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "ml-2 hidden items-center gap-1 md:flex",
					children: [
						!isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							to: "/",
							active: path === "/",
							children: "Home"
						}),
						isAuthenticated && role === "farmer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							to: "/farmer",
							active: path.startsWith("/farmer"),
							children: "Farmer desk"
						}),
						isAuthenticated && role === "operator" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							to: "/operator",
							active: path.startsWith("/operator"),
							children: "Warehouse"
						}),
						!isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							to: "/login",
							active: path.startsWith("/login"),
							children: "Login Portal"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						isAuthenticated && onDesk && mine.length > 0 && role === "farmer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground sm:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-pin-mine" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums text-foreground",
									children: [mine.length, " lots"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: tons(stored)
								})
							]
						}),
						isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-all cursor-default select-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 text-emerald-600 dark:text-emerald-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-[110px] truncate",
										children: activeUser
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] uppercase opacity-75 font-mono",
										children: [
											"(",
											role,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3 opacity-60 group-hover:rotate-180 transition-transform" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-0 top-full pt-1.5 hidden group-hover:block z-50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-48 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1.5 border-b border-border/60",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-medium text-muted-foreground",
												children: "Active User"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-foreground truncate mt-0.5",
												children: activeUser
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-emerald-600 dark:text-emerald-400 font-mono capitalize",
												children: role === "farmer" ? "Farmer Account" : "Warehouse Owner"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleLogout,
										className: "mt-1.5 flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), "Log Out"]
									})]
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							className: "flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-medium transition-colors shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In / Register" })]
						}),
						!isEntryPage && role === "farmer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/farmer",
							className: cn("rounded-full px-3 py-2 text-[13px] font-medium md:hidden", path.startsWith("/farmer") ? "bg-muted text-foreground" : "text-muted-foreground"),
							children: "Desk"
						}),
						!isEntryPage && role === "operator" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/operator",
							className: cn("rounded-full px-3 py-2 text-[13px] font-medium md:hidden", path.startsWith("/operator") ? "bg-muted text-foreground" : "text-muted-foreground"),
							children: "Yard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
					]
				})
			]
		})
	});
}
function NavLink({ to, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: cn("rounded-full px-3.5 py-2 text-[13px] font-medium transition-[background-color,color] duration-150", active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"),
		children
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-transparent text-foreground hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			forest: "bg-forest text-paper hover:bg-forest/90"
		},
		size: {
			default: "h-11 px-5",
			sm: "h-9 px-3.5 text-[13px]",
			lg: "h-12 px-6 text-[15px]",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { occupancyPct as a, tons as c, cn as i, GranaryWordmark as n, rupees as o, SiteHeader as r, shortDate as s, Button as t };

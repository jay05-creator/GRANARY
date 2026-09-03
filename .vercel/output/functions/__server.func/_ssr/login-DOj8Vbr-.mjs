import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as authClient } from "./client-B0OxfG0z.mjs";
import { B as Check, E as MapPin, G as ArrowRight, M as FileText, N as FileCheck2, P as CloudUpload, R as CircleCheck, U as Building2, a as UserCheck, c as Tractor, g as ShieldAlert, h as ShieldCheck, i as UserPlus, k as Lock, n as Warehouse, r as User, t as X, x as Phone } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useGranary } from "./router-BUJej2Ex.mjs";
import { r as SiteHeader, t as Button } from "./button-oUzGrMHr.mjs";
import { r as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as validatePhone, i as validatePassword, r as phoneToSyntheticEmail, t as authRateLimitKey } from "./phone-H0iOOiqk.mjs";
import { t as SiteFooter } from "./site-footer-syhel2tB.mjs";
import { t as SpotlightCard } from "./spotlight-card-CwvJ6BMR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DOj8Vbr-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Client-side rate limiter for auth attempts.
* Blocks further attempts after MAX_ATTEMPTS within WINDOW_MS.
*/
var AUTH_RATE_LIMIT_WINDOW_MS = 9e5;
var AUTH_RATE_LIMIT_MAX = 5;
var authAttempts = /* @__PURE__ */ new Map();
function checkRateLimit(phone) {
	const key = authRateLimitKey(phone);
	const now = Date.now();
	const entry = authAttempts.get(key);
	if (!entry || now - entry.firstAt > AUTH_RATE_LIMIT_WINDOW_MS) {
		authAttempts.set(key, {
			count: 1,
			firstAt: now
		});
		return null;
	}
	if (entry.count >= AUTH_RATE_LIMIT_MAX) {
		const remainingMs = AUTH_RATE_LIMIT_WINDOW_MS - (now - entry.firstAt);
		const remainingMin = Math.ceil(remainingMs / 6e4);
		return `Too many attempts. Please try again in ${remainingMin} minute${remainingMin > 1 ? "s" : ""}.`;
	}
	entry.count += 1;
	return null;
}
/** Stagger children animation variants */
var containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: .06,
			delayChildren: .1
		}
	}
};
var itemVariants = {
	hidden: {
		opacity: 0,
		y: 14
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: .35,
			ease: "easeOut"
		}
	}
};
var cardVariants = {
	hidden: {
		opacity: 0,
		scale: .97,
		y: 20
	},
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: .4,
			ease: [
				.22,
				1,
				.36,
				1
			]
		}
	},
	exit: {
		opacity: 0,
		scale: .97,
		y: -10,
		transition: { duration: .25 }
	}
};
function LoginPage() {
	const navigate = useNavigate();
	const login = useGranary((s) => s.login);
	const registerUser = useGranary((s) => s.registerUser);
	const farmersList = useGranary((s) => s.farmersList);
	const operatorsList = useGranary((s) => s.operatorsList);
	const currentFarmerId = useGranary((s) => s.farmerId);
	const currentOperatorId = useGranary((s) => s.operatorId);
	const [mode, setMode] = (0, import_react.useState)("login");
	const [loginRole, setLoginRole] = (0, import_react.useState)("farmer");
	const [selectedFarmerId, setSelectedFarmerId] = (0, import_react.useState)(currentFarmerId || (farmersList[0] ? farmersList[0].id : "farmer-meera"));
	const [selectedOperatorId, setSelectedOperatorId] = (0, import_react.useState)(currentOperatorId || (operatorsList[0] ? operatorsList[0].id : "op-sahyadri"));
	const [warehouseDoc, setWarehouseDoc] = (0, import_react.useState)(null);
	const [capacityDoc, setCapacityDoc] = (0, import_react.useState)(null);
	const [wdraDoc, setWdraDoc] = (0, import_react.useState)(null);
	const [regName, setRegName] = (0, import_react.useState)("");
	const [regPhone, setRegPhone] = (0, import_react.useState)("");
	const [regPassword, setRegPassword] = (0, import_react.useState)("");
	const [regRole, setRegRole] = (0, import_react.useState)("farmer");
	const [regDetail, setRegDetail] = (0, import_react.useState)("");
	const [regLocation, setRegLocation] = (0, import_react.useState)("Niphad");
	const [regError, setRegError] = (0, import_react.useState)("");
	const [authPhone, setAuthPhone] = (0, import_react.useState)("");
	const [authPassword, setAuthPassword] = (0, import_react.useState)("");
	const [authError, setAuthError] = (0, import_react.useState)("");
	const [authLoading, setAuthLoading] = (0, import_react.useState)(false);
	/** Login — direct phone + password auth (no OTP) */
	const handleLogin = async (e) => {
		if (e) e.preventDefault();
		setAuthError("");
		{
			const phoneError = validatePhone(authPhone);
			if (phoneError) {
				setAuthError(phoneError);
				return;
			}
			if (!authPassword) {
				setAuthError("Enter your password to sign in.");
				return;
			}
			const rateLimitError = checkRateLimit(authPhone);
			if (rateLimitError) {
				setAuthError(rateLimitError);
				return;
			}
			setAuthLoading(true);
			try {
				const { checkAuthRateLimit } = await import("./phone-otp-BaJVdziD.mjs");
				const rl = await checkAuthRateLimit({ data: {
					phone: authPhone.trim(),
					action: "sign_in"
				} });
				if (!rl.allowed) {
					setAuthLoading(false);
					setAuthError(rl.error);
					return;
				}
				const syntheticEmail = phoneToSyntheticEmail(authPhone.trim());
				const { error } = await authClient.signIn.email({
					email: syntheticEmail,
					password: authPassword
				});
				if (error) {
					const { recordAuthAttempt, logAuditEvent } = await import("./phone-otp-BaJVdziD.mjs");
					await recordAuthAttempt({ data: {
						phone: authPhone.trim(),
						action: "sign_in"
					} }).catch(() => {});
					await logAuditEvent({ data: {
						event: "sign_in_failed",
						phone: authPhone.trim(),
						detail: "bad credentials"
					} }).catch(() => {});
					setAuthLoading(false);
					setAuthError("Invalid phone number or password. Please try again.");
					return;
				}
				const { resetAuthRateLimit, logAuditEvent } = await import("./phone-otp-BaJVdziD.mjs");
				await resetAuthRateLimit({ data: {
					phone: authPhone.trim(),
					action: "sign_in"
				} }).catch(() => {});
				await logAuditEvent({ data: {
					event: "sign_in_success",
					phone: authPhone.trim()
				} }).catch(() => {});
				toast.success("Welcome back!", { description: "Signed in successfully." });
				try {
					const { getMyProfile } = await import("./granary-KzI4M3Z_.mjs");
					const profile = await getMyProfile();
					const actualRole = profile?.role === "operator" ? "operator" : "farmer";
					const actualId = actualRole === "farmer" ? String(profile?.user_id || selectedFarmerId) : String(profile?.user_id || selectedOperatorId);
					login(actualRole, actualId);
					navigate({ to: actualRole === "farmer" ? "/farmer" : "/operator" });
				} catch {
					if (loginRole === "farmer") {
						login("farmer", selectedFarmerId);
						navigate({ to: "/farmer" });
					} else {
						login("operator", selectedOperatorId);
						navigate({ to: "/operator" });
					}
				}
			} catch (err) {
				console.error("[AUTH] Login failed:", err);
				setAuthLoading(false);
				setAuthError("Something went wrong. Please try again.");
			}
			return;
		}
	};
	/** Register — direct account creation (no OTP) */
	const handleRegister = async (e) => {
		e.preventDefault();
		setRegError("");
		if (!regName.trim()) {
			setRegError("Please enter your full name.");
			return;
		}
		const phoneErr = validatePhone(regPhone);
		if (phoneErr) {
			setRegError(phoneErr);
			return;
		}
		const passwordErr = validatePassword(regPassword);
		if (passwordErr) {
			setRegError(passwordErr);
			return;
		}
		if (regRole === "operator" && (!warehouseDoc || !capacityDoc || !wdraDoc)) {
			setRegError("Warehouse owners must submit all 3 documentation files (Warehouse Docs, Storage Capacity Docs, and WDRA Verification).");
			return;
		}
		{
			const rateLimitErr = checkRateLimit(regPhone);
			if (rateLimitErr) {
				setRegError(rateLimitErr);
				return;
			}
			setAuthLoading(true);
			try {
				const { checkAuthRateLimit } = await import("./phone-otp-BaJVdziD.mjs");
				const rl = await checkAuthRateLimit({ data: {
					phone: regPhone.trim(),
					action: "sign_up"
				} });
				if (!rl.allowed) {
					setAuthLoading(false);
					setRegError(rl.error);
					return;
				}
				const syntheticEmail = phoneToSyntheticEmail(regPhone.trim());
				const { error } = await authClient.signUp.email({
					email: syntheticEmail,
					password: regPassword,
					name: regName.trim()
				});
				if (error) {
					const { recordAuthAttempt, logAuditEvent } = await import("./phone-otp-BaJVdziD.mjs");
					await recordAuthAttempt({ data: {
						phone: regPhone.trim(),
						action: "sign_up"
					} }).catch(() => {});
					await logAuditEvent({ data: {
						event: "sign_up_failed",
						phone: regPhone.trim(),
						detail: error.message ?? "unknown"
					} }).catch(() => {});
					setAuthLoading(false);
					setRegError(error.message ?? "Unable to create your account. Please try again.");
					return;
				}
				const { resetAuthRateLimit, logAuditEvent } = await import("./phone-otp-BaJVdziD.mjs");
				await resetAuthRateLimit({ data: {
					phone: regPhone.trim(),
					action: "sign_up"
				} }).catch(() => {});
				await logAuditEvent({ data: {
					event: "sign_up_success",
					phone: regPhone.trim()
				} }).catch(() => {});
				await persistProfileAndDocs(regName.trim(), regPhone.trim(), regRole, regDetail, regLocation, syntheticEmail, warehouseDoc, capacityDoc, wdraDoc);
				toast.success("Account created!", { description: "Welcome to Granary." });
				const { role: newRole } = registerUser({
					name: regName.trim(),
					phone: regPhone.trim(),
					role: regRole,
					farmOrCompany: regDetail,
					villageOrContact: regLocation
				});
				navigate({ to: newRole === "farmer" ? "/farmer" : "/operator" });
			} catch (err) {
				console.error("[AUTH] Register failed:", err);
				setAuthLoading(false);
				setRegError("Something went wrong. Please try again.");
			}
			return;
		}
	};
	/** Persist profile + docs to DB after successful auth sign-up */
	async function persistProfileAndDocs(name, phone, role, detail, location, syntheticEmail, wDoc, cDoc, dDoc) {
		try {
			const { upsertProfile, uploadDocument } = await import("./granary-KzI4M3Z_.mjs");
			await upsertProfile({ data: {
				role,
				name,
				phone,
				email: syntheticEmail,
				villageOrCompany: location || void 0,
				farmOrContact: detail || void 0,
				crops: role === "farmer" ? ["Grapes", "Onion"] : []
			} });
			if (role === "operator" && wDoc && cDoc && dDoc) {
				const toB64 = (file) => new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result.split(",")[1] || "");
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
				for (const { file, docType } of [
					{
						file: wDoc,
						docType: "warehouse"
					},
					{
						file: cDoc,
						docType: "capacity"
					},
					{
						file: dDoc,
						docType: "wdra"
					}
				]) await uploadDocument({ data: {
					docType,
					filename: file.name,
					mimeType: file.type || "application/octet-stream",
					contentBase64: await toB64(file)
				} });
			}
		} catch (err) {
			console.error("Profile / document persist failed:", err);
		}
	}
	const activeFarmer = farmersList.find((f) => f.id === selectedFarmerId) || farmersList[0];
	const activeOperator = operatorsList.find((o) => o.id === selectedOperatorId) || operatorsList[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[100dvh] flex-col bg-background text-foreground relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none fixed inset-0 -z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -left-40 size-96 rounded-full bg-emerald-500/5 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -right-40 size-96 rounded-full bg-emerald-600/5 blur-3xl" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 px-4 py-10 md:px-6 md:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .5,
								ease: [
									.22,
									1,
									.36,
									1
								]
							},
							className: "text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
									initial: {
										opacity: 0,
										scale: .9
									},
									animate: {
										opacity: 1,
										scale: 1
									},
									transition: {
										delay: .15,
										duration: .4
									},
									className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), "Granary Identity & Accreditation Portal"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-4 text-3xl font-medium tracking-tight md:text-5xl",
									children: mode === "login" ? "Log in to your desk" : "Create a new account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-base text-muted-foreground max-w-xl mx-auto",
									children: mode === "login" ? "Select your profile to manage your harvest storage or warehouse capacity." : "Register using your phone number, password, and required warehouse accreditation docs."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								delay: .2,
								duration: .4
							},
							className: "mx-auto mt-8 max-w-sm rounded-2xl bg-muted p-1.5 shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
									type: "button",
									onClick: () => setMode("login"),
									whileTap: { scale: .97 },
									className: `flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" }), "Sign In"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
									type: "button",
									onClick: () => setMode("register"),
									whileTap: { scale: .97 },
									className: `flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4 text-emerald-600 dark:text-emerald-400" }), "New User"]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
							mode: "wait",
							children: [mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								variants: cardVariants,
								initial: "hidden",
								animate: "visible",
								exit: "exit",
								className: "mt-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										variants: containerVariants,
										initial: "hidden",
										animate: "visible",
										className: "mx-auto mb-6 max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												variants: itemVariants,
												className: "mb-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
													children: "Account credentials"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: itemVariants,
												className: "relative mb-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
													whileFocus: {
														scale: 1.01,
														boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
													},
													transition: { duration: .2 },
													type: "tel",
													value: authPhone,
													onChange: (e) => setAuthPhone(e.target.value),
													placeholder: "Phone number (e.g. 9823012345)",
													autoComplete: "tel",
													className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none transition-all"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: itemVariants,
												className: "relative mb-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
													whileFocus: {
														scale: 1.01,
														boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
													},
													transition: { duration: .2 },
													type: "password",
													value: authPassword,
													onChange: (e) => setAuthPassword(e.target.value),
													placeholder: "Password",
													autoComplete: "current-password",
													className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: authError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
												initial: {
													opacity: 0,
													height: 0
												},
												animate: {
													opacity: 1,
													height: "auto"
												},
												exit: {
													opacity: 0,
													height: 0
												},
												className: "mb-3 text-xs text-destructive",
												children: authError
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												variants: itemVariants,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
													whileHover: { scale: 1.01 },
													whileTap: { scale: .98 },
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														onClick: handleLogin,
														disabled: authLoading,
														size: "lg",
														className: "w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md disabled:opacity-50",
														children: authLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
															animate: { rotate: 360 },
															transition: {
																duration: 1,
																repeat: Infinity,
																ease: "linear"
															},
															className: "inline-block size-4 border-2 border-white/30 border-t-white rounded-full"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex items-center gap-1",
															children: ["Sign In ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
														})
													})
												})
											})
										]
									}),
									false,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
										className: "overflow-hidden p-6 md:p-10 border border-border shadow-xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
											mode: "wait",
											children: loginRole === "farmer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: containerVariants,
												initial: "hidden",
												animate: "visible",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "flex items-center justify-between border-b border-border pb-5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
															className: "text-xl font-medium text-foreground",
															children: "Farmer Account Login"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm text-muted-foreground",
															children: "Book cold rooms & dry yards, track harvest lots on the live map."
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
															whileHover: {
																rotate: 5,
																scale: 1.1
															},
															className: "hidden size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 md:flex items-center justify-center",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tractor, { className: "size-6" })
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "mt-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
															children: "Select Registered Farmer Account"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "mt-3 grid gap-3 sm:grid-cols-2",
															children: farmersList.map((f, i) => {
																const isSelected = selectedFarmerId === f.id;
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
																	variants: itemVariants,
																	whileHover: { scale: 1.02 },
																	whileTap: { scale: .98 },
																	onClick: () => setSelectedFarmerId(f.id),
																	className: `group relative cursor-pointer rounded-2xl border p-4 transition-all ${isSelected ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm" : "border-border bg-card hover:border-emerald-500/50 hover:bg-muted/50"}`,
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex items-start gap-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																			src: f.photo,
																			alt: f.name,
																			className: "size-11 rounded-full border border-border bg-muted shrink-0"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "flex-1 min-w-0",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																				className: "flex items-center justify-between",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "font-medium text-sm truncate",
																					children: f.name
																				}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" })]
																			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																				className: "text-xs text-muted-foreground mt-0.5 truncate",
																				children: [
																					f.farm,
																					" · ",
																					f.village
																				]
																			})]
																		})]
																	})
																}, f.id);
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-xs text-muted-foreground",
															children: [
																"Selected: ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "text-foreground",
																	children: activeFarmer?.name
																}),
																" (",
																activeFarmer?.village,
																")"
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
															whileHover: { scale: 1.02 },
															whileTap: { scale: .97 },
															className: "w-full sm:w-auto",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																onClick: handleLogin,
																size: "lg",
																className: "w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-8 shadow-md",
																children: ["Enter Farmer Desk", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
															})
														})]
													})
												]
											}, "farmer-login") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: containerVariants,
												initial: "hidden",
												animate: "visible",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "flex items-center justify-between border-b border-border pb-5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
															className: "text-xl font-medium text-foreground",
															children: "Warehouse Owner Login"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm text-muted-foreground",
															children: "Manage storage yards, list available space with daily rates, and submit WDRA verification."
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
															whileHover: {
																rotate: -5,
																scale: 1.1
															},
															className: "hidden size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 md:flex items-center justify-center",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-6" })
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "mt-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
															children: "Select Registered Warehouse Owner"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "mt-3 grid gap-3 sm:grid-cols-2",
															children: operatorsList.map((op) => {
																const isSelected = selectedOperatorId === op.id;
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
																	variants: itemVariants,
																	whileHover: { scale: 1.02 },
																	whileTap: { scale: .98 },
																	onClick: () => setSelectedOperatorId(op.id),
																	className: `group relative cursor-pointer rounded-2xl border p-4 transition-all ${isSelected ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm" : "border-border bg-card hover:border-emerald-500/50 hover:bg-muted/50"}`,
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex items-start justify-between gap-2",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																			className: "font-medium text-sm text-foreground",
																			children: op.name
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																			className: "text-xs text-muted-foreground mt-0.5",
																			children: op.contact
																		})] }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 dark:text-emerald-400 shrink-0" })]
																	})
																}, op.id);
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "mt-8 border-t border-border pt-6",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
																className: "text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "size-4 text-emerald-600 dark:text-emerald-400" }), "Warehouse Documentation Uploads"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground mt-1",
																children: "Submit required legal deed, capacity audit, and WDRA accreditation documents."
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mt-4 grid gap-4 sm:grid-cols-3",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUploadCard, {
																		label: "1. Warehouse Documentations",
																		description: "Title deed or lease agreement",
																		file: warehouseDoc,
																		onFileChange: setWarehouseDoc
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUploadCard, {
																		label: "2. Storage Capacity Docs",
																		description: "Engineering capacity audit",
																		file: capacityDoc,
																		onFileChange: setCapacityDoc
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUploadCard, {
																		label: "3. WDRA Verification",
																		description: "WDRA accreditation certificate",
																		file: wdraDoc,
																		onFileChange: setWdraDoc
																	})
																]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														variants: itemVariants,
														className: "mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-xs text-muted-foreground",
															children: ["Selected: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																className: "text-foreground",
																children: activeOperator?.name
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
															whileHover: { scale: 1.02 },
															whileTap: { scale: .97 },
															className: "w-full sm:w-auto",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																onClick: handleLogin,
																size: "lg",
																className: "w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-8 shadow-md",
																children: ["Enter Warehouse Desk", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
															})
														})]
													})
												]
											}, "operator-login")
										})
									})
								]
							}, "login"), mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								variants: cardVariants,
								initial: "hidden",
								animate: "visible",
								exit: "exit",
								className: "mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
									className: "overflow-hidden p-6 md:p-10 border border-border shadow-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleRegister,
										className: "space-y-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												variants: itemVariants,
												className: "flex items-center justify-between border-b border-border pb-5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
													className: "text-xl font-medium text-foreground flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-5 text-emerald-600 dark:text-emerald-400" }), "Register New User Account"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Create your account with mobile phone number, password, role, and verification docs."
												})] })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: regError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												initial: {
													opacity: 0,
													height: 0
												},
												animate: {
													opacity: 1,
													height: "auto"
												},
												exit: {
													opacity: 0,
													height: 0
												},
												className: "rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 shrink-0" }), regError]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: itemVariants,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
													children: "Select Account Role"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 grid grid-cols-2 gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
														type: "button",
														onClick: () => setRegRole("farmer"),
														whileHover: { scale: 1.02 },
														whileTap: { scale: .97 },
														className: `flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-sm font-medium transition-all ${regRole === "farmer" ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold" : "border-border bg-card text-muted-foreground hover:text-foreground"}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tractor, { className: "size-4" }), "I am a Farmer"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
														type: "button",
														onClick: () => setRegRole("operator"),
														whileHover: { scale: 1.02 },
														whileTap: { scale: .97 },
														className: `flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-sm font-medium transition-all ${regRole === "operator" ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold" : "border-border bg-card text-muted-foreground hover:text-foreground"}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-4" }), "I am a Warehouse Owner"]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: itemVariants,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-foreground",
													children: "Full Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
														whileFocus: {
															scale: 1.01,
															boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
														},
														transition: { duration: .2 },
														type: "text",
														placeholder: "e.g. Dnyaneshwar Shinde",
														value: regName,
														onChange: (e) => setRegName(e.target.value),
														className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: itemVariants,
												className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-foreground",
													children: "Phone Number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
														whileFocus: {
															scale: 1.01,
															boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
														},
														transition: { duration: .2 },
														type: "tel",
														placeholder: "e.g. 9823012345",
														value: regPhone,
														onChange: (e) => setRegPhone(e.target.value),
														className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none transition-all"
													})]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-xs font-semibold text-foreground",
														children: "Password"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative mt-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
															whileFocus: {
																scale: 1.01,
																boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
															},
															transition: { duration: .2 },
															type: "password",
															placeholder: "Min 8 chars, upper, lower, number",
															value: regPassword,
															onChange: (e) => setRegPassword(e.target.value),
															className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
														})]
													}),
													regPassword.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
														initial: {
															opacity: 0,
															height: 0
														},
														animate: {
															opacity: 1,
															height: "auto"
														},
														className: "mt-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordStrengthBar, { password: regPassword })
													})
												] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												variants: itemVariants,
												className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-foreground",
													children: regRole === "farmer" ? "Farm / Orchard Name" : "Warehouse Company Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
														whileFocus: {
															scale: 1.01,
															boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
														},
														transition: { duration: .2 },
														type: "text",
														placeholder: regRole === "farmer" ? "e.g. Shinde Grape Farm" : "e.g. Nashik Cold Storage Pvt Ltd",
														value: regDetail,
														onChange: (e) => setRegDetail(e.target.value),
														className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
													})]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-foreground",
													children: "Location / Village"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "absolute left-3.5 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.input, {
														whileFocus: {
															scale: 1.01,
															boxShadow: "0 0 0 2px rgba(16,185,129,0.25)"
														},
														transition: { duration: .2 },
														type: "text",
														placeholder: "e.g. Niphad, Nashik",
														value: regLocation,
														onChange: (e) => setRegLocation(e.target.value),
														className: "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
													})]
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: regRole === "operator" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												initial: {
													opacity: 0,
													height: 0
												},
												animate: {
													opacity: 1,
													height: "auto"
												},
												exit: {
													opacity: 0,
													height: 0
												},
												className: "border-t border-border pt-5 overflow-hidden",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
														className: "text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "size-4 text-emerald-600 dark:text-emerald-400" }), "Submit Mandatory Warehouse Documentation Files (3 Required)"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground mt-1",
														children: "Upload title deed, certified capacity report, and WDRA accreditation certificate."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-4 grid gap-4 sm:grid-cols-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUploadCard, {
																label: "1. Warehouse Documentations",
																description: "Title deed or lease agreement",
																file: warehouseDoc,
																onFileChange: setWarehouseDoc
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUploadCard, {
																label: "2. Storage Capacity Docs",
																description: "Engineering capacity audit",
																file: capacityDoc,
																onFileChange: setCapacityDoc
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUploadCard, {
																label: "3. WDRA Verification",
																description: "WDRA accreditation certificate",
																file: wdraDoc,
																onFileChange: setWdraDoc
															})
														]
													})
												]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												variants: itemVariants,
												className: "mt-6 border-t border-border pt-5 flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
													whileHover: { scale: 1.01 },
													whileTap: { scale: .98 },
													className: "w-full sm:w-auto",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "submit",
														size: "lg",
														disabled: authLoading,
														className: "w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-8 shadow-md disabled:opacity-50",
														children: authLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
															animate: { rotate: 360 },
															transition: {
																duration: 1,
																repeat: Infinity,
																ease: "linear"
															},
															className: "inline-block size-4 border-2 border-white/30 border-t-white rounded-full"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex items-center gap-1",
															children: ["Complete Registration & Sign In ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
														})
													})
												})
											})
										]
									})
								})
							}, "register")]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function FileUploadCard({ label, description, file, onFileChange }) {
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const handleFileSelect = (e) => {
		setErrorMsg("");
		if (e.target.files && e.target.files[0]) {
			const selected = e.target.files[0];
			if (!selected.name.toLowerCase().endsWith(".pdf") && selected.type !== "application/pdf") {
				setErrorMsg("Only PDF (.pdf) files are allowed.");
				onFileChange(null);
				return;
			}
			onFileChange(selected);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		whileHover: {
			scale: 1.02,
			y: -2
		},
		transition: { duration: .2 },
		className: `rounded-2xl border p-4 transition-all ${file ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30" : errorMsg ? "border-destructive/50 bg-destructive/5" : "border-border bg-card/60 hover:border-emerald-500/40"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-foreground",
					children: label
				}), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					initial: { scale: 0 },
					animate: { scale: 1 },
					transition: {
						type: "spring",
						stiffness: 500,
						damping: 20
					},
					className: "flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-muted-foreground mt-1 leading-tight",
				children: [description, " (PDF only)"]
			}),
			errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] font-medium text-destructive mt-1.5 flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3 shrink-0" }), errorMsg]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						scale: .95
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					className: "flex items-center justify-between rounded-xl bg-background border border-emerald-500/40 p-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 truncate",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-mono text-[11px]",
							children: file.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onFileChange(null),
						className: "text-muted-foreground hover:text-destructive p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/30 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-3.5" }),
						"Choose PDF File",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "application/pdf,.pdf",
							onChange: handleFileSelect,
							className: "hidden"
						})
					]
				})
			})
		]
	});
}
/** Visual password strength bar with criteria checklist. */
function PasswordStrengthBar({ password }) {
	const hasLength = password.length >= 8;
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const score = [
		hasLength,
		hasUpper,
		hasLower,
		hasNumber
	].filter(Boolean).length;
	const barColor = score <= 1 ? "bg-red-500" : score === 2 ? "bg-orange-400" : score === 3 ? "bg-yellow-400" : "bg-emerald-500";
	const label = score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
	const labelColor = score <= 1 ? "text-red-500" : score === 2 ? "text-orange-400" : score === 3 ? "text-yellow-500" : "text-emerald-500";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 flex-1 rounded-full bg-muted overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { width: 0 },
					animate: { width: `${score / 4 * 100}%` },
					transition: {
						duration: .4,
						ease: "easeOut"
					},
					className: `h-full rounded-full ${barColor}`
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `ml-2 text-[10px] font-semibold ${labelColor}`,
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-x-3 gap-y-0.5",
			children: [
				{
					met: hasLength,
					text: "8+ characters"
				},
				{
					met: hasUpper,
					text: "Uppercase letter"
				},
				{
					met: hasLower,
					text: "Lowercase letter"
				},
				{
					met: hasNumber,
					text: "Number"
				}
			].map(({ met, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `text-[10px] flex items-center gap-1 ${met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`,
				children: [met ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 inline-block rounded-full border border-muted-foreground/40" }), text]
			}, text))
		})]
	});
}
//#endregion
export { LoginPage as component };

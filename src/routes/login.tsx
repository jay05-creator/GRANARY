import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  UserCheck,
  Warehouse,
  Tractor,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  Phone,
  Lock,
  User as UserIcon,
  MapPin,
  Building2,
  ShieldAlert,
  UploadCloud,
  FileText,
  Check,
  X,
  FileCheck2,
} from "lucide-react";
import { SiteHeader } from "@/client/components/layout/site-header";
import { useLocale } from "@/client/components/locale-provider";
import { t } from "@/client/i18n";
import { SiteFooter } from "@/client/components/layout/site-footer";
import { Button } from "@/client/components/ui/button";
import { SpotlightCard } from "@/client/components/effects/spotlight-card";
import { LeafBackground } from "@/client/components/effects/leaf-background";
import { useGranary } from "@/shared/store";
import type { Role } from "@/shared/types";
import { authClient, authEnabled, setBearerToken } from "@/shared/auth/client";
import { emailAndPasswordEnabled } from "@/shared/auth/email-password";
import {
  normalizePhone,
  validatePhone,
  validatePassword,
  phoneToSyntheticEmail,
  authRateLimitKey,
} from "@/shared/phone";

/**
 * Client-side rate limiter for auth attempts.
 * Blocks further attempts after MAX_ATTEMPTS within WINDOW_MS.
 */
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const AUTH_RATE_LIMIT_MAX = 5;
const authAttempts = new Map<string, { count: number; firstAt: number }>();

function checkRateLimit(phone: string): string | null {
  const key = authRateLimitKey(phone);
  const now = Date.now();
  const entry = authAttempts.get(key);
  if (!entry || now - entry.firstAt > AUTH_RATE_LIMIT_WINDOW_MS) {
    authAttempts.set(key, { count: 1, firstAt: now });
    return null;
  }
  if (entry.count >= AUTH_RATE_LIMIT_MAX) {
    const remainingMs = AUTH_RATE_LIMIT_WINDOW_MS - (now - entry.firstAt);
    const remainingMin = Math.ceil(remainingMs / 60000);
    return `Too many attempts. Please try again in ${remainingMin} minute${remainingMin > 1 ? "s" : ""}.`;
  }
  entry.count += 1;
  return null;
}

/** Stagger children animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -10,
    transition: { duration: 0.25 },
  },
} as const;

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const login = useGranary((s) => s.login);
  const registerUser = useGranary((s) => s.registerUser);
  const farmersList = useGranary((s) => s.farmersList);
  const operatorsList = useGranary((s) => s.operatorsList);

  const currentFarmerId = useGranary((s) => s.farmerId);
  const currentOperatorId = useGranary((s) => s.operatorId);

  const [mode, setMode] = useState<"login" | "register">("login");

  // Login Mode State
  const [loginRole, setLoginRole] = useState<Role>("farmer");
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(
    currentFarmerId || (farmersList[0] ? farmersList[0].id : "farmer-meera"),
  );
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(
    currentOperatorId || (operatorsList[0] ? operatorsList[0].id : "op-sahyadri"),
  );

  // 3 Warehouse Document Upload States
  const [warehouseDoc, setWarehouseDoc] = useState<File | null>(null);
  const [capacityDoc, setCapacityDoc] = useState<File | null>(null);
  const [wdraDoc, setWdraDoc] = useState<File | null>(null);

  // Register Mode State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<Role>("farmer");
  const [regDetail, setRegDetail] = useState("");
  const [regLocation, setRegLocation] = useState("Niphad");
  const [regError, setRegError] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  // OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(true); // BYPASS OTP FOR DEMO
  const [otpError, setOtpError] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

  /** Login — direct phone + password auth (no OTP) */
  /** Send OTP to phone number */
  const handleSendOtp = async (phone: string, purpose: "login" | "register") => {
    setOtpError("");
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setOtpError(phoneError);
      return;
    }
    
    try {
      const { sendPhoneOtp } = await import("@/server/modules/phone-otp");
      const result = await sendPhoneOtp({ data: { phone: phone.trim(), purpose } });
      
      if (result.ok) {
        if ("devCode" in result && result.devCode) {
          console.info(`[OTP] Code for ${phone.trim()} (${purpose}): ${result.devCode}`);
        }
        setOtpSent(true);
        toast.success("OTP sent!", { description: "Check your phone for the verification code." });
        // Start cooldown
        setOtpCooldown(60);
        const interval = setInterval(() => {
          setOtpCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOtpError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("[OTP] Send failed:", err);
      setOtpError("Failed to send OTP. Please try again.");
    }
  };

  /** Verify OTP code */
  const handleVerifyOtp = async (phone: string, purpose: "login" | "register") => {
    setOtpError("");
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit OTP code.");
      return;
    }
    
    setOtpVerifying(true);
    try {
      const { verifyPhoneOtp } = await import("@/server/modules/phone-otp");
      const result = await verifyPhoneOtp({ data: { phone: phone.trim(), code: otpCode, purpose } });
      
      if (result.ok) {
        setOtpVerified(true);
        toast.success("Phone verified!", { description: "You can now proceed with sign-in." });
      } else {
        setOtpError(result.error || "Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error("[OTP] Verify failed:", err);
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");

    if (authEnabled && emailAndPasswordEnabled) {
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
      // Check OTP verification
      if (!otpVerified) {
        setAuthError("Please verify your phone number with OTP first.");
        return;
      }

      setAuthLoading(true);
      try {
        // Server-side rate limit check
        const { checkAuthRateLimit } = await import("@/server/modules/phone-otp");
        const rl = await checkAuthRateLimit({ data: { phone: authPhone.trim(), action: "sign_in" } });
        if (!rl.allowed) {
          setAuthLoading(false);
          setAuthError(rl.error);
          return;
        }

        // Direct sign-in via Better Auth
        const syntheticEmail = phoneToSyntheticEmail(authPhone.trim());
        const { data, error } = await authClient.signIn.email({
          email: syntheticEmail,
          password: authPassword,
        });

        if (data?.token) {
          setBearerToken(data.token);
        }

        if (error) {
          const { recordAuthAttempt, logAuditEvent } = await import("@/server/modules/phone-otp");
          await recordAuthAttempt({ data: { phone: authPhone.trim(), action: "sign_in" } }).catch(() => {});
          await logAuditEvent({ data: { event: "sign_in_failed", phone: authPhone.trim(), detail: "bad credentials" } }).catch(() => {});
          setAuthLoading(false);
          setAuthError("Invalid phone number or password. Please try again.");
          return;
        }

        // Authenticated
        const { resetAuthRateLimit, logAuditEvent } = await import("@/server/modules/phone-otp");
        await resetAuthRateLimit({ data: { phone: authPhone.trim(), action: "sign_in" } }).catch(() => {});
        await logAuditEvent({ data: { event: "sign_in_success", phone: authPhone.trim() } }).catch(() => {});

        toast.success("Welcome back!", { description: "Signed in successfully." });

        // Look up actual role from DB
        try {
          const { getMyProfile } = await import("@/server/modules/granary");
          const profile = await getMyProfile() as Record<string, unknown> | null;
          const actualRole: Role = profile?.role === "operator" ? "operator" : "farmer";
          const actualId = actualRole === "farmer"
            ? String(profile?.user_id || selectedFarmerId)
            : String(profile?.user_id || selectedOperatorId);
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

    // Auth disabled — direct profile login (demo mode)
    if (loginRole === "farmer") {
      login("farmer", selectedFarmerId);
      navigate({ to: "/farmer" });
    } else {
      login("operator", selectedOperatorId);
      navigate({ to: "/operator" });
    }
  };

  /** Register — direct account creation (no OTP) */
  const handleRegister = async (e: React.FormEvent) => {
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
    // Check OTP verification
    if (!otpVerified) {
      setRegError("Please verify your phone number with OTP first.");
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

    if (authEnabled && emailAndPasswordEnabled) {
      const rateLimitErr = checkRateLimit(regPhone);
      if (rateLimitErr) {
        setRegError(rateLimitErr);
        return;
      }

      setAuthLoading(true);
      try {
        const { checkAuthRateLimit } = await import("@/server/modules/phone-otp");
        const rl = await checkAuthRateLimit({ data: { phone: regPhone.trim(), action: "sign_up" } });
        if (!rl.allowed) {
          setAuthLoading(false);
          setRegError(rl.error);
          return;
        }

        // Direct sign-up via Better Auth
        const syntheticEmail = phoneToSyntheticEmail(regPhone.trim());
        const { data, error } = await authClient.signUp.email({
          email: syntheticEmail,
          password: regPassword,
          name: regName.trim(),
        });

        if (data?.token) {
          setBearerToken(data.token);
        }

        if (error) {
          const { recordAuthAttempt, logAuditEvent } = await import("@/server/modules/phone-otp");
          await recordAuthAttempt({ data: { phone: regPhone.trim(), action: "sign_up" } }).catch(() => {});
          await logAuditEvent({ data: { event: "sign_up_failed", phone: regPhone.trim(), detail: error.message ?? "unknown" } }).catch(() => {});
          setAuthLoading(false);
          setRegError(error.message ?? "Unable to create your account. Please try again.");
          return;
        }

        // Success
        const { resetAuthRateLimit, logAuditEvent } = await import("@/server/modules/phone-otp");
        await resetAuthRateLimit({ data: { phone: regPhone.trim(), action: "sign_up" } }).catch(() => {});
        await logAuditEvent({ data: { event: "sign_up_success", phone: regPhone.trim() } }).catch(() => {});

        await persistProfileAndDocs(regName.trim(), regPhone.trim(), regRole, regDetail, regLocation, syntheticEmail, warehouseDoc, capacityDoc, wdraDoc);

        toast.success("Account created!", { description: "Welcome to Granary." });

        const { role: newRole } = registerUser({ name: regName.trim(), phone: regPhone.trim(), role: regRole, farmOrCompany: regDetail, villageOrContact: regLocation });
        navigate({ to: newRole === "farmer" ? "/farmer" : "/operator" });
      } catch (err) {
        console.error("[AUTH] Register failed:", err);
        setAuthLoading(false);
        setRegError("Something went wrong. Please try again.");
      }
      return;
    }

    // Auth disabled — direct register (demo mode)
    const { role: newRole } = registerUser({ name: regName.trim(), phone: regPhone.trim(), role: regRole, farmOrCompany: regDetail, villageOrContact: regLocation });
    navigate({ to: newRole === "farmer" ? "/farmer" : "/operator" });
  };

  /** Persist profile + docs to DB after successful auth sign-up */
  async function persistProfileAndDocs(
    name: string, phone: string, role: Role, detail: string, location: string,
    syntheticEmail: string,
    wDoc: File | null, cDoc: File | null, dDoc: File | null,
  ) {
    try {
      const { upsertProfile, uploadDocument } = await import("@/server/modules/granary");
      await upsertProfile({
        data: {
          role, name, phone, email: syntheticEmail,
          villageOrCompany: location || undefined,
          farmOrContact: detail || undefined,
          crops: role === "farmer" ? ["Grapes", "Onion"] : [],
        },
      });
      if (role === "operator" && wDoc && cDoc && dDoc) {
        const toB64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1] || "");
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        for (const { file, docType } of [
          { file: wDoc, docType: "warehouse" as const },
          { file: cDoc, docType: "capacity" as const },
          { file: dDoc, docType: "wdra" as const },
        ]) {
          await uploadDocument({ data: { docType, filename: file.name, mimeType: file.type || "application/octet-stream", contentBase64: await toB64(file) } });
        }
      }
    } catch (err) {
      console.error("Profile / document persist failed:", err);
    }
  }

  const activeFarmer = farmersList.find((f) => f.id === selectedFarmerId) || farmersList[0];
  const activeOperator = operatorsList.find((o) => o.id === selectedOperatorId) || operatorsList[0];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-transparent text-foreground relative overflow-hidden">
      <LeafBackground />

      <SiteHeader />
      <main className="flex-1 px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
            >
              <ShieldCheck className="size-3.5" />
              Granary Identity & Accreditation Portal
            </motion.span>
            <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl text-white">
              {mode === "login" ? t("login.loginTitle", locale) : t("login.registerTitle", locale)}
            </h1>
            <p className="mt-3 text-base text-black max-w-xl mx-auto">
              {mode === "login"
                ? t("login.loginDesc", locale)
                : t("login.registerDesc", locale)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mx-auto mt-8 max-w-sm rounded-2xl bg-muted p-1.5 shadow-inner"
          >
            <div className="grid grid-cols-2 gap-1">
              <motion.button
                type="button"
                onClick={() => setMode("login")}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserCheck className="size-4" />
                {t("login.signInBtn", locale)}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setMode("register")}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                  mode === "register"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="size-4 text-emerald-600 dark:text-emerald-400" />
                {t("login.newUserBtn", locale)}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-8"
              >
                {authEnabled && emailAndPasswordEnabled && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto mb-6 max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/5"
                  >
                    <motion.div variants={itemVariants} className="mb-4">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("login.accCreds", locale)}
                      </label>
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative mb-3">
                      <Phone className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                      <motion.input
                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                        transition={{ duration: 0.2 }}
                        type="tel"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder={t("login.phonePlaceholder", locale)}
                        autoComplete="tel"
                        className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </motion.div>
                    {authPhone && !otpVerified && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-3"
                      >
                        {!otpSent ? (
                          <motion.button
                            type="button"
                            onClick={() => handleSendOtp(authPhone, "login")}
                            disabled={otpCooldown > 0}
                            className="w-full rounded-xl border border-emerald-500/50 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Send OTP to verify phone"}
                          </motion.button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                className="flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm font-mono tracking-widest text-center focus:border-emerald-500 focus:outline-none transition-all"
                              />
                              <motion.button
                                type="button"
                                onClick={() => void handleVerifyOtp(authPhone, "login")}
                                disabled={otpVerifying}
                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
                              >
                                {otpVerifying ? "Verifying..." : "Verify"}
                              </motion.button>
                            </div>
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpSent(false);
                                  setOtpCode("");
                                  setOtpVerified(false);
                                }}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                Change phone number
                              </button>
                              {otpCooldown === 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSendOtp(authPhone, "login")}
                                  className="text-xs text-emerald-600 hover:text-emerald-500"
                                >
                                  Resend OTP
                                </button>
                              )}
                            </div>
                            {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    <motion.div variants={itemVariants} className="relative mb-3">
                      <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                      <motion.input
                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                        transition={{ duration: 0.2 }}
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder={t("login.password", locale)}
                        autoComplete="current-password"
                        className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </motion.div>
                    <AnimatePresence>
                      {authError && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-3 text-xs text-destructive"
                        >
                          {authError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <motion.div variants={itemVariants}>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleLogin}
                          disabled={authLoading}
                          size="lg"
                          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-md disabled:opacity-50"
                        >
                          {authLoading ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <span className="flex items-center gap-1">Sign In <ArrowRight className="size-4" /></span>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

              </motion.div>
            )}

            {mode === "register" && (
              <motion.div
                key="register"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-8"
              >
                <SpotlightCard className="overflow-hidden p-6 md:p-10 border border-border shadow-xl">
                  <form onSubmit={handleRegister} className="space-y-5">
                    <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-border pb-5">
                      <div>
                        <h2 className="text-xl font-medium text-foreground flex items-center gap-2">
                          <UserPlus className="size-5 text-emerald-600 dark:text-emerald-400" />
                          {t("login.registerNewUser", locale)}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {t("login.registerNewUserDesc", locale)}
                        </p>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {regError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2"
                        >
                          <ShieldAlert className="size-4 shrink-0" />
                          {regError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants}>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("login.selectAccRole", locale)}
                      </label>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setRegRole("farmer")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-sm font-medium transition-all ${
                            regRole === "farmer"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "border-border bg-card text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Tractor className="size-4" />
                          {t("login.iAmFarmer", locale)}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setRegRole("operator")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-sm font-medium transition-all ${
                            regRole === "operator"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "border-border bg-card text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Warehouse className="size-4" />
                          {t("login.iAmOperator", locale)}
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="text-xs font-semibold text-foreground">{t("login.fullName", locale)}</label>
                      <div className="relative mt-1">
                        <UserIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                        <motion.input
                          whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                          transition={{ duration: 0.2 }}
                          type="text"
                          placeholder={t("login.namePlaceholder", locale)}
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground">{t("login.phoneNumber", locale)}</label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                          <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                            transition={{ duration: 0.2 }}
                            type="tel"
                            placeholder="e.g. 9823012345"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      {regPhone && !otpVerified && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="col-span-1 sm:col-span-2"
                        >
                          {!otpSent ? (
                            <motion.button
                              type="button"
                              onClick={() => handleSendOtp(regPhone, "register")}
                              disabled={otpCooldown > 0}
                              className="w-full rounded-xl border border-emerald-500/50 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                            >
                              {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Send OTP to verify phone number"}
                            </motion.button>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                  placeholder="Enter 6-digit OTP"
                                  className="flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm font-mono tracking-widest text-center focus:border-emerald-500 focus:outline-none transition-all"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => void handleVerifyOtp(regPhone, "register")}
                                  disabled={otpVerifying}
                                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
                                >
                                  {otpVerifying ? "Verifying..." : "Verify"}
                                </motion.button>
                              </div>
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOtpSent(false);
                                    setOtpCode("");
                                    setOtpVerified(false);
                                  }}
                                  className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Change phone number
                                </button>
                                {otpCooldown === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSendOtp(regPhone, "register")}
                                    className="text-xs text-emerald-600 hover:text-emerald-500"
                                  >
                                    Resend OTP
                                  </button>
                                )}
                              </div>
                              {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                            </div>
                          )}
                        </motion.div>
                      )}
                      <div>
                        <label className="text-xs font-semibold text-foreground">Password</label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                          <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                            transition={{ duration: 0.2 }}
                            type="password"
                            placeholder="Min 8 chars, upper, lower, number"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
                          />
                        </div>
                        {regPassword.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2"
                          >
                            <PasswordStrengthBar password={regPassword} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground">
                          {regRole === "farmer" ? "Farm / Orchard Name" : "Warehouse Company Name"}
                        </label>
                        <div className="relative mt-1">
                          <Building2 className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                          <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            placeholder={regRole === "farmer" ? "e.g. Shinde Grape Farm" : "e.g. Nashik Cold Storage Pvt Ltd"}
                            value={regDetail}
                            onChange={(e) => setRegDetail(e.target.value)}
                            className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground">Location / Village</label>
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                          <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(16,185,129,0.25)" }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            placeholder="e.g. Niphad, Nashik"
                            value={regLocation}
                            onChange={(e) => setRegLocation(e.target.value)}
                            className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {regRole === "operator" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border pt-5 overflow-hidden"
                        >
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                            <FileCheck2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                            Submit Mandatory Warehouse Documentation Files (3 Required)
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload title deed, certified capacity report, and WDRA accreditation certificate.
                          </p>

                          <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            <FileUploadCard
                              label="1. Warehouse Documentations"
                              description="Title deed or lease agreement"
                              file={warehouseDoc}
                              onFileChange={setWarehouseDoc}
                            />
                            <FileUploadCard
                              label="2. Storage Capacity Docs"
                              description="Engineering capacity audit"
                              file={capacityDoc}
                              onFileChange={setCapacityDoc}
                            />
                            <FileUploadCard
                              label="3. WDRA Verification"
                              description="WDRA accreditation certificate"
                              file={wdraDoc}
                              onFileChange={setWdraDoc}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="mt-6 border-t border-border pt-5 flex justify-end">
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={authLoading}
                          className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-8 shadow-md disabled:opacity-50"
                        >
                          {authLoading ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <span className="flex items-center gap-1">Complete Registration & Sign In <ArrowRight className="size-4" /></span>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </SpotlightCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function FileUploadCard({
  label,
  description,
  file,
  onFileChange,
}: {
  label: string;
  description: string;
  file: File | null;
  onFileChange: (f: File | null) => void;
}) {
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border p-4 transition-all ${
        file
          ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30"
          : errorMsg
          ? "border-destructive/50 bg-destructive/5"
          : "border-border bg-card/60 hover:border-emerald-500/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {file ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white"
          >
            <Check className="size-3" />
          </motion.span>
        ) : (
          <UploadCloud className="size-4 text-muted-foreground" />
        )}
      </div>

      <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{description} (PDF only)</p>

      {errorMsg && (
        <p className="text-[10px] font-medium text-destructive mt-1.5 flex items-center gap-1">
          <ShieldAlert className="size-3 shrink-0" />
          {errorMsg}
        </p>
      )}

      <div className="mt-3">
        {file ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between rounded-xl bg-background border border-emerald-500/40 p-2 text-xs"
          >
            <div className="flex items-center gap-1.5 truncate">
              <FileText className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate font-mono text-[11px]">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="text-muted-foreground hover:text-destructive p-0.5"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/30 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors">
            <UploadCloud className="size-3.5" />
            Choose PDF File
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>
    </motion.div>
  );
}

/** Visual password strength bar with criteria checklist. */
function PasswordStrengthBar({ password }: { password: string }) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const score = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;

  const barColor =
    score <= 1
      ? "bg-red-500"
      : score === 2
        ? "bg-orange-400"
        : score === 3
          ? "bg-yellow-400"
          : "bg-emerald-500";

  const label =
    score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
  const labelColor =
    score <= 1
      ? "text-red-500"
      : score === 2
        ? "text-orange-400"
        : score === 3
          ? "text-yellow-500"
          : "text-emerald-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / 4) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>
        <span className={`ml-2 text-[10px] font-semibold ${labelColor}`}>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {[
          { met: hasLength, text: "8+ characters" },
          { met: hasUpper, text: "Uppercase letter" },
          { met: hasLower, text: "Lowercase letter" },
          { met: hasNumber, text: "Number" },
        ].map(({ met, text }) => (
          <span
            key={text}
            className={`text-[10px] flex items-center gap-1 ${
              met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            }`}
          >
            {met ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <span className="size-3 inline-block rounded-full border border-muted-foreground/40" />
            )}
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

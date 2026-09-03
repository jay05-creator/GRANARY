/**
 * Client hook: seed demo rows into PGLite/Neon once, then hydrate Zustand
 * from the database so maps and dashboards reflect persisted state.
 * Also restores auth state from the session on page refresh.
 */
import { useEffect, useRef } from "react";
import { useGranary } from "@/shared/store";
import { authEnabled } from "@/shared/auth/client";

export function useDbHydrate() {
  const hydrateFromDb = useGranary((s) => s.hydrateFromDb);
  const login = useGranary((s) => s.login);
  const dbHydrated = useGranary((s) => s.dbHydrated);
  const isAuthenticated = useGranary((s) => s.isAuthenticated);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || dbHydrated) return;
    started.current = true;

    (async () => {
      try {
        const { seedDemoCatalog, loadCatalog } = await import(
          "@/server/modules/granary"
        );
        // Idempotent seed for empty DB (preview / first deploy)
        await seedDemoCatalog();
        const catalog = await loadCatalog();
        if (catalog.facilityCount > 0) {
          hydrateFromDb({
            facilities: catalog.facilities,
            lots: catalog.lots,
            farmerRequests: catalog.farmerRequests,
            farmersList: catalog.farmersList,
            operatorsList: catalog.operatorsList,
          });
        } else {
          hydrateFromDb({});
        }

        // Restore auth state from session on page refresh
        if (authEnabled && !isAuthenticated) {
          try {
            const { getMyProfile } = await import("@/server/modules/granary");
            const profile = await getMyProfile() as Record<string, unknown> | null;
            if (profile) {
              const role = profile.role === "operator" ? "operator" : "farmer";
              login(role, String(profile.user_id));
            }
          } catch {
            // Not signed in or session expired — that's fine
          }
        }
      } catch (err) {
        console.warn("[granary] DB hydrate failed, using seed data:", err);
        hydrateFromDb({});
      }
    })();
  }, [dbHydrated, hydrateFromDb, isAuthenticated, login]);

  return dbHydrated;
}

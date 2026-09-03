import { HeadContent, Outlet, Scripts, createRootRoute, ErrorComponent } from "@tanstack/react-router";
import { AuthProvider } from "@/shared/auth/provider";
import { PreviewHostBridge } from "@/client/components/preview-host-bridge";
import { ThemeProvider } from "@/client/components/theme-provider";
import { LocaleProvider } from "@/client/components/locale-provider";
import { TooltipProvider } from "@/client/components/ui/tooltip";
import { Toaster } from "sonner";
import { useDbHydrate } from "@/client/use-db-hydrate";
import appCss from "@/client/styles.css?url";

const APP_NAME = "Granary";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Book cold rooms and dry yards around Nashik. Watch your harvest on a live map.",
      },
      { name: "theme-color", content: "#1B5E3B" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
  errorComponent: RootErrorBoundary,
});

function DbHydrateGate({ children }: { children: React.ReactNode }) {
  useDbHydrate();
  return <>{children}</>;
}

function RootErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6">
          <div className="max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl">
            <div className="mx-auto size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <svg className="size-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium tracking-tight text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <p className="mt-3 text-xs text-destructive/70 font-mono break-all">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <ThemeProvider>
            <LocaleProvider>
              <TooltipProvider delayDuration={200}>
              <DbHydrateGate>
                <Outlet />
              </DbHydrateGate>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className:
                    "font-sans !bg-card !text-card-foreground !border-border !shadow-[var(--shadow-border)]",
                }}
              />
              </TooltipProvider>
            </LocaleProvider>
          </ThemeProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

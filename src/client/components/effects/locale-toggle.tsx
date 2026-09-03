import { Globe } from "lucide-react";
import { useLocale } from "@/client/components/locale-provider";
import { localeLabels, type Locale } from "@/client/i18n";
import { cn } from "@/client/cn";
import { useState, useRef, useEffect } from "react";

const LOCALE_OPTIONS: Locale[] = ["en", "hi", "mr", "bn", "ta", "te", "kn"];

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className={cn(
          "grid size-11 place-items-center rounded-full border border-border bg-card text-foreground transition-[background-color,box-shadow] duration-150 hover:shadow-[var(--shadow-border)]",
          className,
        )}
      >
        <Globe className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          {LOCALE_OPTIONS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                l === locale
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="flex-1 text-left">{localeLabels[l]}</span>
              {l === locale && (
                <span className="size-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

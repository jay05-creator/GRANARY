import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/client/components/theme-provider";
import { cn } from "@/client/cn";

/** Skiper UI-inspired theme toggle with cross-fading icons. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light" : "Switch to dark"}
      className={cn(
        "relative grid size-11 place-items-center rounded-full border border-border bg-card text-foreground transition-[background-color,box-shadow] duration-150 hover:shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          dark ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
        )}
      >
        <Sun className="size-4" />
      </span>
      <span
        className={cn(
          "absolute transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          dark ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
        )}
      >
        <Moon className="size-4" />
      </span>
    </button>
  );
}

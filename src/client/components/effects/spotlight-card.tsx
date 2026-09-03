import { useRef } from "react";
import { cn } from "@/client/cn";

/** React Bits SpotlightCard: cursor-following highlight on a surface. */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-card text-card-foreground shadow-[var(--shadow-border)]",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)",
      }}
    >
      {children}
    </div>
  );
}

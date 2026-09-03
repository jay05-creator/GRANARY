import { cn } from "@/client/cn";

export function GranaryMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden
    >
      <rect x="3" y="10" width="7" height="18" rx="1.5" fill="currentColor" />
      <rect x="12.5" y="4" width="7" height="24" rx="1.5" fill="currentColor" />
      <rect x="22" y="12" width="7" height="16" rx="1.5" fill="currentColor" />
      <rect x="5" y="14" width="3" height="3" rx="0.5" fill="var(--background)" />
      <rect x="14.5" y="8" width="3" height="3" rx="0.5" fill="var(--background)" />
      <rect x="24" y="16" width="3" height="3" rx="0.5" fill="var(--background)" />
    </svg>
  );
}

export function GranaryWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <GranaryMark className="size-7 text-primary" />
      <span className="text-[17px] font-medium tracking-tight">Granary</span>
    </span>
  );
}

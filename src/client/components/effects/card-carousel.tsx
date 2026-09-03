import { useRef } from "react";
import { cn } from "@/client/cn";

/** Skiper UI-inspired card carousel: snap-scroll with drag. */
export function CardCarousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scroll: 0 });

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;
        drag.current = { down: true, startX: e.clientX, scroll: el.scrollLeft };
        el.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current.down || !ref.current) return;
        ref.current.scrollLeft = drag.current.scroll - (e.clientX - drag.current.startX);
      }}
      onPointerUp={() => {
        drag.current.down = false;
      }}
    >
      {children}
    </div>
  );
}

export function CarouselCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "snap-start shrink-0 w-[min(78vw,320px)] overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

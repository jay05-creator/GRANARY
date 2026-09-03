import { useCallback, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** React Bits-inspired ClickSpark: short sparks from the click point. */
export function ClickSpark({
  children,
  color = "#1b5e3b",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const reduce = useReducedMotion();
  const layer = useRef<HTMLSpanElement>(null);

  const burst = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !layer.current) return;
      const host = layer.current;
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      for (let i = 0; i < 8; i++) {
        const spark = document.createElement("span");
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.3;
        const dist = 18 + Math.random() * 16;
        spark.style.cssText = `
          position:absolute;left:${x}px;top:${y}px;width:6px;height:2px;
          background:${color};border-radius:1px;pointer-events:none;
          transform:rotate(${angle}rad);opacity:1;
          transition:transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease-out;
        `;
        host.appendChild(spark);
        requestAnimationFrame(() => {
          spark.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${angle}rad)`;
          spark.style.opacity = "0";
        });
        window.setTimeout(() => spark.remove(), 460);
      }
    },
    [color, reduce],
  );

  return (
    <span className="relative inline-flex" onClick={burst}>
      <span ref={layer} className="pointer-events-none absolute inset-0 overflow-visible" />
      {children}
    </span>
  );
}

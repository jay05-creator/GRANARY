import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/client/cn";

type DeskPath = "/" | "/farmer" | "/operator";

/** Skiper UI-inspired WrapButton: pill with a sliding arrow disc. */
export function WrapButton({
  to,
  children,
  className,
  onClick,
}: {
  to?: DeskPath;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const inner = (
    <span
      className={cn(
        "group inline-flex h-12 items-center gap-2 rounded-full bg-forest pl-5 pr-1.5 text-sm font-medium text-paper transition-[background-color,transform] duration-200 ease-out hover:bg-forest/90 active:scale-[0.96]",
        className,
      )}
    >
      <span>{children}</span>
      <span className="grid size-9 place-items-center rounded-full bg-paper text-forest transition-transform duration-200 ease-out group-hover:rotate-45">
        <ArrowUpRight className="size-4" />
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}

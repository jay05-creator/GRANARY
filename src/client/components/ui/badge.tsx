import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/client/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-muted-foreground",
        empty: "bg-pin-empty/15 text-pin-empty",
        full: "bg-pin-full/15 text-pin-full",
        mine: "bg-pin-mine/18 text-pin-mine",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

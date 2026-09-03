import { GranaryWordmark } from "@/client/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <GranaryWordmark />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Storage for the Nashik belt. Cold rooms, dry yards, and packhouses you can see on a map.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Nashik district · demo network</p>
      </div>
    </footer>
  );
}

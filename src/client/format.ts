import { format, parseISO } from "date-fns";

export function tons(n: number): string {
  return `${n.toLocaleString("en-IN", { maximumFractionDigits: 1 })} t`;
}

export function rupees(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function shortDate(iso: string): string {
  try {
    return format(parseISO(iso), "d MMM");
  } catch {
    return iso;
  }
}

export function occupancyPct(used: number, cap: number): number {
  if (cap <= 0) return 0;
  return Math.min(100, Math.round((used / cap) * 100));
}

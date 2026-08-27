import { BatteryFull, Signal, Wifi } from "lucide-react";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-1 py-1 text-foreground">
      <span className="font-display text-[15px] font-semibold tracking-tight">
        8.31
      </span>
      <div className="flex items-center gap-1.5 text-foreground">
        <Signal className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        <Wifi className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        <BatteryFull className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </div>
    </div>
  );
}

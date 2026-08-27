import { Clock, Home, MoreHorizontal, QrCode } from "lucide-react";

const items = [
  { label: "Home", icon: Home, active: true },
  { label: "History", icon: Clock, active: false },
  { label: "Scan", icon: QrCode, active: false },
  { label: "More", icon: MoreHorizontal, active: false },
];

export function BottomNav() {
  return (
    <nav
      data-ocid="bottom_nav"
      className="flex items-center justify-around rounded-[28px] bg-card px-2 py-3 shadow-elevated"
      aria-label="Primary navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            data-ocid={`nav.${item.label.toLowerCase()}`}
            type="button"
            aria-current={item.active ? "page" : undefined}
            className="flex flex-col items-center gap-1 rounded-2xl px-3 py-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon
              className={
                item.active
                  ? "h-6 w-6 text-primary"
                  : "h-6 w-6 text-muted-foreground"
              }
              strokeWidth={item.active ? 2.4 : 2}
              aria-hidden="true"
            />
            <span
              className={
                item.active
                  ? "text-[11px] font-semibold text-primary"
                  : "text-[11px] font-medium text-muted-foreground"
              }
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

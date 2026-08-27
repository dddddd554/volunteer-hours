import {
  BarChart3,
  Bell,
  BookOpen,
  Clock,
  Heart,
  Home,
  type LucideIcon,
  MoreHorizontal,
  Plus,
  QrCode,
  User,
} from "lucide-react";
import { NAV_ITEMS, type View } from "../types/view";

const icons: Record<View, LucideIcon> = {
  home: Home,
  history: Clock,
  scan: QrCode,
  more: MoreHorizontal,
  "add-activity": Plus,
  logbook: BookOpen,
  statistics: BarChart3,
  activities: Heart,
  notifications: Bell,
  profile: User,
};

type BottomNavProps = {
  activeView?: View;
  onNavigate?: (view: View) => void;
};

export function BottomNav({
  activeView = "home",
  onNavigate = () => {},
}: BottomNavProps) {
  return (
    <nav
      data-ocid="bottom_nav"
      className="bottom-nav items-center justify-around rounded-[28px] bg-card px-2 py-3 shadow-elevated"
      aria-label="Primary navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = icons[item.view];
        const active = item.view === activeView;
        return (
          <button
            key={item.label}
            data-ocid={`nav.${item.label.toLowerCase()}`}
            type="button"
            onClick={() => onNavigate(item.view)}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center gap-1 rounded-2xl px-3 py-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon
              className={
                active
                  ? "h-6 w-6 text-primary"
                  : "h-6 w-6 text-muted-foreground"
              }
              strokeWidth={active ? 2.4 : 2}
              aria-hidden="true"
            />
            <span
              className={
                active
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

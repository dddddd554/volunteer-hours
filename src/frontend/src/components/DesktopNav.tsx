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

type DesktopNavProps = {
  activeView?: View;
  onNavigate?: (view: View) => void;
};

export function DesktopNav({
  activeView = "home",
  onNavigate = () => {},
}: DesktopNavProps) {
  return (
    <header
      data-ocid="desktop_nav"
      className="desktop-nav sticky top-0 z-30 border-b border-border bg-card/90 shadow-nav backdrop-blur"
    >
      <div className="app-content flex h-[var(--nav-h)] items-center justify-between">
        <button
          type="button"
          data-ocid="desktop_nav.brand"
          onClick={() => onNavigate("home")}
          className="font-display text-lg font-bold tracking-tight text-foreground"
        >
          Volunteer Hours
        </button>

        <nav
          className="flex items-center gap-1"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = icons[item.view];
            const active = item.view === activeView;
            return (
              <button
                key={item.label}
                data-ocid={`desktop_nav.${item.label.toLowerCase()}`}
                type="button"
                onClick={() => onNavigate(item.view)}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    : "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                }
              >
                <Icon
                  className="h-4 w-4"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

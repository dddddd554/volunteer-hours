import { Bell, Info, User } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import type { View } from "../types/view";

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

const menu = [
  { label: "Profile", icon: User, view: "profile" as View },
  { label: "Notifications", icon: Bell, view: "notifications" as View },
];

export function MoreScreen({ activeView, onNavigate }: Props) {
  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          More
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Settings and account options
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-4">
        <div className="overflow-hidden rounded-[24px] bg-card shadow-subtle">
          {menu.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                data-ocid={`more.item.${index + 1}`}
                type="button"
                onClick={() => onNavigate(item.view)}
                className="flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-smooth last:border-b-0 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-display text-base font-semibold text-foreground">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 rounded-[24px] bg-card p-5 shadow-subtle">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
            <Info className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              About
            </p>
            <p className="text-sm text-muted-foreground">
              Volunteer Hours v1.0 · Built with caffeine.ai
            </p>
          </div>
        </div>
      </main>
    </ScreenShell>
  );
}

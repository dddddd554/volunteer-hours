import { useActivities } from "../hooks/useQueries";
import type { View } from "../types/view";
import { ActionGrid } from "./ActionGrid";
import { BottomNav } from "./BottomNav";
import { StatusBar } from "./StatusBar";
import { StatusCard } from "./StatusCard";

type DashboardScreenProps = {
  activeView?: View;
  onNavigate?: (view: View) => void;
};

export function DashboardScreen({
  activeView = "home",
  onNavigate = () => {},
}: DashboardScreenProps) {
  const { data: activities = [] } = useActivities();
  const totalHours = activities.reduce(
    (sum, activity) => sum + Number(activity.hours),
    0,
  );

  return (
    <div data-ocid="dashboard_screen" className="app-shell pb-6 pt-3">
      <StatusBar />

      <div className="app-content flex flex-1 flex-col">
        <header className="mt-4">
          <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
            Welcome back!
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-subtle"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-primary-foreground"
                fill="none"
                aria-hidden="true"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-foreground">
                Student
              </p>
              <p className="text-sm text-muted-foreground">
                Let&apos;s make a difference!
              </p>
            </div>
          </div>
        </header>

        <main className="mt-6 flex flex-1 flex-col gap-6">
          <StatusCard totalHours={totalHours} />
          <ActionGrid onNavigate={onNavigate} />
        </main>
      </div>

      <footer className="mt-6">
        <BottomNav activeView={activeView} onNavigate={onNavigate} />
      </footer>
    </div>
  );
}

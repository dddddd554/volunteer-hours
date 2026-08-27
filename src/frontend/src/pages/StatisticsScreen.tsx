import { ScreenShell } from "../components/ScreenShell";
import type { View } from "../types/view";

const stats = [
  { label: "Total Hours", value: "24", unit: "hrs" },
  { label: "Sessions", value: "12", unit: "events" },
  { label: "This Month", value: "9", unit: "hrs" },
  { label: "Streak", value: "4", unit: "weeks" },
];

const weekly = [
  { day: "M", hours: 2 },
  { day: "T", hours: 0 },
  { day: "W", hours: 3 },
  { day: "T", hours: 1 },
  { day: "F", hours: 2 },
  { day: "S", hours: 4 },
  { day: "S", hours: 0 },
];

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function StatisticsScreen({ activeView, onNavigate }: Props) {
  const max = Math.max(...weekly.map((w) => w.hours), 1);

  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          Statistics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your impact at a glance
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-6">
        <div className="stat-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-ocid={`statistics.card.${index + 1}`}
              className="rounded-[24px] bg-card p-5 shadow-subtle"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-3xl font-bold leading-none tracking-tight text-foreground">
                {stat.value}
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  {stat.unit}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] bg-card p-5 shadow-subtle">
          <p className="font-display text-base font-semibold text-foreground">
            This week
          </p>
          <div className="mt-4 flex h-32 items-end justify-between gap-2">
            {weekly.map((w, index) => (
              <div
                key={`${w.day}-${index}`}
                data-ocid={`statistics.bar.${index + 1}`}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-primary/80"
                  style={{
                    height: `${(w.hours / max) * 100}%`,
                    minHeight: w.hours > 0 ? "8px" : "4px",
                    opacity: w.hours > 0 ? 1 : 0.25,
                  }}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {w.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </ScreenShell>
  );
}

import { ScreenShell } from "../components/ScreenShell";
import type { View } from "../types/view";

const highlights = [
  { label: "Total Hours", value: "24 hrs" },
  { label: "Sessions", value: "12" },
  { label: "Organizations", value: "6" },
];

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function ProfileScreen({ activeView, onNavigate }: Props) {
  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your volunteer identity
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-6">
        <div className="flex flex-col items-center gap-3 rounded-[28px] bg-card p-6 shadow-subtle">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-subtle"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-11 w-11 text-primary-foreground"
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
          <div className="text-center">
            <p className="font-display text-xl font-bold text-foreground">
              Student
            </p>
            <p className="text-sm text-muted-foreground">
              Making a difference since 2026
            </p>
          </div>
        </div>

        <div className="stat-grid">
          {highlights.map((item, index) => (
            <div
              key={item.label}
              data-ocid={`profile.stat.${index + 1}`}
              className="rounded-[24px] bg-card p-5 text-center shadow-subtle"
            >
              <p className="font-display text-3xl font-bold leading-none tracking-tight text-primary">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </main>
    </ScreenShell>
  );
}

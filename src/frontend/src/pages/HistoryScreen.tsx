import { ScreenShell } from "../components/ScreenShell";
import { useActivities } from "../hooks/useQueries";
import type { View } from "../types/view";

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function HistoryScreen({ activeView, onNavigate }: Props) {
  const { data: activities = [], isLoading } = useActivities();

  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your past volunteer sessions
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-4">
        {isLoading ? (
          <div
            data-ocid="history.loading_state"
            className="flex flex-col gap-4"
            aria-busy="true"
            aria-label="Loading history"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-[24px] bg-card p-4 shadow-subtle"
              >
                <div className="h-40 w-full rounded-[16px] bg-muted" />
                <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div
            data-ocid="history.empty_state"
            className="flex flex-col items-center justify-center rounded-[24px] bg-card p-8 text-center shadow-subtle"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-primary"
                fill="none"
                aria-hidden="true"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M7 15l4-4 3 3 5-6" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              No activities yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your saved volunteer sessions with photos will appear here.
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id.toString()}
              data-ocid={`history.item.${index + 1}`}
              className="overflow-hidden rounded-[24px] bg-card shadow-subtle"
            >
              <div className="photo-frame">
                <img
                  src={activity.image.getDirectURL()}
                  alt={activity.filename}
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
                <span className="ml-3 shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-primary">
                  {Number(activity.hours)} hrs
                </span>
              </div>
            </div>
          ))
        )}
      </main>
    </ScreenShell>
  );
}

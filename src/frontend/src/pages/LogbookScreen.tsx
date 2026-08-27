import { BookOpen } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import { useActivities } from "../hooks/useQueries";
import type { View } from "../types/view";

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function LogbookScreen({ activeView, onNavigate }: Props) {
  const { data: activities = [], isLoading } = useActivities();
  const totalHours = activities.reduce(
    (sum, activity) => sum + Number(activity.hours),
    0,
  );

  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          My Logbook
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All your recorded volunteer hours
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between rounded-[24px] bg-primary p-5 text-primary-foreground shadow-elevated">
          <div>
            <p className="text-sm font-medium text-primary-foreground/85">
              Total logged
            </p>
            <p className="font-display text-4xl font-bold leading-none tracking-tight">
              {totalHours} hrs
            </p>
          </div>
          <BookOpen
            className="h-10 w-10 text-primary-foreground/90"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        {isLoading ? (
          <div
            data-ocid="logbook.loading_state"
            className="flex flex-col gap-4"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[76px] animate-pulse rounded-[24px] bg-muted"
              />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div
            data-ocid="logbook.empty_state"
            className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-card p-8 text-center shadow-subtle"
          >
            <BookOpen
              className="h-10 w-10 text-muted-foreground"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <p className="font-display text-lg font-bold text-foreground">
              No activities yet
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Log your first volunteer session to start building your logbook.
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id.toString()}
              data-ocid={`logbook.item.${index + 1}`}
              className="flex items-center justify-between rounded-[24px] bg-card p-4 shadow-subtle"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-foreground">
                  {activity.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {activity.date} · {Number(activity.hours)} hrs
                </p>
              </div>
              <span className="ml-3 shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-success">
                Logged
              </span>
            </div>
          ))
        )}
      </main>
    </ScreenShell>
  );
}

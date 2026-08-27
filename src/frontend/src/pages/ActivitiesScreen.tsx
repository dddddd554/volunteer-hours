import { Heart } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import type { View } from "../types/view";

const activities = [
  {
    title: "Community Garden Cleanup",
    org: "Green City Initiative",
    date: "Sat, Aug 30",
    spots: "4 spots left",
  },
  {
    title: "Food Bank Sorting",
    org: "Hope Pantry",
    date: "Sun, Aug 31",
    spots: "12 spots left",
  },
  {
    title: "River Trail Restoration",
    org: "Parks & Rec",
    date: "Sat, Sep 6",
    spots: "2 spots left",
  },
  {
    title: "Library Reading Buddy",
    org: "City Library",
    date: "Tue, Sep 9",
    spots: "8 spots left",
  },
];

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function ActivitiesScreen({ activeView, onNavigate }: Props) {
  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          Activities
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upcoming volunteer opportunities
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-4">
        {activities.map((activity, index) => (
          <div
            key={activity.title}
            data-ocid={`activities.item.${index + 1}`}
            className="rounded-[24px] bg-card p-5 shadow-subtle"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-foreground">
                  {activity.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {activity.org}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Heart className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {activity.date}
              </span>
              <span className="text-sm text-muted-foreground">
                {activity.spots}
              </span>
            </div>
          </div>
        ))}
      </main>
    </ScreenShell>
  );
}

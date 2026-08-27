import { Bell } from "lucide-react";
import { ScreenShell } from "../components/ScreenShell";
import type { View } from "../types/view";

const notifications = [
  {
    title: "New activity available",
    body: "River Trail Restoration is now open for sign-up.",
    time: "2h ago",
  },
  {
    title: "Hours approved",
    body: "Your 3 hours for Community Garden Cleanup were approved.",
    time: "1d ago",
  },
  {
    title: "Reminder",
    body: "You have a session at Hope Pantry this Sunday.",
    time: "2d ago",
  },
  {
    title: "Welcome!",
    body: "Thanks for joining Volunteer Hours. Let's make a difference!",
    time: "1w ago",
  },
];

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function NotificationsScreen({ activeView, onNavigate }: Props) {
  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Updates about your volunteer journey
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col gap-4">
        {notifications.map((notification, index) => (
          <div
            key={notification.title}
            data-ocid={`notifications.item.${index + 1}`}
            className="flex items-start gap-3 rounded-[24px] bg-card p-4 shadow-subtle"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Bell className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-display text-base font-semibold text-foreground">
                  {notification.title}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {notification.body}
              </p>
            </div>
          </div>
        ))}
      </main>
    </ScreenShell>
  );
}

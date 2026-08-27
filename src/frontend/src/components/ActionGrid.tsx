import {
  BarChart3,
  Bell,
  BookOpen,
  Heart,
  type LucideIcon,
  Plus,
  User,
} from "lucide-react";

type Action = {
  label: string;
  icon: LucideIcon;
};

const actions: Action[] = [
  { label: "Add Activity", icon: Plus },
  { label: "My Logbook", icon: BookOpen },
  { label: "Statistics", icon: BarChart3 },
  { label: "Activities", icon: Heart },
  { label: "Notifications", icon: Bell },
  { label: "Profile", icon: User },
];

export function ActionGrid() {
  return (
    <section
      data-ocid="action_grid"
      className="grid grid-cols-3 gap-3"
      aria-label="Quick actions"
    >
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            data-ocid={`action.item.${index + 1}`}
            type="button"
            className="flex flex-col items-center gap-3 rounded-[24px] bg-card p-4 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="text-center text-[13px] font-medium leading-tight text-foreground">
              {action.label}
            </span>
          </button>
        );
      })}
    </section>
  );
}

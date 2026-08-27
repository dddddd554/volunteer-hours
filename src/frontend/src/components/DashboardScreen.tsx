import { ActionGrid } from "./ActionGrid";
import { BottomNav } from "./BottomNav";
import { StatusBar } from "./StatusBar";
import { StatusCard } from "./StatusCard";

export function DashboardScreen() {
  return (
    <div
      data-ocid="dashboard_screen"
      className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-5 pb-6 pt-3"
    >
      <StatusBar />

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
        <StatusCard />
        <ActionGrid />
      </main>

      <footer className="mt-6">
        <BottomNav />
      </footer>
    </div>
  );
}

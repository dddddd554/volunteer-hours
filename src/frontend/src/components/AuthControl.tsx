import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthControl() {
  const { isAuthenticated, isInitializing, isLoggingIn, login, clear } =
    useInternetIdentity();

  if (isInitializing) {
    return (
      <div
        data-ocid="auth.loading_state"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/40"
          aria-hidden="true"
        />
        Checking session…
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-foreground sm:flex">
          <User className="h-4 w-4 text-primary" aria-hidden="true" />
          Signed in
        </span>
        <button
          type="button"
          data-ocid="auth.sign_out_button"
          onClick={clear}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-smooth hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      data-ocid="auth.sign_in_button"
      onClick={() => login()}
      disabled={isLoggingIn}
      className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogIn className="h-4 w-4" aria-hidden="true" />
      {isLoggingIn ? "Signing in…" : "Sign in"}
    </button>
  );
}

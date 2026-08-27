import "@testing-library/jest-dom/vitest";
import { ExternalBlob } from "@caffeineai/object-storage";
import {
  cleanup,
  configure,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Activity } from "../backend";
import { DashboardScreen } from "../components/DashboardScreen";
afterEach(() => {
  cleanup();
});

// The generated components expose `data-ocid` hooks rather than semantic
// test ids; teach Testing Library to treat them as test ids.
configure({ testIdAttribute: "data-ocid" });

// The dashboard derives its total hours from the saved activities returned by
// useActivities. Control that seam so the total is asserted against data, not
// a hardcoded value.
const mockActivities = vi.hoisted(() => ({
  data: [] as Activity[],
}));

vi.mock("../hooks/useQueries", () => ({
  useActivities: () => ({ data: mockActivities.data }),
}));

function makeActivity(overrides: Partial<Activity>): Activity {
  return {
    id: 1n,
    title: "Food Bank Sorting",
    hours: 2n,
    date: "Aug 27",
    createdAt: 1n,
    filename: "evidence.jpg",
    image: ExternalBlob.fromBytes(
      new Uint8Array(0),
      "image/jpeg",
      "evidence.jpg",
    ),
    ...overrides,
  };
}

describe("DashboardScreen (mobile phone-style layout)", () => {
  it("renders the welcome header and profile", () => {
    render(<DashboardScreen />);
    expect(
      screen.getByRole("heading", { name: "Welcome back!" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Let's make a difference!")).toBeInTheDocument();
  });

  it("renders the fake phone status bar", () => {
    render(<DashboardScreen />);
    expect(screen.getByText("8.31")).toBeInTheDocument();
  });

  it("renders the status card with total hours derived from saved activities", () => {
    mockActivities.data = [
      makeActivity({ hours: 2n }),
      makeActivity({ id: 2n, hours: 3n }),
    ];
    render(<DashboardScreen />);
    const card = screen.getByTestId("status_card");
    expect(within(card).getByText("Total Hours")).toBeInTheDocument();
    expect(within(card).getByText("5")).toBeInTheDocument();
    expect(within(card).getByText("hrs")).toBeInTheDocument();
  });

  it("shows zero total hours when no activities are saved", () => {
    mockActivities.data = [];
    render(<DashboardScreen />);
    const card = screen.getByTestId("status_card");
    expect(within(card).getByText("0")).toBeInTheDocument();
  });

  it("renders the action grid with all six quick actions", () => {
    render(<DashboardScreen />);
    const grid = screen.getByTestId("action_grid");
    for (const label of [
      "Add Activity",
      "My Logbook",
      "Statistics",
      "Activities",
      "Notifications",
      "Profile",
    ]) {
      expect(
        within(grid).getByRole("button", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("renders the bottom nav with Home, History, Scan and More", () => {
    render(<DashboardScreen />);
    const nav = screen.getByTestId("bottom_nav");
    expect(nav).toHaveAttribute("aria-label", "Primary navigation");
    for (const label of ["Home", "History", "Scan", "More"]) {
      expect(
        within(nav).getByRole("button", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("marks Home as the active navigation destination", () => {
    render(<DashboardScreen />);
    const nav = screen.getByTestId("bottom_nav");
    const home = within(nav).getByRole("button", { name: "Home" });
    expect(home).toHaveAttribute("aria-current", "page");
    for (const label of ["History", "Scan", "More"]) {
      const button = within(nav).getByRole("button", { name: label });
      expect(button).not.toHaveAttribute("aria-current");
    }
  });

  it("applies the app-shell layout class to the dashboard root", () => {
    render(<DashboardScreen />);
    const screen = document.querySelector('[data-ocid="dashboard_screen"]');
    expect(screen).not.toBeNull();
    expect(screen!.className).toContain("app-shell");
  });
});

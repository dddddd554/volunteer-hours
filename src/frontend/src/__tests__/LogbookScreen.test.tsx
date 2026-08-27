import "@testing-library/jest-dom/vitest";
import { ExternalBlob } from "@caffeineai/object-storage";
import { cleanup, configure, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Activity } from "../backend";
import { LogbookScreen } from "../pages/LogbookScreen";

afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: "data-ocid" });

// The logbook renders the user's saved activities from useActivities. Control
// that seam so rendering is asserted against backend-shaped data.
const mockActivities = vi.hoisted(() => ({
  data: [] as Activity[],
  isLoading: false,
}));

vi.mock("../hooks/useQueries", () => ({
  useActivities: () => ({
    data: mockActivities.data,
    isLoading: mockActivities.isLoading,
  }),
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

describe("LogbookScreen (user's saved activities)", () => {
  it("shows the empty state when no activities are saved", () => {
    mockActivities.data = [];
    render(<LogbookScreen activeView="logbook" onNavigate={() => {}} />);
    expect(
      screen.getByRole("heading", { name: "My Logbook" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No activities yet")).toBeInTheDocument();
  });

  it("renders the saved activities from the backend", () => {
    mockActivities.data = [
      makeActivity({ title: "Food Bank Sorting", hours: 2n, date: "Aug 27" }),
      makeActivity({
        id: 2n,
        title: "Park Cleanup",
        hours: 4n,
        date: "Aug 28",
      }),
    ];
    render(<LogbookScreen activeView="logbook" onNavigate={() => {}} />);

    expect(screen.getByText("Food Bank Sorting")).toBeInTheDocument();
    expect(screen.getByText("Park Cleanup")).toBeInTheDocument();
    expect(screen.getByText("Aug 27 · 2 hrs")).toBeInTheDocument();
    expect(screen.getByText("Aug 28 · 4 hrs")).toBeInTheDocument();
  });

  it("sums the saved activity hours into the total logged", () => {
    mockActivities.data = [
      makeActivity({ hours: 2n }),
      makeActivity({ id: 2n, hours: 4n }),
    ];
    render(<LogbookScreen activeView="logbook" onNavigate={() => {}} />);

    expect(screen.getByText("6 hrs")).toBeInTheDocument();
  });
});

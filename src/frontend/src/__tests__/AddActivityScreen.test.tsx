import "@testing-library/jest-dom/vitest";
import { cleanup, configure, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AddActivityInput } from "../hooks/useQueries";
import { AddActivityScreen } from "../pages/AddActivityScreen";

afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: "data-ocid" });

// The form submits through useAddActivity. Control that seam so we can assert
// the submit calls addActivity and flips to the success state.
const mockAddActivity = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  isSuccess: false,
  reset: vi.fn(),
}));

vi.mock("../hooks/useQueries", () => ({
  useAddActivity: () => mockAddActivity,
}));

describe("AddActivityScreen (activity form)", () => {
  it("renders the activity form with name and hours inputs", () => {
    render(
      <AddActivityScreen
        activeView="add-activity"
        onNavigate={() => {}}
        pendingPhoto={null}
        onConsumePhoto={() => {}}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Add Activity" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Activity name")).toBeInTheDocument();
    expect(screen.getByLabelText("Hours")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Log activity" }),
    ).toBeInTheDocument();
  });

  it("does not log an activity when the name is empty", async () => {
    const user = userEvent.setup();
    render(
      <AddActivityScreen
        activeView="add-activity"
        onNavigate={() => {}}
        pendingPhoto={null}
        onConsumePhoto={() => {}}
      />,
    );

    await user.type(screen.getByLabelText("Hours"), "2");
    await user.click(screen.getByRole("button", { name: "Log activity" }));

    // The form remains and no success state is shown for an invalid submit.
    expect(screen.getByTestId("add_activity.form")).toBeInTheDocument();
    expect(screen.queryByText("Activity logged!")).not.toBeInTheDocument();
    expect(mockAddActivity.mutate).not.toHaveBeenCalled();
  });

  it("does not log an activity when the hours are empty", async () => {
    const user = userEvent.setup();
    render(
      <AddActivityScreen
        activeView="add-activity"
        onNavigate={() => {}}
        pendingPhoto={null}
        onConsumePhoto={() => {}}
      />,
    );

    await user.type(
      screen.getByLabelText("Activity name"),
      "Food Bank Sorting",
    );
    await user.click(screen.getByRole("button", { name: "Log activity" }));

    expect(screen.getByTestId("add_activity.form")).toBeInTheDocument();
    expect(screen.queryByText("Activity logged!")).not.toBeInTheDocument();
    expect(mockAddActivity.mutate).not.toHaveBeenCalled();
  });

  it("calls addActivity with the entered title and hours on submit", async () => {
    const user = userEvent.setup();
    render(
      <AddActivityScreen
        activeView="add-activity"
        onNavigate={() => {}}
        pendingPhoto={null}
        onConsumePhoto={() => {}}
      />,
    );

    await user.type(
      screen.getByLabelText("Activity name"),
      "Food Bank Sorting",
    );
    await user.type(screen.getByLabelText("Hours"), "3");
    await user.click(screen.getByRole("button", { name: "Log activity" }));

    expect(mockAddActivity.mutate).toHaveBeenCalledTimes(1);
    const input = mockAddActivity.mutate.mock.calls[0][0] as AddActivityInput;
    expect(input.title).toBe("Food Bank Sorting");
    expect(input.hours).toBe(3n);
    expect(input.date).toBeTruthy();
  });

  it("shows the success state after the activity is logged", async () => {
    mockAddActivity.isSuccess = true;
    render(
      <AddActivityScreen
        activeView="add-activity"
        onNavigate={() => {}}
        pendingPhoto={null}
        onConsumePhoto={() => {}}
      />,
    );

    expect(screen.getByText("Activity logged!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add another" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("add_activity.form")).not.toBeInTheDocument();
  });
});

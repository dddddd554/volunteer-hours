import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  configure,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import type { Activity } from "../backend";

afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: "data-ocid" });

// App renders screens that read and write activities through the useQueries
// hooks. Mock them so navigation can be exercised without a backend actor.
vi.mock("../hooks/useQueries", () => ({
  useActivities: () => ({ data: [] as Activity[], isLoading: false }),
  useAddActivity: () => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    reset: vi.fn(),
  }),
}));

// App renders Layout, which renders AuthControl reading the Internet Identity
// session from @caffeineai/core-infrastructure. That package ships extensionless
// ESM imports that Node's ESM resolver rejects, so it is stubbed wholesale with
// a default signed-out session.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useInternetIdentity: () => ({
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    login: vi.fn(),
    clear: vi.fn(),
  }),
}));

// jsdom defaults to a desktop-width viewport; force mobile so the bottom nav
// is the sole primary navigation and the phone-style layout is exercised.
function setMobileViewport() {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 375,
  });
}

describe("App navigation wiring", () => {
  it("loads the dashboard on the default route with Home active", () => {
    setMobileViewport();
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Welcome back!" }),
    ).toBeInTheDocument();
    const nav = screen.getByTestId("bottom_nav");
    expect(within(nav).getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("navigates to distinct screens via the bottom nav with updated active state", async () => {
    setMobileViewport();
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      within(screen.getByTestId("bottom_nav")).getByRole("button", {
        name: "History",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "History" }),
    ).toBeInTheDocument();
    let nav = screen.getByTestId("bottom_nav");
    expect(
      within(nav).getByRole("button", { name: "History" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(nav).getByRole("button", { name: "Home" }),
    ).not.toHaveAttribute("aria-current");

    await user.click(
      within(screen.getByTestId("bottom_nav")).getByRole("button", {
        name: "Scan",
      }),
    );
    expect(screen.getByRole("heading", { name: "Scan" })).toBeInTheDocument();
    nav = screen.getByTestId("bottom_nav");
    expect(within(nav).getByRole("button", { name: "Scan" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(
      within(screen.getByTestId("bottom_nav")).getByRole("button", {
        name: "More",
      }),
    );
    expect(screen.getByRole("heading", { name: "More" })).toBeInTheDocument();
    nav = screen.getByTestId("bottom_nav");
    expect(within(nav).getByRole("button", { name: "More" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("navigates to a quick-action screen and back to home without dead ends", async () => {
    setMobileViewport();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add Activity" }));
    expect(
      screen.getByRole("heading", { name: "Add Activity" }),
    ).toBeInTheDocument();

    // The bottom nav remains reachable from a sub-screen.
    await user.click(
      within(screen.getByTestId("bottom_nav")).getByRole("button", {
        name: "Home",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Welcome back!" }),
    ).toBeInTheDocument();
    const nav = screen.getByTestId("bottom_nav");
    expect(within(nav).getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("navigates via the desktop nav on a desktop-width viewport", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });
    const user = userEvent.setup();
    render(<App />);

    const desktopNav = screen.getByTestId("desktop_nav");
    await user.click(
      within(desktopNav).getByRole("button", { name: "History" }),
    );
    expect(
      screen.getByRole("heading", { name: "History" }),
    ).toBeInTheDocument();
    expect(
      within(desktopNav).getByRole("button", { name: "History" }),
    ).toHaveAttribute("aria-current", "page");

    await user.click(within(desktopNav).getByRole("button", { name: "Scan" }));
    expect(screen.getByRole("heading", { name: "Scan" })).toBeInTheDocument();
    expect(
      within(desktopNav).getByRole("button", { name: "Scan" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("navigates from the More screen into its sub-destinations", async () => {
    setMobileViewport();
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      within(screen.getByTestId("bottom_nav")).getByRole("button", {
        name: "More",
      }),
    );

    await user.click(screen.getByRole("button", { name: "Profile" }));
    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();

    await user.click(
      within(screen.getByTestId("bottom_nav")).getByRole("button", {
        name: "More",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
  });
});

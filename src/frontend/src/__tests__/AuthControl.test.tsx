import "@testing-library/jest-dom/vitest";
import { cleanup, configure, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthControl } from "../components/AuthControl";

afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: "data-ocid" });

// AuthControl reads the Internet Identity session from
// @caffeineai/core-infrastructure. That package ships extensionless ESM imports
// that Node's ESM resolver rejects, so it is stubbed wholesale and the session
// state is driven per-test through the mutable mock below.
const mockIdentity = vi.hoisted(() => ({
  isAuthenticated: false,
  isInitializing: false,
  isLoggingIn: false,
  login: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("@caffeineai/core-infrastructure", () => ({
  useInternetIdentity: () => mockIdentity,
}));

describe("AuthControl (Internet Identity sign-in control)", () => {
  it("shows a Sign in button for a signed-out user", () => {
    render(<AuthControl />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.queryByTestId("auth.sign_out_button"),
    ).not.toBeInTheDocument();
  });

  it("calls login when the Sign in button is tapped", async () => {
    const user = userEvent.setup();
    render(<AuthControl />);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(mockIdentity.login).toHaveBeenCalledTimes(1);
  });

  it("shows a Signed in badge and Sign out button for an authenticated user", () => {
    mockIdentity.isAuthenticated = true;
    render(<AuthControl />);
    expect(screen.getByText("Signed in")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("auth.sign_in_button")).not.toBeInTheDocument();
  });

  it("calls clear when the Sign out button is tapped", async () => {
    mockIdentity.isAuthenticated = true;
    const user = userEvent.setup();
    render(<AuthControl />);
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(mockIdentity.clear).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state while the session is initializing", () => {
    mockIdentity.isAuthenticated = false;
    mockIdentity.isInitializing = true;
    render(<AuthControl />);
    expect(screen.getByTestId("auth.loading_state")).toBeInTheDocument();
    expect(screen.queryByTestId("auth.sign_in_button")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("auth.sign_out_button"),
    ).not.toBeInTheDocument();
  });
});

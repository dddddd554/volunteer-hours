import "@testing-library/jest-dom/vitest";
import { cleanup, configure, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Layout } from "../components/Layout";

// Layout renders AuthControl, which reads the Internet Identity session from
// @caffeineai/core-infrastructure. That package ships extensionless ESM imports
// that Node's ESM resolver rejects, so it is stubbed wholesale (as the other
// suites do) with a default signed-out session.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useInternetIdentity: () => ({
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    login: vi.fn(),
    clear: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: "data-ocid" });

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe("Layout (responsive navigation)", () => {
  it("shows the desktop nav on a desktop-width viewport", () => {
    setViewportWidth(1280);
    render(
      <Layout>
        <div>content</div>
      </Layout>,
    );
    expect(screen.getByTestId("desktop_nav")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("hides the desktop nav on a mobile-width viewport", () => {
    setViewportWidth(375);
    render(
      <Layout>
        <div>content</div>
      </Layout>,
    );
    expect(screen.queryByTestId("desktop_nav")).not.toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

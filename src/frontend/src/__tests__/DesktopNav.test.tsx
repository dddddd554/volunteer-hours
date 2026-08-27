import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  configure,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DesktopNav } from "../components/DesktopNav";

afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: "data-ocid" });

describe("DesktopNav (tablet/desktop navigation)", () => {
  it("exposes the same destinations as the mobile bottom nav", () => {
    render(<DesktopNav />);
    const nav = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    for (const label of ["Home", "History", "Scan", "More"]) {
      expect(
        within(nav).getByRole("button", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("marks Home as the active destination", () => {
    render(<DesktopNav />);
    const nav = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    const home = within(nav).getByRole("button", { name: "Home" });
    expect(home).toHaveAttribute("aria-current", "page");
    for (const label of ["History", "Scan", "More"]) {
      const button = within(nav).getByRole("button", { name: label });
      expect(button).not.toHaveAttribute("aria-current");
    }
  });

  it("renders the brand", () => {
    render(<DesktopNav />);
    expect(
      screen.getByRole("button", { name: "Volunteer Hours" }),
    ).toBeInTheDocument();
  });
});

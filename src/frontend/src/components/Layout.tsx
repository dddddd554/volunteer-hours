import type { ReactNode } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import type { View } from "../types/view";
import { AuthControl } from "./AuthControl";
import { DesktopNav } from "./DesktopNav";

type LayoutProps = {
  activeView?: View;
  onNavigate?: (view: View) => void;
  children: ReactNode;
};

export function Layout({
  activeView = "home",
  onNavigate = () => {},
  children,
}: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="texture-beige min-h-screen bg-background">
      <div className="border-b border-border bg-card/80 backdrop-blur">
        <div className="app-content flex h-12 items-center justify-end">
          <AuthControl />
        </div>
      </div>

      {!isMobile && (
        <DesktopNav activeView={activeView} onNavigate={onNavigate} />
      )}

      <div className="app-shell">
        <div className="app-content flex flex-1 flex-col py-4 md:py-8 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

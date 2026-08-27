import type { ReactNode } from "react";
import type { View } from "../types/view";
import { BottomNav } from "./BottomNav";
import { StatusBar } from "./StatusBar";

type ScreenShellProps = {
  activeView: View;
  onNavigate: (view: View) => void;
  children: ReactNode;
};

export function ScreenShell({
  activeView,
  onNavigate,
  children,
}: ScreenShellProps) {
  return (
    <div data-ocid="screen_shell" className="app-shell pb-6 pt-3">
      <StatusBar />

      <div className="app-content flex flex-1 flex-col">{children}</div>

      <footer className="mt-6">
        <BottomNav activeView={activeView} onNavigate={onNavigate} />
      </footer>
    </div>
  );
}

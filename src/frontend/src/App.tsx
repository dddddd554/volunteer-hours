import { useState } from "react";
import { DashboardScreen } from "./components/DashboardScreen";
import { Layout } from "./components/Layout";
import type { UploadedImage } from "./hooks/useImageUpload";
import { ActivitiesScreen } from "./pages/ActivitiesScreen";
import { AddActivityScreen } from "./pages/AddActivityScreen";
import { HistoryScreen } from "./pages/HistoryScreen";
import { LogbookScreen } from "./pages/LogbookScreen";
import { MoreScreen } from "./pages/MoreScreen";
import { NotificationsScreen } from "./pages/NotificationsScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { ScanScreen } from "./pages/ScanScreen";
import { StatisticsScreen } from "./pages/StatisticsScreen";
import type { View } from "./types/view";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [pendingPhoto, setPendingPhoto] = useState<UploadedImage | null>(null);
  const navigate = (next: View) => setView(next);

  const screen = (() => {
    switch (view) {
      case "history":
        return <HistoryScreen activeView={view} onNavigate={navigate} />;
      case "scan":
        return (
          <ScanScreen
            activeView={view}
            onNavigate={navigate}
            onPhotoReady={setPendingPhoto}
          />
        );
      case "more":
        return <MoreScreen activeView={view} onNavigate={navigate} />;
      case "add-activity":
        return (
          <AddActivityScreen
            activeView={view}
            onNavigate={navigate}
            pendingPhoto={pendingPhoto}
            onConsumePhoto={() => setPendingPhoto(null)}
          />
        );
      case "logbook":
        return <LogbookScreen activeView={view} onNavigate={navigate} />;
      case "statistics":
        return <StatisticsScreen activeView={view} onNavigate={navigate} />;
      case "activities":
        return <ActivitiesScreen activeView={view} onNavigate={navigate} />;
      case "notifications":
        return <NotificationsScreen activeView={view} onNavigate={navigate} />;
      case "profile":
        return <ProfileScreen activeView={view} onNavigate={navigate} />;
      default:
        return <DashboardScreen activeView={view} onNavigate={navigate} />;
    }
  })();

  return (
    <Layout activeView={view} onNavigate={navigate}>
      {screen}
    </Layout>
  );
}

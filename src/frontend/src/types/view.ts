export type View =
  | "home"
  | "history"
  | "scan"
  | "more"
  | "add-activity"
  | "logbook"
  | "statistics"
  | "activities"
  | "notifications"
  | "profile";

export const NAV_ITEMS: { label: string; view: View }[] = [
  { label: "Home", view: "home" },
  { label: "History", view: "history" },
  { label: "Scan", view: "scan" },
  { label: "More", view: "more" },
];

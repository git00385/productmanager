import type { NavItem } from "@/types";
import { FEATURES } from "./features";

/** Sidebar navigation items. Filtered by feature flags at runtime. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Roadmap",
    href: "/roadmap",
    icon: "Map",
    disabled: !FEATURES.roadmap,
  },
  {
    label: "Spec Writer",
    href: "/spec-writer",
    icon: "FileText",
    disabled: !FEATURES.specWriter,
  },
  {
    label: "Metrics",
    href: "/metrics",
    icon: "BarChart2",
    disabled: !FEATURES.metrics,
  },
  {
    label: "Research",
    href: "/research",
    icon: "FlaskConical",
    disabled: !FEATURES.research,
  },
  {
    label: "Sprint Planner",
    href: "/sprint-planner",
    icon: "Calendar",
    disabled: !FEATURES.sprintPlanner,
  },
  {
    label: "Stakeholder Updates",
    href: "/stakeholder-updates",
    icon: "Megaphone",
    disabled: !FEATURES.stakeholderUpdates,
  },
] as const;

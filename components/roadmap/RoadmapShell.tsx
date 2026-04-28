"use client";

import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { BacklogInput } from "./BacklogInput";
import { BacklogTable } from "./BacklogTable";
import { BusinessContextForm } from "./BusinessContextForm";
import { KanbanView } from "./KanbanView";
import { TimelineView } from "./TimelineView";
import { RoadmapSummaryBar } from "./RoadmapSummaryBar";
import { RoadmapActionBar } from "./RoadmapActionBar";
import { InsightsPanel } from "./InsightsPanel";

type Tab = "prioritize" | "roadmap" | "insights";

const TABS: { id: Tab; label: string }[] = [
  { id: "prioritize", label: "Prioritize" },
  { id: "roadmap", label: "Roadmap" },
  { id: "insights", label: "Insights" },
];

export function RoadmapShell() {
  const { activeTab, setActiveTab, roadmapView, setRoadmapView, scoredItems } =
    useRoadmapStore();

  const hasResults = scoredItems.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
              {tab.id !== "prioritize" && !hasResults && (
                <span className="ml-1.5 text-[10px] rounded-full bg-secondary px-1.5 py-0.5 text-muted-foreground">
                  Score first
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action bar — shown on roadmap tab */}
        {activeTab === "roadmap" && hasResults && (
          <RoadmapActionBar />
        )}

        {/* View toggle — shown on roadmap tab */}
        {activeTab === "roadmap" && hasResults && (
          <div className="flex rounded-md border border-border overflow-hidden ml-2">
            {(["kanban", "timeline"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setRoadmapView(view)}
                className={`px-3 py-1.5 text-xs capitalize transition-colors ${
                  roadmapView === view
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-secondary"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "prioritize" && <PrioritizeTab />}
        {activeTab === "roadmap" && <RoadmapTab />}
        {activeTab === "insights" && (
          <div className="p-4 sm:p-6">
            <InsightsPanel />
          </div>
        )}
      </div>
    </div>
  );
}

function PrioritizeTab() {
  return (
    <div className="flex flex-col lg:flex-row gap-0 flex-1 min-h-0 h-full">
      {/* Left: backlog */}
      <div className="flex-1 lg:flex-[3] border-b lg:border-b-0 lg:border-r border-border overflow-y-auto p-4 sm:p-6 space-y-5">
        <BacklogInput />
        <BacklogTable />
      </div>

      {/* Right: context form */}
      <div className="lg:flex-[2] overflow-y-auto p-4 sm:p-6">
        <BusinessContextForm />
      </div>
    </div>
  );
}

function RoadmapTab() {
  const { roadmapView, scoredItems } = useRoadmapStore();

  if (scoredItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        Score your backlog first to see the visual roadmap.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <RoadmapSummaryBar />
      {roadmapView === "kanban" ? <KanbanView /> : <TimelineView />}
    </div>
  );
}

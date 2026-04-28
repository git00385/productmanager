"use client";

import { useRoadmapStore, totalEffortPoints, fitCount } from "@/lib/stores/roadmapStore";
import { EFFORT_POINTS } from "@/types/roadmap";

export function RoadmapSummaryBar() {
  const { scoredItems } = useRoadmapStore();

  const total = scoredItems.length;
  const mustHave = scoredItems.filter((i) => i.tier === "Must Have").length;
  const fits = fitCount(scoredItems);
  const effortTotal = totalEffortPoints(scoredItems);

  const effortMax =
    scoredItems.reduce(
      (sum, i) => sum + (i.effort ? EFFORT_POINTS[i.effort] ?? 0 : 0),
      0
    );

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-secondary/20 px-4 py-3 text-sm">
      <Stat label="Total items" value={total} />
      <Divider />
      <Stat label="Fits capacity" value={`${fits} / ${total}`} highlight={fits < total} />
      <Divider />
      <Stat label="Must Have" value={mustHave} />
      <Divider />
      <Stat label="Total effort" value={`${effortTotal} pts`} />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className={`text-xs font-semibold ${highlight ? "text-yellow-400" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <span className="hidden sm:block text-border">|</span>;
}

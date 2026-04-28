"use client";

import { useState } from "react";
import { Download, Save, Share2, RefreshCw, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { useRoadmapScoring } from "@/hooks/useRoadmapScoring";

const PLACEHOLDER_WORKSPACE = "00000000-0000-0000-0000-000000000000";

function exportToCSV(items: ReturnType<typeof useRoadmapStore.getState>["scoredItems"]) {
  const headers = [
    "Rank",
    "Name",
    "Score",
    "Tier",
    "Effort",
    "Category",
    "Quarter",
    "Fits Capacity",
    "Reasoning",
    "Risks",
  ];

  const rows = items.map((i) => [
    i.rank,
    `"${i.name.replace(/"/g, '""')}"`,
    i.score,
    `"${i.tier}"`,
    i.effort ?? "",
    i.categoryTag ?? "",
    i.suggestedQuarter,
    i.fitForCapacity ? "Yes" : "No",
    `"${(i.reasoning ?? "").replace(/"/g, '""')}"`,
    `"${(i.risks ?? "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roadmap.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function RoadmapActionBar() {
  const { scoredItems, items, summary, strategicWarnings, capacityAlert, topRecommendation } =
    useRoadmapStore();
  const { score, isScoring, canScore } = useRoadmapScoring();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasResults = scoredItems.length > 0;

  async function handleSave() {
    if (!hasResults || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/roadmap/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: PLACEHOLDER_WORKSPACE,
          title: `Roadmap — ${new Date().toLocaleDateString()}`,
          items,
          scoredResult: { rankedItems: scoredItems, summary, strategicWarnings, capacityAlert, topRecommendation },
          metadata: {},
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Regenerate */}
      <Button
        variant="outline"
        size="sm"
        onClick={score}
        disabled={!canScore}
        title="Re-score with current inputs"
      >
        {isScoring ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5" />
        )}
        <span className="ml-1.5 hidden sm:inline">Regenerate</span>
      </Button>

      {/* Export CSV */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(scoredItems)}
        disabled={!hasResults}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="ml-1.5 hidden sm:inline">Export CSV</span>
      </Button>

      {/* Save */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={!hasResults || saving}
      >
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : saved ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        <span className="ml-1.5 hidden sm:inline">{saved ? "Saved!" : "Save"}</span>
      </Button>

      {/* Share (placeholder) */}
      <div className="group relative">
        <Button variant="outline" size="sm" disabled>
          <Share2 className="h-3.5 w-3.5" />
          <span className="ml-1.5 hidden sm:inline">Share</span>
        </Button>
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
          Coming soon
        </span>
      </div>
    </div>
  );
}

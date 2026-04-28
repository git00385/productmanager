"use client";

import { useState } from "react";
import { Target, AlertTriangle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { RoadmapChat } from "./RoadmapChat";
import type { ScoredItem } from "@/types/roadmap";

function AccordionItem({ item }: { item: ScoredItem }) {
  const [open, setOpen] = useState(false);

  const scoreColor =
    item.score >= 80
      ? "text-emerald-400"
      : item.score >= 50
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-sm font-bold tabular-nums w-6 shrink-0 ${scoreColor}`}>
            {item.score}
          </span>
          <span className="text-sm font-medium truncate">{item.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            #{item.rank} · {item.tier} · {item.suggestedQuarter}
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-border bg-secondary/10">
          {/* Framework scores table */}
          {Object.keys(item.frameworkScores).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Framework Scores
              </p>
              <div className="rounded-md border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-border">
                    {Object.entries(item.frameworkScores).map(([k, v]) => (
                      <tr key={k}>
                        <td className="px-3 py-1.5 text-muted-foreground">{k}</td>
                        <td className="px-3 py-1.5 font-medium text-right">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reasoning */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Reasoning
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.reasoning}</p>
          </div>

          {/* Risks */}
          {item.risks && (
            <div className="flex gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/5 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{item.risks}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InsightsPanel() {
  const { summary, topRecommendation, strategicWarnings, capacityAlert, scoredItems } =
    useRoadmapStore();

  const hasResults = scoredItems.length > 0;

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <Target className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Score your backlog first to see AI insights.
        </p>
      </div>
    );
  }

  const sorted = [...scoredItems].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Capacity Alert */}
      {capacityAlert && (
        <div className="flex gap-3 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{capacityAlert}</p>
        </div>
      )}

      {/* Executive Summary */}
      {summary && (
        <div className="rounded-lg border border-border bg-secondary/20 px-5 py-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Executive Summary
          </p>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Top Recommendation */}
      {topRecommendation && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 flex gap-3">
          <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              Top Recommendation
            </p>
            <p className="text-sm leading-relaxed">{topRecommendation}</p>
          </div>
        </div>
      )}

      {/* Strategic Warnings */}
      {strategicWarnings.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Strategic Warnings
          </p>
          {strategicWarnings.map((w, i) => (
            <div
              key={i}
              className="flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-2.5"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* Per-item accordion */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Item Reasoning ({sorted.length})
        </p>
        <div className="space-y-2">
          {sorted.map((item) => (
            <AccordionItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Dig Deeper Chat */}
      <RoadmapChat />
    </div>
  );
}

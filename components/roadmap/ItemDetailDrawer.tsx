"use client";

import { X, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS } from "@/types/roadmap";
import type { ScoredItem } from "@/types/roadmap";

interface ItemDetailDrawerProps {
  item: ScoredItem | null;
  onClose: () => void;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : score >= 50
        ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
        : "bg-red-500/15 text-red-400 border-red-500/30";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-bold ${color}`}>
      {score}
    </span>
  );
}

export function ItemDetailDrawer({ item, onClose }: ItemDetailDrawerProps) {
  if (!item) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base leading-tight truncate">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <ScoreBadge score={item.score} />
              <span className="text-xs text-muted-foreground">Rank #{item.rank}</span>
              {item.categoryTag && (
                <span className={`text-xs rounded-full border px-2 py-0.5 ${CATEGORY_COLORS[item.categoryTag]}`}>
                  {item.categoryTag}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Tier + Quarter */}
          <div className="flex gap-3">
            <InfoPill label="Tier" value={item.tier} />
            <InfoPill label="Quarter" value={item.suggestedQuarter} />
            <InfoPill label="Effort" value={item.effort ?? "—"} />
            <InfoPill
              label="Capacity"
              value={item.fitForCapacity ? "Fits ⚡" : "Over ⚠️"}
              className={item.fitForCapacity ? "text-emerald-400" : "text-yellow-400"}
            />
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          )}

          {/* Reasoning */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Reasoning</h3>
            <p className="text-sm leading-relaxed">{item.reasoning}</p>
          </div>

          {/* Framework scores */}
          {Object.keys(item.frameworkScores).length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Framework Scores</h3>
              <div className="rounded-md border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {Object.entries(item.frameworkScores).map(([key, val]) => (
                      <tr key={key}>
                        <td className="px-3 py-1.5 text-xs text-muted-foreground">{key}</td>
                        <td className="px-3 py-1.5 text-xs font-medium text-right">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Risks */}
          {item.risks && (
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/5 px-3 py-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-yellow-400 mb-0.5">Risk</p>
                  <p className="text-xs text-muted-foreground">{item.risks}</p>
                </div>
              </div>
            </div>
          )}

          {/* Capacity */}
          {!item.fitForCapacity && (
            <div className="rounded-md border border-orange-500/30 bg-orange-500/5 px-3 py-2.5 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <p className="text-xs text-orange-400">This item exceeds current capacity estimates.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-md border border-border bg-secondary/30 px-2.5 py-1.5 min-w-[52px]">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${className ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}

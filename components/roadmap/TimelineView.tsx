"use client";

import { useState } from "react";
import { useRoadmapStore, getQuarterItems } from "@/lib/stores/roadmapStore";
import { CATEGORY_COLORS } from "@/types/roadmap";
import { ItemDetailDrawer } from "./ItemDetailDrawer";
import type { ScoredItem, SuggestedQuarter } from "@/types/roadmap";

const QUARTERS: SuggestedQuarter[] = ["Q1", "Q2", "Q3", "Q4", "Backlog"];

const QUARTER_LABELS: Record<SuggestedQuarter, string> = {
  Q1: "Q1",
  Q2: "Q2",
  Q3: "Q3",
  Q4: "Q4",
  Backlog: "Backlog",
};

function ItemPill({
  item,
  onClick,
}: {
  item: ScoredItem;
  onClick: () => void;
}) {
  const categoryClass = item.categoryTag
    ? CATEGORY_COLORS[item.categoryTag]
    : "bg-secondary text-secondary-foreground border-border";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all hover:shadow-md hover:scale-105 ${categoryClass} ${
        !item.fitForCapacity ? "border-dashed opacity-80" : ""
      }`}
      title={item.reasoning}
    >
      <span className="truncate max-w-[140px]">{item.name}</span>
      {item.effort && (
        <span className="opacity-60 text-[10px]">·{item.effort}</span>
      )}
    </button>
  );
}

export function TimelineView() {
  const { scoredItems } = useRoadmapStore();
  const [selectedItem, setSelectedItem] = useState<ScoredItem | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[600px] space-y-1">
          {QUARTERS.map((quarter) => {
            const items = getQuarterItems(scoredItems, quarter);
            return (
              <div key={quarter} className="flex gap-4">
                {/* Row label */}
                <div className="w-20 shrink-0 flex items-start pt-3">
                  <span
                    className={`text-xs font-semibold ${
                      quarter === "Backlog"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {QUARTER_LABELS[quarter]}
                  </span>
                </div>

                {/* Items row */}
                <div
                  className={`flex-1 min-h-[56px] rounded-lg border border-border px-3 py-2.5 flex flex-wrap gap-2 items-center ${
                    quarter === "Backlog"
                      ? "bg-secondary/10 border-dashed"
                      : "bg-secondary/20"
                  }`}
                >
                  {items.length === 0 ? (
                    <span className="text-xs text-muted-foreground/50">
                      No items
                    </span>
                  ) : (
                    items.map((item) => (
                      <ItemPill
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Category:</span>
        {(
          [
            "Growth",
            "Retention",
            "Infrastructure",
            "Debt",
            "Compliance",
            "Delight",
          ] as const
        ).map((cat) => (
          <span
            key={cat}
            className={`rounded-full border px-2 py-0.5 text-xs ${CATEGORY_COLORS[cat]}`}
          >
            {cat}
          </span>
        ))}
        <span className="text-xs text-muted-foreground ml-2">
          Dashed border = exceeds capacity
        </span>
      </div>

      <ItemDetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { CATEGORY_COLORS } from "@/types/roadmap";
import type { BacklogItem, CategoryTag, EffortSize } from "@/types/roadmap";

const EFFORT_OPTIONS: EffortSize[] = ["XS", "S", "M", "L", "XL"];
const CATEGORY_OPTIONS: CategoryTag[] = [
  "Growth",
  "Retention",
  "Infrastructure",
  "Debt",
  "Compliance",
  "Delight",
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : score >= 50
        ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
        : "bg-red-500/15 text-red-400 border-red-500/30";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${color}`}>
      {score}
    </span>
  );
}

function DescriptionCell({ item }: { item: BacklogItem }) {
  const [expanded, setExpanded] = useState(false);
  if (!item.description) return <span className="text-muted-foreground text-xs">—</span>;

  const truncated = item.description.length > 60;
  return (
    <button
      className="text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setExpanded((v) => !v)}
    >
      {expanded || !truncated
        ? item.description
        : item.description.slice(0, 60) + "…"}
      {truncated && (
        <span className="ml-1 inline-flex items-center text-primary">
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
      )}
    </button>
  );
}

export function BacklogTable() {
  const { items, scoredItems, removeItem, updateItem, addItem } = useRoadmapStore();

  const scoredMap = new Map(scoredItems.map((s) => [s.id, s.score]));

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        Your backlog is empty. Paste items above or add them one by one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-secondary/30">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Item</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs w-48 hidden md:table-cell">Description</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs w-24">Effort</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs w-36">Category</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs w-20">Score</th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground text-xs w-20">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
              {/* Name — inline edit */}
              <td className="px-3 py-2">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  className="h-7 text-sm border-transparent bg-transparent focus-visible:border-ring focus-visible:bg-background px-1"
                />
              </td>
              {/* Description */}
              <td className="px-3 py-2 hidden md:table-cell">
                <DescriptionCell item={item} />
              </td>
              {/* Effort */}
              <td className="px-3 py-2">
                <select
                  value={item.effort ?? ""}
                  onChange={(e) =>
                    updateItem(item.id, {
                      effort: (e.target.value as EffortSize) || undefined,
                    })
                  }
                  className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-xs focus:border-ring focus:bg-background focus:outline-none"
                >
                  <option value="">—</option>
                  {EFFORT_OPTIONS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </td>
              {/* Category */}
              <td className="px-3 py-2">
                <select
                  value={item.categoryTag ?? ""}
                  onChange={(e) =>
                    updateItem(item.id, {
                      categoryTag: (e.target.value as CategoryTag) || undefined,
                    })
                  }
                  className={`w-full rounded border border-transparent px-1 py-0.5 text-xs focus:border-ring focus:outline-none ${
                    item.categoryTag
                      ? CATEGORY_COLORS[item.categoryTag]
                      : "bg-transparent text-muted-foreground"
                  }`}
                >
                  <option value="">—</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </td>
              {/* Score */}
              <td className="px-3 py-2">
                {scoredMap.has(item.id) ? (
                  <ScoreBadge score={scoredMap.get(item.id)!} />
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
              {/* Actions */}
              <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      addItem({ ...item, id: nanoid(), name: item.name + " (copy)" })
                    }
                    title="Duplicate"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

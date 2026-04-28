"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Loader2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { useBulkParse } from "@/hooks/useBulkParse";
import type { EffortSize } from "@/types/roadmap";

const EFFORT_OPTIONS: EffortSize[] = ["XS", "S", "M", "L", "XL"];

export function BacklogInput() {
  const { addItem, setItems, items } = useRoadmapStore();
  const { parse, status: parseStatus } = useBulkParse();

  const [bulkText, setBulkText] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualEffort, setManualEffort] = useState<EffortSize | "">("");

  async function handleParse() {
    if (!bulkText.trim()) return;
    const parsed = await parse(bulkText);
    if (parsed.length > 0) {
      setItems([...items, ...parsed]);
      setBulkText("");
    }
  }

  function handleManualAdd() {
    if (!manualName.trim()) return;
    addItem({
      id: nanoid(),
      name: manualName.trim(),
      description: manualDesc.trim() || undefined,
      effort: manualEffort || undefined,
    });
    setManualName("");
    setManualDesc("");
    setManualEffort("");
  }

  return (
    <div className="space-y-4">
      {/* Bulk paste */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5" />
          Paste Backlog
        </Label>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={"Paste your backlog items, one per line. E.g.:\n- Dark mode support\n- SSO login\n- Mobile app\n- Reporting dashboard"}
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          rows={5}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleParse}
          disabled={!bulkText.trim() || parseStatus === "parsing"}
        >
          {parseStatus === "parsing" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              Parsing…
            </>
          ) : (
            "Parse Items"
          )}
        </Button>
      </div>

      <div className="relative flex items-center gap-2">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or add manually</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Manual add */}
      <div className="space-y-2">
        <Input
          placeholder="Item name"
          value={manualName}
          onChange={(e) => setManualName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
        />
        <Input
          placeholder="Description (optional)"
          value={manualDesc}
          onChange={(e) => setManualDesc(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            value={manualEffort}
            onChange={(e) => setManualEffort(e.target.value as EffortSize | "")}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Effort (optional)</option>
            {EFFORT_OPTIONS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <Button
            type="button"
            size="sm"
            onClick={handleManualAdd}
            disabled={!manualName.trim()}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}

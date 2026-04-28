"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { Zap, AlertTriangle } from "lucide-react";
import { useRoadmapStore, getTierItems } from "@/lib/stores/roadmapStore";
import { CATEGORY_COLORS, TIER_COLORS } from "@/types/roadmap";
import { ItemDetailDrawer } from "./ItemDetailDrawer";
import type { ItemTier, ScoredItem } from "@/types/roadmap";

const TIERS: ItemTier[] = ["Must Have", "Should Have", "Could Have", "Won't Have"];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500/20 text-emerald-400"
      : score >= 50
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400";
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

function ItemCard({
  item,
  onClick,
  isDragging = false,
}: {
  item: ScoredItem;
  onClick: () => void;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border bg-card p-3 cursor-grab active:cursor-grabbing transition-shadow select-none ${
        isDragging ? "opacity-50" : "hover:shadow-md"
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <button
          className="text-xs font-medium text-left leading-tight hover:text-primary transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClick}
        >
          {item.name}
        </button>
        <ScoreBadge score={item.score} />
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {item.effort && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {item.effort}
          </span>
        )}
        {item.categoryTag && (
          <span className={`rounded-full border px-2 py-0.5 text-xs ${CATEGORY_COLORS[item.categoryTag]}`}>
            {item.categoryTag}
          </span>
        )}
        {item.fitForCapacity ? (
          <span className="ml-auto" aria-label="Fits capacity">
            <Zap className="h-3 w-3 text-emerald-400" />
          </span>
        ) : (
          <span className="ml-auto" aria-label="Exceeds capacity">
            <AlertTriangle className="h-3 w-3 text-yellow-400" />
          </span>
        )}
      </div>
    </div>
  );
}

function TierColumn({
  tier,
  items,
  onItemClick,
  activeId,
}: {
  tier: ItemTier;
  items: ScoredItem[];
  onItemClick: (item: ScoredItem) => void;
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: tier });

  return (
    <div className="flex flex-col min-w-[220px] flex-1">
      <div className={`rounded-t-lg border-t border-x px-3 py-2 ${TIER_COLORS[tier]}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">{tier}</span>
          <span className="text-xs text-muted-foreground">{items.length}</span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-b-lg border border-border p-2 space-y-2 transition-colors ${
          isOver ? "bg-primary/5 border-primary/30" : "bg-secondary/10"
        }`}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
            isDragging={activeId === item.id}
          />
        ))}
        {items.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-muted-foreground">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanView() {
  const { scoredItems, moveItemToTier } = useRoadmapStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScoredItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeItem = activeId ? scoredItems.find((i) => i.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const tier = over.id as ItemTier;
    if (TIERS.includes(tier)) {
      moveItemToTier(String(active.id), tier);
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {TIERS.map((tier) => (
              <TierColumn
                key={tier}
                tier={tier}
                items={getTierItems(scoredItems, tier)}
                onItemClick={setSelectedItem}
                activeId={activeId}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="rounded-md border bg-card p-3 shadow-xl opacity-95 w-48">
              <p className="text-xs font-medium">{activeItem.name}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ItemDetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}

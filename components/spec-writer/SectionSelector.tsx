"use client";

import { ALL_SECTIONS, type SpecSection } from "@/types/spec-writer";
import { cn } from "@/lib/utils";

interface SectionSelectorProps {
  selected: SpecSection[];
  onChange: (sections: SpecSection[]) => void;
  disabled?: boolean;
}

/** Multi-select checkbox grid for choosing which PRD sections to include. */
export function SectionSelector({ selected, onChange, disabled }: SectionSelectorProps) {
  function toggle(section: SpecSection) {
    if (selected.includes(section)) {
      onChange(selected.filter((s) => s !== section));
    } else {
      onChange([...selected, section]);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-1.5">
      {ALL_SECTIONS.map((section) => {
        const checked = selected.includes(section);
        return (
          <label
            key={section}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer select-none transition-colors",
              checked
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-secondary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(section)}
              disabled={disabled}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            {section}
          </label>
        );
      })}
    </div>
  );
}

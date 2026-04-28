"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { SpecInputForm } from "@/components/spec-writer/SpecInputForm";
import { SpecOutput } from "@/components/spec-writer/SpecOutput";
import { useSpecGeneration } from "@/hooks/useSpecGeneration";
import type { SpecInput, SpecMetadata } from "@/types/spec-writer";

/**
 * Smart Spec Writer — split-pane layout.
 * Left pane: input form. Right pane: streamed PRD output.
 */
export default function SpecWriterPage() {
  const { content, status, generate, stop, reset } = useSpecGeneration();
  const [isSaved, setIsSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [lastInput, setLastInput] = useState<SpecInput | null>(null);

  const isStreaming = status === "streaming";

  const handleGenerate = useCallback(
    async (input: SpecInput) => {
      setIsSaved(false);
      setSavedAt(null);
      setLastInput(input);
      await generate(input);
    },
    [generate]
  );

  const handleRegenerate = useCallback(() => {
    if (lastInput) {
      setIsSaved(false);
      setSavedAt(null);
      generate(lastInput);
    }
  }, [lastInput, generate]);

  const handleSave = useCallback(
    async (title: string) => {
      if (!content || !lastInput) return;

      const metadata: SpecMetadata = {
        scope: lastInput.scope,
        tone: lastInput.tone,
        sections: lastInput.sections,
        featureIdea: lastInput.featureIdea,
        productContext: lastInput.productContext,
        targetUsers: lastInput.targetUsers,
        generatedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/spec-writer/specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Use a placeholder workspaceId until workspace switcher is wired up
          workspaceId: "00000000-0000-0000-0000-000000000000",
          title,
          content,
          metadata,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        setSavedAt(new Date());
      }
    },
    [content, lastInput]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Spec Writer" />

      {/* History link */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-border shrink-0 print:hidden">
        <Link
          href="/spec-writer/history"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <History className="h-3.5 w-3.5" />
          Spec History
        </Link>
      </div>

      {/* Split pane */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Left pane — Input */}
        <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 border-b md:border-b-0 md:border-r border-border overflow-y-auto md:overflow-hidden flex flex-col print:hidden">
          <SpecInputForm
            onGenerate={handleGenerate}
            onStop={stop}
            isStreaming={isStreaming}
          />
        </div>

        {/* Right pane — Output */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          <SpecOutput
            content={content}
            isStreaming={isStreaming}
            onSave={handleSave}
            onRegenerate={handleRegenerate}
            isSaved={isSaved}
            savedAt={savedAt}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

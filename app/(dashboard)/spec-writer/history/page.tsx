"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { SpecHistoryTable } from "@/components/spec-writer/SpecHistoryTable";
import { useSpecHistory } from "@/hooks/useSpecHistory";
import { QueryProvider } from "@/components/shared/QueryProvider";

const PLACEHOLDER_WORKSPACE_ID = "00000000-0000-0000-0000-000000000000";

function HistoryContent() {
  const { specs, isLoading, deleteSpec, duplicateSpec, isDeletingId, isDuplicatingId } =
    useSpecHistory(PLACEHOLDER_WORKSPACE_ID);

  return (
    <SpecHistoryTable
      specs={specs}
      isLoading={isLoading}
      onDelete={deleteSpec}
      onDuplicate={duplicateSpec}
      isDeletingId={isDeletingId}
      isDuplicatingId={isDuplicatingId}
    />
  );
}

/** History page — lists all saved specs for the current workspace. */
export default function SpecHistoryPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Spec History" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center gap-4">
            <Link
              href="/spec-writer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Spec Writer
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-bold">Spec History</h1>
            <p className="text-muted-foreground text-sm mt-1">
              All saved specifications for this workspace.
            </p>
          </div>

          <QueryProvider>
            <HistoryContent />
          </QueryProvider>
        </div>
      </div>
    </div>
  );
}

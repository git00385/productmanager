"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Copy, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { SpecDocument } from "@/types/spec-writer";

interface SpecHistoryTableProps {
  specs: SpecDocument[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDeletingId: string | null;
  isDuplicatingId: string | null;
}

/** Table of saved specs with search, open, duplicate, and delete actions. */
export function SpecHistoryTable({
  specs,
  isLoading,
  onDelete,
  onDuplicate,
  isDeletingId,
  isDuplicatingId,
}: SpecHistoryTableProps) {
  const [search, setSearch] = useState("");

  const filtered = specs.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search specs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            {search ? "No specs match your search." : "No specs saved yet."}
          </p>
          {!search && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              Generate a spec and hit Save to see it here.
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Scope</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Modified</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((spec) => (
                <tr key={spec.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                    {spec.title}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {spec.input.scope}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {formatDate(spec.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {formatDate(spec.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" asChild title="Open spec">
                        <Link href={`/spec-writer?id=${spec.id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Duplicate"
                        disabled={isDuplicatingId === spec.id}
                        onClick={() => onDuplicate(spec.id)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Delete"
                        disabled={isDeletingId === spec.id}
                        onClick={() => onDelete(spec.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

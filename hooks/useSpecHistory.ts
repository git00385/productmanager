"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SpecDocument } from "@/types/spec-writer";

const QUERY_KEY = (workspaceId: string) => ["specs", workspaceId];

async function fetchSpecs(workspaceId: string): Promise<SpecDocument[]> {
  const res = await fetch(`/api/spec-writer/specs?workspaceId=${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch specs");
  const data = (await res.json()) as SpecDocument[];
  return data.map((s) => ({
    ...s,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt),
  }));
}

async function deleteSpecApi(id: string): Promise<void> {
  const res = await fetch(`/api/spec-writer/specs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete spec");
}

async function duplicateSpecApi(id: string): Promise<SpecDocument> {
  const res = await fetch(`/api/spec-writer/specs/${id}/duplicate`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to duplicate spec");
  const data = (await res.json()) as SpecDocument;
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

/**
 * React Query wrapper for spec history.
 * Only fetches when a workspaceId is provided.
 */
export function useSpecHistory(workspaceId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY(workspaceId ?? ""),
    queryFn: () => fetchSpecs(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSpecApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY(workspaceId ?? "") });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicateSpecApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY(workspaceId ?? "") });
    },
  });

  return {
    specs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    deleteSpec: deleteMutation.mutate,
    duplicateSpec: duplicateMutation.mutate,
    isDeletingId: deleteMutation.isPending ? deleteMutation.variables : null,
    isDuplicatingId: duplicateMutation.isPending ? duplicateMutation.variables : null,
  };
}

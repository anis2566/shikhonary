"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ── Book Queries ──────────────────────────────────────────────────────────────

export function useBooks(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  classLevel?: number;
}) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.book.list.queryOptions({
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 12,
      search: filters?.search,
      classLevel: filters?.classLevel,
    }),
    select: (data: any) => data.data,
    refetchInterval: (query) => {
      // Auto-refresh every 4s while any book has a PROCESSING job
      const items = (query.state.data as any)?.data?.items ?? [];
      const hasProcessing = items.some(
        (b: any) =>
          b.ingestionJob?.status === "PROCESSING" ||
          b.ingestionJob?.status === "PENDING",
      );
      return hasProcessing ? 4000 : false;
    },
  });
}

export function useBookById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.book.getById.queryOptions({ id }),
    select: (data: any) => data.data,
    enabled: !!id,
  });
}

export function useIngestionJob(jobId: string | undefined) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.book.getIngestionJob.queryOptions({ jobId: jobId! }),
    select: (data: any) => data.data,
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = (query.state.data as any)?.data?.status;
      return status === "PROCESSING" || status === "PENDING" ? 3000 : false;
    },
  });
}

// ── Book Mutations ───────────────────────────────────────────────────────────

export function useDeleteBook() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...trpc.book.delete.mutationOptions(),
    onError: (e) => toast.error(e.message || "Failed to delete book"),
    onSuccess: async () => {
      toast.success("Book deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: trpc.book.list.queryKey(),
      });
    },
  });
}

// ── Chapter Queries ───────────────────────────────────────────────────────────

export function useChaptersByBook(bookId: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.chapter.listByBook.queryOptions({ bookId }),
    select: (data: any) => data.data as any[],
    enabled: !!bookId,
  });
}

export function useChapterById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.chapter.getById.queryOptions({ id }),
    select: (data: any) => data.data,
    enabled: !!id,
  });
}

export function useLinkAcademicChapter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...trpc.chapter.linkAcademicChapter.mutationOptions(),
    onError: (e) => toast.error(e.message || "Failed to link chapter"),
    onSuccess: async (_, vars) => {
      toast.success("Chapter linked to academic tree");
      await queryClient.invalidateQueries({
        queryKey: trpc.chapter.listByBook.queryKey(),
      });
    },
  });
}

// ── ContentBlock Mutations ────────────────────────────────────────────────────

export function useUpdateContentBlock() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...trpc.contentBlock.update.mutationOptions(),
    onError: (e) => toast.error(e.message || "Failed to update block"),
    onSuccess: async () => {
      toast.success("Block updated");
      await queryClient.invalidateQueries({
        queryKey: trpc.chapter.getById.queryKey(),
      });
    },
  });
}

export function useDeleteContentBlock() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...trpc.contentBlock.delete.mutationOptions(),
    onError: (e) => toast.error(e.message || "Failed to delete block"),
    onSuccess: async () => {
      toast.success("Block deleted");
      await queryClient.invalidateQueries({
        queryKey: trpc.chapter.getById.queryKey(),
      });
    },
  });
}

export function useUpdateBlockMedia() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...trpc.contentBlock.updateMedia.mutationOptions(),
    onError: (e) => toast.error(e.message || "Failed to update image"),
    onSuccess: async () => {
      toast.success("Image updated");
      await queryClient.invalidateQueries({
        queryKey: trpc.chapter.getById.queryKey(),
      });
    },
  });
}

export function useDeleteBlockMedia() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...trpc.contentBlock.deleteMedia.mutationOptions(),
    onError: (e) => toast.error(e.message || "Failed to delete image"),
    onSuccess: async () => {
      toast.success("Image deleted");
      await queryClient.invalidateQueries({
        queryKey: trpc.chapter.getById.queryKey(),
      });
    },
  });
}

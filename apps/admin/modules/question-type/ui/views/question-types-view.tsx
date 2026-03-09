"use client";

import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import Link from "next/link";

import {
  useQuestionTypes,
  useActiveQuestionType,
  useBulkActiveQuestionTypes,
  useBulkDeactivateQuestionTypes,
  useBulkDeleteQuestionTypes,
  useDeactivateQuestionType,
  useDeleteQuestionType,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { Button } from "@workspace/ui/components/button";

import { QuestionTypeList } from "../components/question-type-list";

export const QuestionTypesView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { openDeleteModal } = useDeleteModal();

  useQuestionTypes();
  const { mutateAsync: bulkActiveQuestionTypes, isPending: isBulkActivating } =
    useBulkActiveQuestionTypes();
  const {
    mutateAsync: bulkDeactivateQuestionTypes,
    isPending: isBulkDeactivating,
  } = useBulkDeactivateQuestionTypes();
  const { mutateAsync: bulkDeleteQuestionTypes, isPending: isBulkDeleting } =
    useBulkDeleteQuestionTypes();
  const { mutateAsync: activeQuestionType, isPending: isActivating } =
    useActiveQuestionType();
  const { mutateAsync: deactivateQuestionType, isPending: isDeactivating } =
    useDeactivateQuestionType();
  const { mutate: deleteQuestionType, isPending: isDeleting } =
    useDeleteQuestionType();

  const onBulkActivate = async () => {
    await bulkActiveQuestionTypes({ ids: selectedIds }).then(() =>
      setSelectedIds([]),
    );
  };

  const onBulkDeactivate = async () => {
    await bulkDeactivateQuestionTypes({ ids: selectedIds }).then(() =>
      setSelectedIds([]),
    );
  };

  const onBulkDelete = async () => {
    await bulkDeleteQuestionTypes({ ids: selectedIds }).then(() =>
      setSelectedIds([]),
    );
  };

  const onActive = async (id: string) => {
    await activeQuestionType({ id }).then(() => setSelectedIds([]));
  };

  const onDeactivate = async (id: string) => {
    await deactivateQuestionType({ id }).then(() => setSelectedIds([]));
  };

  const isLoading =
    isBulkActivating ||
    isBulkDeactivating ||
    isBulkDeleting ||
    isActivating ||
    isDeactivating ||
    isDeleting;

  const handleDeleteType = (typeId: string, typeName: string) => {
    openDeleteModal({
      entityId: typeId,
      entityType: "questionType",
      entityName: typeName,
      onConfirm: (id) => {
        deleteQuestionType({ id });
      },
    });
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-soft">
            <HelpCircle className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Question Types
            </h1>
            <p className="text-muted-foreground font-medium">
              Manage different categories of questions
            </p>
          </div>
        </div>

        <Button asChild className="rounded-xl font-bold shadow-glow h-12 px-6">
          <Link href="/question-types/new">
            <Plus className="size-4 mr-2 stroke-[3]" />
            Add New Type
          </Link>
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted/30 border border-border/50 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-bold text-foreground mr-4">
            {selectedIds.length} items selected
          </span>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg font-bold"
            onClick={onBulkActivate}
            disabled={isLoading}
          >
            Activate
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg font-bold"
            onClick={onBulkDeactivate}
            disabled={isLoading}
          >
            Deactivate
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-lg font-bold"
            onClick={onBulkDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-lg font-bold ml-auto"
            onClick={() => setSelectedIds([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Question Type List */}
      <QuestionTypeList
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onActive={onActive}
        onDeactivate={onDeactivate}
        isLoading={isLoading}
        handleDelete={handleDeleteType}
      />
    </div>
  );
};

"use client";

import { useState } from "react";

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

import { QuestionTypeStat } from "../components/question-type-stat";
import { Filter } from "../components/filter";
import { BulkActions } from "../components/bulk-actions";
import { QuestionTypeList } from "../components/question-type-list";
import { Pagination } from "../components/pagination";

export const QuestionTypesView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { openDeleteModal } = useDeleteModal();

  const { data: questionTypesData } = useQuestionTypes();
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
      {/* Stat Cards */}
      <QuestionTypeStat />

      <div className="flex flex-col gap-4">
        {/* Filter Section */}
        <Filter setSelectedIds={setSelectedIds} isLoading={isLoading} />

        {/* Bulk Tooltip */}
        <BulkActions
          selectedCount={selectedIds.length}
          setSelectedIds={setSelectedIds}
          onBulkActivate={onBulkActivate}
          onBulkDeactivate={onBulkDeactivate}
          onBulkDelete={onBulkDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Main List */}
      <QuestionTypeList
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onActive={onActive}
        onDeactivate={onDeactivate}
        isLoading={isLoading}
        handleDelete={handleDeleteType}
      />

      {/* Footer Navigation */}
      <Pagination totalItem={questionTypesData?.meta.total ?? 0} />
    </div>
  );
};

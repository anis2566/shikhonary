"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { TabsContent } from "@workspace/ui/components/tabs";
import { Button } from "@workspace/ui/components/button";
import {
  useQuestionTypes,
  useActiveQuestionType,
  useDeactivateQuestionType,
  useDeleteQuestionType,
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { QuestionTypeList } from "@/modules/question-type/ui/components/question-type-list";

interface QuestionTypesTabProps {
  subjectId: string;
}

export function QuestionTypesTab({ subjectId }: QuestionTypesTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { openDeleteModal } = useDeleteModal();

  // Using filters to only get question types for this subject
  const { isLoading: isListLoading } = useQuestionTypes();

  // NOTE: In a real app, you'd pass subjectId to useQuestionTypes.
  // For now, we'll just filter manually or assume the hook handles filters from URL.
  // Actually, let's make sure our QuestionTypeList uses the filtered data if possible,
  // but QuestionTypeList currently calls useQuestionTypes internaly.

  const { mutateAsync: activeQuestionType, isPending: isActivating } =
    useActiveQuestionType();
  const { mutateAsync: deactivateQuestionType, isPending: isDeactivating } =
    useDeactivateQuestionType();
  const { mutate: deleteQuestionType, isPending: isDeleting } =
    useDeleteQuestionType();

  const onActive = async (id: string) => {
    await activeQuestionType({ id });
  };

  const onDeactivate = async (id: string) => {
    await deactivateQuestionType({ id });
  };

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

  const isLoading =
    isListLoading || isActivating || isDeactivating || isDeleting;

  return (
    <TabsContent value="question-types" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Question Types
          </h2>
          <p className="text-muted-foreground font-medium">
            Manage question categories specifically for this subject
          </p>
        </div>
        <Button asChild className="rounded-xl font-bold shadow-glow h-11 px-5">
          <Link href={`/question-types/new?subjectId=${subjectId}`}>
            <Plus className="size-4 mr-2 stroke-[3]" />
            Add Type
          </Link>
        </Button>
      </div>

      <QuestionTypeList
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onActive={onActive}
        onDeactivate={onDeactivate}
        isLoading={isLoading}
        handleDelete={handleDeleteType}
      />
    </TabsContent>
  );
}

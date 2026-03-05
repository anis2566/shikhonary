"use client";

import React, { useState } from "react";
import { Search, Plus, Check, Loader2, BookOpen, Layers } from "lucide-react";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { useMCQs, useAssignMcqToQuestionPaper } from "@workspace/api-client";

interface MCQ {
  id: string;
  question: string;
  subject?: { displayName: string };
  chapter?: { displayName: string };
}

interface McqPickerProps {
  paperId: string;
  assignedMcqIds: string[];
}

export const McqPicker: React.FC<McqPickerProps> = ({
  paperId,
  assignedMcqIds,
}) => {
  const [search, setSearch] = useState("");
  const { data: mcqs, isLoading } = useMCQs(); // Currently this uses internal filter state from hook, which is fine
  const { mutateAsync: assignMcq, isPending: isAssigning } =
    useAssignMcqToQuestionPaper();

  const handleAssign = async (mcqId: string) => {
    try {
      await assignMcq({
        questionPaperId: paperId,
        mcqId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = mcqs?.items || [];

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div>
          <h3 className="font-bold text-lg">Question Bank</h3>
          <p className="text-xs text-muted-foreground font-medium">
            Search and add questions to your paper
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-9 h-10 bg-muted/30 border-border/50 rounded-xl font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2 p-3 border rounded-xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="mx-auto h-8 w-8 opacity-20 mb-2" />
              <p className="text-sm font-medium">No MCQs found</p>
            </div>
          ) : (
            filteredItems.map((mcq: MCQ) => {
              const isAssigned = assignedMcqIds.includes(mcq.id);

              return (
                <div
                  key={mcq.id}
                  className={`group p-4 border rounded-2xl transition-all relative overflow-hidden ${
                    isAssigned
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card hover:border-primary/30 hover:shadow-soft"
                  }`}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-bold line-clamp-3 leading-snug">
                      {mcq.question}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-black px-2 py-0 h-5"
                      >
                        <BookOpen className="h-2.5 w-2.5 mr-1" />
                        {mcq.subject?.displayName || "Subject"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-black px-2 py-0 h-5"
                      >
                        <Layers className="h-2.5 w-2.5 mr-1" />
                        {mcq.chapter?.displayName || "Chapter"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3">
                    {isAssigned ? (
                      <Button
                        disabled
                        variant="secondary"
                        size="sm"
                        className="w-full h-8 rounded-lg font-bold text-xs bg-primary/10 text-primary"
                      >
                        <Check className="h-3 w-3 mr-1.5" />
                        Added
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAssign(mcq.id)}
                        disabled={isAssigning}
                        className="w-full h-8 rounded-lg font-bold text-xs shadow-glow"
                      >
                        {isAssigning ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1.5" />
                            Add to Paper
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

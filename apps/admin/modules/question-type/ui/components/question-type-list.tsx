"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Edit,
  HelpCircle,
  MoreHorizontal,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

import { cn } from "@workspace/ui/lib/utils";
import { useQuestionTypes } from "@workspace/api-client";
import { QuestionTypeWithRelations } from "@workspace/api";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

const columns: Column<QuestionTypeWithRelations>[] = [
  {
    key: "displayName",
    header: "Question Type",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-foreground tracking-tight leading-none truncate max-w-[200px]">
          {item.displayName}
        </p>
        <div className="flex items-center gap-1.5">
          <code className="text-[10px] text-muted-foreground/70 bg-muted px-1 rounded uppercase tracking-tighter">
            {item.name}
          </code>
        </div>
      </div>
    ),
  },
  {
    key: "subject",
    header: "Subject",
    render: (item) => (
      <Badge
        variant="outline"
        className="bg-primary/5 text-primary border-primary/20 font-bold text-[10px] uppercase tracking-wider rounded-md"
      >
        {item.subject.displayName}
      </Badge>
    ),
  },
  {
    key: "chapter",
    header: "Chapter",
    render: (item) =>
      item.chapter ? (
        <span className="text-sm text-foreground">
          {item.chapter.displayName}
        </span>
      ) : (
        <span className="text-[10px] text-muted-foreground italic">
          Generic
        </span>
      ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (item) => <StatusBadge active={item.isActive} />,
  },
];

interface QuestionTypeListProps {
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  onActive: (id: string) => Promise<void>;
  handleDelete: (id: string, name: string) => void;
  onDeactivate: (id: string) => Promise<void>;
  isLoading: boolean;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        "text-[11px] font-bold px-2 py-0.5 rounded-full transition-all",
        active
          ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
          : "bg-muted text-muted-foreground border-transparent",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full mr-1.5 animate-pulse",
          active ? "bg-primary" : "bg-muted-foreground",
        )}
      />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export function QuestionTypeList({
  selectedIds,
  setSelectedIds,
  onActive,
  onDeactivate,
  isLoading,
  handleDelete,
}: QuestionTypeListProps) {
  const { data: questionTypesData } = useQuestionTypes();

  const allSelected =
    (questionTypesData?.items.length ?? 0) > 0 &&
    selectedIds.length === questionTypesData?.items.length;
  const someSelected =
    selectedIds.length > 0 &&
    selectedIds.length < (questionTypesData?.items.length ?? 0);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questionTypesData?.items.map((item) => item.id) ?? []);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (!questionTypesData || questionTypesData.items.length === 0) {
    return (
      <div className="bg-card/50 backdrop-blur-md rounded-3xl border border-border/50 p-12 text-center shadow-medium animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <HelpCircle className="size-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          No question types found
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          Start by adding your first question type to begin organizing your
          question bank.
        </p>
        <Button asChild className="mt-6 rounded-xl font-bold shadow-glow">
          <Link href="/question-types/new">
            <Plus className="size-4 mr-2 stroke-[3]" />
            Create First Type
          </Link>
        </Button>
      </div>
    );
  }

  const handleToggleActiveStatus = (id: string, isActive: boolean) => {
    if (isActive) {
      onDeactivate(id);
    } else {
      onActive(id);
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-medium">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              <th className="w-12 px-4 py-4 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={cn(
                    "rounded-md border-border/50 data-[state=checked]:bg-primary transition-all",
                    someSelected && "data-[state=checked]:bg-primary/60",
                  )}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-4 py-4",
                    column.hideOnMobile && "hidden md:table-cell",
                  )}
                >
                  {column.header}
                </th>
              ))}
              <th className="w-12 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-4 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {questionTypesData?.items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-muted/20 transition-colors group/row"
              >
                <td className="px-4 py-4 text-center">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                    aria-label={`Select item ${item.id}`}
                    className="rounded-md border-border/50 data-[state=checked]:bg-primary transition-all"
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-4 text-sm text-foreground",
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.render ? column.render(item) : ""}
                  </td>
                ))}
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-muted/80 text-muted-foreground"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 backdrop-blur-xl bg-background/95 border-border shadow-medium z-50 rounded-xl p-1"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer font-medium p-2 rounded-lg"
                        asChild
                      >
                        <Link href={`/question-types/edit/${item.id}`}>
                          <Edit className="h-4 w-4 mr-2 opacity-70" />
                          Edit Type
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50 mx-1" />
                      <DropdownMenuItem
                        className="cursor-pointer font-medium p-2 rounded-lg"
                        onClick={() =>
                          handleToggleActiveStatus(item.id, item.isActive)
                        }
                      >
                        {item.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-2 text-amber-500 opacity-70" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-2 text-green-500 opacity-70" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50 mx-1" />
                      <DropdownMenuItem
                        className="cursor-pointer font-medium p-2 rounded-lg text-destructive focus:bg-destructive/5 focus:text-destructive"
                        onClick={() => handleDelete(item.id, item.displayName)}
                      >
                        <Trash2 className="h-4 w-4 mr-2 opacity-70" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

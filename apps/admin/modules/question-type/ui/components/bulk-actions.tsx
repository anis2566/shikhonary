"use client";

import { CheckCircle, XCircle, Trash2, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Dispatch, SetStateAction } from "react";

interface BulkActionsProps {
  selectedCount: number;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  onBulkActivate: () => Promise<void>;
  onBulkDeactivate: () => Promise<void>;
  onBulkDelete: () => Promise<void>;
  isLoading: boolean;
}

export const BulkActions = ({
  selectedCount,
  setSelectedIds,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  isLoading,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/[0.03] backdrop-blur-md border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-glow">
      <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-xl border border-primary/20 mr-2">
        <span className="text-xs font-black text-primary uppercase tracking-wider">
          {selectedCount} Selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-xl font-bold bg-background/50 border-border/50 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20 transition-all"
          onClick={onBulkActivate}
          disabled={isLoading}
        >
          <CheckCircle className="size-3.5 mr-2" />
          Activate
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-xl font-bold bg-background/50 border-border/50 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20 transition-all"
          onClick={onBulkDeactivate}
          disabled={isLoading}
        >
          <XCircle className="size-3.5 mr-2" />
          Deactivate
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-xl font-bold bg-background/50 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
          onClick={onBulkDelete}
          disabled={isLoading}
        >
          <Trash2 className="size-3.5 mr-2" />
          Delete
        </Button>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl ml-auto text-muted-foreground hover:bg-muted/50 transition-all"
        onClick={() => setSelectedIds([])}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};

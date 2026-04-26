"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "../components/sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { DeleteEntityType, useDeleteModal } from "../hooks/use-delete";

const entityLabels: Record<
  DeleteEntityType,
  { singular: string; icon: string }
> = {
  user: { singular: "User", icon: "👤" },
  subject: { singular: "Subject", icon: "📚" },
  chapter: { singular: "Chapter", icon: "📖" },
  class: { singular: "Class", icon: "🏷️" },
  topic: { singular: "Topic", icon: "🎓" },
  subtopic: { singular: "Subtopic", icon: "🎓" },
  mcq: { singular: "MCQ", icon: "❓" },
  tenant: { singular: "Tenant", icon: "🏢" },
  subscriptionPlan: { singular: "Subscription Plan", icon: "📦" },
  subscription: { singular: "Subscription", icon: "📦" },
  academicYear: { singular: "Academic Year", icon: "📅" },
  batch: { singular: "Batch", icon: "🎓" },
  counter: { singular: "Counter", icon: "🔢" },
  admissionFee: { singular: "Admission Fee", icon: "💰" },
  monthlyFee: { singular: "Monthly Fee", icon: "💰" },
  student: { singular: "Student", icon: "📚" },
};

export function DeleteConfirmModal() {
  const {
    isOpen,
    entityId,
    entityType,
    entityName,
    onConfirmCallback,
    closeDeleteModal,
  } = useDeleteModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const entityInfo = entityType
    ? entityLabels[entityType]
    : { singular: "Item", icon: "📦" };

  const handleDelete = async () => {
    if (!entityId) return;

    setIsDeleting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (onConfirmCallback) {
        onConfirmCallback(entityId);
      }

      setTimeout(() => {
        closeDeleteModal();
      }, 300);
    } catch {
      toast.error("Failed to delete", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      closeDeleteModal();
    }
  };

  return (
    <AlertDialog open={isOpen && !!entityId} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          {/* Icon Header */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-700/10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-700/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>

          <AlertDialogTitle className="text-center text-xl">
            Delete {entityInfo.singular}?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center space-y-2">
            {entityName ? (
              <>
                <span>You are about to delete:</span>
                <span className="flex items-center justify-center gap-2 py-2 px-4 bg-muted rounded-lg">
                  <span className="text-lg">{entityInfo.icon}</span>
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {entityName}
                  </span>
                </span>
              </>
            ) : (
              <span>
                You are about to delete this {entityInfo.singular.toLowerCase()}
                .
              </span>
            )}
            <span className="text-red-700/80 text-sm font-medium pt-2">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => closeDeleteModal()}
            disabled={isDeleting}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
              "flex-1 gap-2 bg-red-700 hover:bg-red-800",
              isDeleting && "opacity-80",
            )}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete {entityInfo.singular}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

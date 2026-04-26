"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { TenantTypes } from "@workspace/db";
import Link from "next/link";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useDeleteBatch, useToggleBatchActive } from "@workspace/api-client";

interface HeaderProps {
  batch: TenantTypes.Batch;
}

export const Header = ({ batch }: HeaderProps) => {
  const router = useRouter();

  const { openDeleteModal } = useDeleteModal();

  const deleteMutation = useDeleteBatch();
  const toggleActiveMutation = useToggleBatchActive();

  const toggleActive = async (id: string) => {
    await toggleActiveMutation.mutateAsync({ id });
  };

  const handleDeleteBatch = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "batch",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <header className="z-50 glass-header flex justify-between items-center w-full px-8 h-16">
      <div className="flex items-center gap-5">
        <button
          onClick={() => router.back()}
          className="p-2.5 hover:bg-emerald-50 rounded-xl transition-all group border border-transparent hover:border-emerald-100"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-primary group-active:scale-90 transition-all" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {batch.name}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">
            Batch Details
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] active:scale-95 border border-primary/20"
        >
          <Link href={`/batches/edit/${batch.id}`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-emerald-600 transition-all cursor-pointer rounded-lg hover:bg-emerald-50 outline-none focus:outline-none focus:ring-0"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer font-medium p-2 rounded-lg"
              onClick={() => toggleActive(batch.id)}
            >
              {batch.isActive ? (
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
              onClick={() => handleDeleteBatch(batch.id, batch.name)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

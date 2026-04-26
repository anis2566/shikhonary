"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { TenantTypes } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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
        router.push("/batches");
      },
    });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="flex items-center px-4 h-16 w-full max-w-md mx-auto justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 text-emerald-700 p-2 hover:bg-slate-100 transition-colors rounded-full active:scale-90"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold tracking-tight text-slate-900 leading-none text-base">
              {batch.name}
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
              Batch Details
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100 rounded-full h-10 w-10 focus:ring-0 outline-none"
            >
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-ambient border-slate-100">
            <DropdownMenuItem asChild>
              <Link href={`/batches/edit/${batch.id}`} className="flex items-center gap-2 cursor-pointer font-medium p-3">
                <Edit size={16} className="text-emerald-600" /> Edit Batch
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer font-medium p-3"
              onClick={() => toggleActive(batch.id)}
            >
              {batch.isActive ? (
                <>
                  <ToggleLeft size={16} className="text-amber-500" /> Deactivate
                </>
              ) : (
                <>
                  <ToggleRight size={16} className="text-emerald-500" /> Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer font-medium p-3 text-rose-600 focus:bg-rose-50"
              onClick={() => handleDeleteBatch(batch.id, batch.name)}
            >
              <Trash2 size={16} /> Delete Batch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

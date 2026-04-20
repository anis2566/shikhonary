"use client";

import {
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

interface BatchWithRelations extends TenantTypes.Batch {
  academicYear: {
    name: string;
  };
  _count: {
    students: number;
  };
}

interface BatchTableProps {
  batches: BatchWithRelations[];
  isLoading: boolean;
  onToggleActive: (id: string) => Promise<void> | void;
  onDelete: (id: string, name: string) => void;
}

export function BatchTable({
  batches = [],
  isLoading,
  onToggleActive,
  onDelete,
}: BatchTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Batch Name
            </TableHead>
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Class
            </TableHead>
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Academic Year
            </TableHead>
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Capacity
            </TableHead>
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Students
            </TableHead>
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Status
            </TableHead>
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches &&
            batches.map((batch, i) => (
              <motion.tr
                key={batch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 group cursor-default"
              >
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-100">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {batch.name}
                      </div>
                      <div className="text-sm text-slate-500">Morning</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <span className="font-medium text-slate-700">
                    {batch.className}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <span className="font-medium text-slate-700">
                    {batch.academicYear.name}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {batch._count.students}/{batch.capacity}
                    </span>
                    {batch._count.students / batch.capacity > 0.9 && (
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                        title="Near Capacity"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex -space-x-2">
                    {[1, 2].map((i) => (
                      <Avatar
                        key={i}
                        className="w-8 h-8 border-2 border-white ring-1 ring-slate-100"
                      >
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${batch.id}${i}`}
                        />
                        <AvatarFallback className="text-[10px]">
                          ST
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {batch._count.students > 2 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 ring-1 ring-slate-100">
                        +{batch._count.students - 2}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <Badge
                    variant={batch.isActive ? "default" : "outline"}
                    className={cn(
                      "font-bold tracking-wide rounded-full px-3 py-1 border-none shadow-none",
                      batch.isActive
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    )}
                  >
                    {batch.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-7 text-right">
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
                        className="cursor-pointer font-medium text-slate-600"
                        asChild
                      >
                        <Link href={`/batches/${batch.id}`}>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer font-medium text-slate-600"
                        asChild
                      >
                        <Link href={`/batches/edit/${batch.id}`}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer font-medium p-2 rounded-lg"
                        onClick={() => onToggleActive(batch.id)}
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
                        onClick={() => onDelete(batch.id, batch.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}

          {isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <p className="text-slate-500 font-medium text-sm">
                    Loading batches...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && batches.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <Users className="w-8 h-8 text-slate-200" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-base">
                      No batches found
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Adjust your filters or add a new batch to get started
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

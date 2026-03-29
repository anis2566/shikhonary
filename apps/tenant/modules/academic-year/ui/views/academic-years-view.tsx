"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Layers,
  Star,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import AcademicYearTimeline from "../components/academic-year-timeline";
import AcademicYearCard from "../components/academic-year-card";
import AnimatedStatCard from "../components/animated-stat-card";

import {
  useAcademicYears,
  useAcademicYearStats,
  useDeleteAcademicYear,
  useAcademicYearFilters,
} from "@workspace/api-client";
import { type AcademicYear } from "@workspace/schema";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

type ViewMode = "table" | "cards";
type StatusFilter = "all" | "active" | "inactive" | "current";

export const AcademicYearsView: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filters, setFilters] = useAcademicYearFilters();

  const { openDeleteModal } = useDeleteModal();

  const { data: stats, isLoading: statsLoading } = useAcademicYearStats();

  const statusFilter: StatusFilter = filters.isCurrent
    ? "current"
    : filters.isActive === "ACTIVE"
      ? "active"
      : filters.isActive === "INACTIVE"
        ? "inactive"
        : "all";

  const { data: academicYearsResponse, isLoading: listLoading } =
    useAcademicYears(filters);

  const { mutate: deleteAcademicYear, isPending: isDeleting } =
    useDeleteAcademicYear();

  const isLoading = statsLoading || listLoading || isDeleting;

  const academicYears = academicYearsResponse?.items || [];

  const handleDelete = (ay: AcademicYear) => {
    openDeleteModal({
      entityId: ay.id,
      entityType: "academicYear",
      entityName: ay.name,
      onConfirm: (id) => {
        deleteAcademicYear({ id }); // toast handled in hook
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Years</h1>
          <p className="text-muted-foreground text-sm">
            Manage academic year sessions
          </p>
        </div>
        <Button
          onClick={() => router.push(`/academic-years/create`)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Year
        </Button>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="py-4 px-2">
          <AcademicYearTimeline years={academicYears} />
        </CardContent>
      </Card>

      {/* Animated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedStatCard
          icon={
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          }
          label="Total Years"
          value={stats?.totalYears || 0}
        />
        <AnimatedStatCard
          icon={
            <div className="p-2 rounded-lg bg-green-500/10">
              <Star className="w-5 h-5 text-green-500" />
            </div>
          }
          label="Current Year"
          value={0}
          displayValue={stats?.currentYear || "-"}
        />
        <AnimatedStatCard
          icon={
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          }
          label="Students (Current)"
          value={stats?.totalStudents || 0}
        />
        <AnimatedStatCard
          icon={
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Layers className="w-5 h-5 text-orange-500" />
            </div>
          }
          label="Batches (Current)"
          value={stats?.totalBatches || 0}
        />
      </div>

      {/* Toolbar: Search, Filters, View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search year..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              const val = v as StatusFilter;
              if (val === "active") {
                setFilters({ isActive: "ACTIVE", isCurrent: null, page: 1 });
              } else if (val === "inactive") {
                setFilters({ isActive: "INACTIVE", isCurrent: null, page: 1 });
              } else if (val === "current") {
                setFilters({ isCurrent: true, isActive: null, page: 1 });
              } else {
                setFilters({ isActive: null, isCurrent: null, page: 1 });
              }
            }}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="current">Current</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(v) => {
              const [sortBy, sortOrder] = v.split("-");
              setFilters({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
            }}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate-desc">Newest First</SelectItem>
              <SelectItem value="startDate-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A–Z</SelectItem>
              <SelectItem value="name-desc">Name Z–A</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle - hidden on mobile via tracking class or just responsive design */}
          <div className="max-sm:hidden flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="rounded-none h-9 px-3"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              className="rounded-none h-9 px-3"
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {(statusFilter !== "all" || filters.search) && (
        <div className="flex gap-2 flex-wrap">
          {statusFilter !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                setFilters({ isActive: null, isCurrent: null, page: 1 })
              }
            >
              {statusFilter} ✕
            </Badge>
          )}
          {filters.search && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => setFilters({ search: "", page: 1 })}
            >
              &quot;{filters.search}&quot; ✕
            </Badge>
          )}
        </div>
      )}

      {/* Content: Table or Cards. On mobile force cards. */}
      {viewMode === "table" ? (
        <div className="max-sm:hidden">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {academicYears.map((ay, i) => (
                    <motion.tr
                      key={ay.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/academic-years/${ay.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {ay.name}
                          {ay.isCurrent && (
                            <Badge className="text-[10px] gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                              <Star className="w-2.5 h-2.5" /> Current
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(ay.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        –{" "}
                        {new Date(ay.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{ay.totalStudents}</TableCell>
                      <TableCell>{ay.totalBatches}</TableCell>
                      <TableCell>
                        <Badge variant={ay.isActive ? "default" : "secondary"}>
                          {ay.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isLoading}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/academic-years/${ay.id}`);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/academic-years/edit/${ay.id}`);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(ay);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                  {academicYears.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No academic years found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {viewMode === "cards" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicYears.map((ay, i) => (
            <AcademicYearCard
              key={ay.id}
              year={ay}
              index={i}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          ))}
          {academicYears.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No academic years found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcademicYearsView;

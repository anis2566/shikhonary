import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Layers,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { TenantTypes } from "@workspace/db";
import Link from "next/link";

interface AcademicYearWithRelation extends TenantTypes.AcademicYear {
  _count: {
    students: number;
    batches: number;
  };
}

interface AcademicYearCardProps {
  year: AcademicYearWithRelation;
  index: number;
  handleDelete: (id: string) => void;
  handleToggleActiveStatus: (id: string) => void;
  isLoading?: boolean;
}

const AcademicYearCard: React.FC<AcademicYearCardProps> = ({
  year,
  index,
  handleDelete,
  handleToggleActiveStatus,
  isLoading,
}) => {
  const start = new Date(year.startDate);
  const end = new Date(year.endDate);
  const today = new Date();
  const totalDays = Math.max(
    1,
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const elapsed = Math.max(
    0,
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const progress = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalDays) * 100)),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${year.isCurrent ? "bg-primary/10" : "bg-muted"}`}
              >
                <Calendar
                  className={`w-4 h-4 ${year.isCurrent ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {year.name}
                  {year.isCurrent && (
                    <Badge className="text-[10px] gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                      <Star className="w-2.5 h-2.5" /> Current
                    </Badge>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {start.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  –{" "}
                  {end.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                <DropdownMenuItem asChild>
                  <Link href={`/academic-years/edit/${year.id}`}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer font-medium p-2 rounded-lg"
                  onClick={() => handleToggleActiveStatus(year.id)}
                >
                  {year.isActive ? (
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
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(year.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress */}
          {year.isActive && (
            <div className="mb-3">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {year._count.students}
              </span>
              <span className="text-xs text-muted-foreground">students</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {year._count.batches}
              </span>
              <span className="text-xs text-muted-foreground">batches</span>
            </div>
            <div className="ml-auto">
              <Badge
                variant={year.isActive ? "default" : "secondary"}
                className="text-[10px]"
              >
                {year.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicYearCard;

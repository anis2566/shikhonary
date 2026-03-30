"use client";

import { Calendar, Users, Layers, Star } from "lucide-react";
import AnimatedStatCard from "./animated-stat-card";

interface AcademicYearStatsProps {
  totalYears?: number;
  currentYear?: string;
  totalStudents?: number;
  totalBatches?: number;
}

export default function AcademicYearStats({
  totalYears = 0,
  currentYear,
  totalStudents = 0,
  totalBatches = 0,
}: AcademicYearStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
        }
        label="Total Years"
        value={totalYears}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-green-500/10">
            <Star className="w-5 h-5 text-green-500" />
          </div>
        }
        label="Current Year"
        value={0}
        displayValue={currentYear || "-"}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        }
        label="Students (Current)"
        value={totalStudents}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Layers className="w-5 h-5 text-orange-500" />
          </div>
        }
        label="Batches (Current)"
        value={totalBatches}
      />
    </div>
  );
}

import React from "react";
import {
  Users,
  Layers,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import AnimatedStatCard from "./animated-stat-card";

interface BatchStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    totalStudents: number;
    nearFull: number;
    capacityPercent: number;
  };
}

export default function BatchStats({ stats }: BatchStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="w-5 h-5 text-primary" />
          </div>
        }
        label="Total Batches"
        value={stats.total}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        }
        label="Active Batches"
        value={stats.active}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        }
        label="Total Students"
        value={stats.totalStudents}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-orange-500/10">
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
        }
        label="Near Capacity"
        value={stats.nearFull}
      />
      <AnimatedStatCard
        icon={
          <div className="p-2 rounded-lg bg-purple-500/10">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
        }
        label="Overall Capacity"
        value={stats.capacityPercent}
        displayValue={`${stats.capacityPercent}%`}
      />
    </div>
  );
}

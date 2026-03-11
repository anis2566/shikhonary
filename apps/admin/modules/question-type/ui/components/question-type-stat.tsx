"use client";

import { HelpCircle, CheckCircle, XCircle } from "lucide-react";

import { StatsCard } from "./stat-card";
import { useQuestionTypeStats } from "@workspace/api-client";

export const QuestionTypeStat = () => {
  const { data: statsData } = useQuestionTypeStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatsCard
        title="Total Question Types"
        value={statsData?.totalQuestionType ?? 0}
        icon={HelpCircle}
      />
      <StatsCard
        title="Active"
        value={statsData?.activeQuestionType ?? 0}
        icon={CheckCircle}
        className="[&_.text-primary]:text-green-500 [&_.bg-primary\/10]:bg-green-500/10"
      />
      <StatsCard
        title="Inactive"
        value={statsData?.inactiveQuestionType ?? 0}
        icon={XCircle}
        className="[&_.text-primary]:text-red-500 [&_.bg-primary\/10]:bg-red-500/10"
      />
    </div>
  );
};

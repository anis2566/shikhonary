"use client";

import { useState } from "react";
import { Activity, BarChart3, FileText, Layers } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

import { SubjectDetailsStat } from "../components/class-details-stat";
import { useAcademicSubjectById } from "@workspace/api-client";
import { Overview } from "../components/overview-tab";
import { ChaptersTab } from "../components/chapters";
import { StatisticsTab } from "../components/statistics-tab";
import { QuestionTypesTab } from "../components/question-types-tab";

interface SubjectViewProps {
  subjectId: string;
}

export function SubjectView({ subjectId }: SubjectViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: subject } = useAcademicSubjectById(subjectId);

  if (!subject) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Subject not found</h2>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats */}
      <SubjectDetailsStat
        subjectId={subjectId}
        subjectPosition={subject.position ?? 0}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="chapters" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Chapters</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {subject.chapters?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="question-types" className="gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Question Types</span>
          </TabsTrigger>
        </TabsList>
        <Overview
          subjectId={subjectId}
          subject={subject}
          setActiveTab={setActiveTab}
        />
        <ChaptersTab chapters={subject.chapters || []} subjectId={subjectId} />
        <StatisticsTab subjectId={subjectId} />
        <QuestionTypesTab subjectId={subjectId} />
      </Tabs>
    </div>
  );
}

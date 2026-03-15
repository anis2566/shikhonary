"use client";

import React from "react";
import { Search, Layers } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface Chapter {
    id: string;
    displayName: string;
}

interface CQFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  reference: string | undefined;
  onReferenceChange: (value: string | undefined) => void;
  chapterId: string | undefined;
  onChapterIdChange: (value: string | undefined) => void;
  chapters: Chapter[] | undefined;
  totalCount: number;
  selectedCount: number;
  filteredItemsCount: number;
  onSelectAll: () => void;
}

export const CQFilterBar = ({
  search,
  onSearchChange,
  reference,
  onReferenceChange,
  chapterId,
  onChapterIdChange,
  chapters,
  totalCount,
  selectedCount,
  filteredItemsCount,
  onSelectAll,
}: CQFilterBarProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2rem] p-4 shadow-medium flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions or board references..."
          className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl font-medium focus-visible:ring-primary/20"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select
          value={reference ?? "all"}
          onValueChange={(v) => onReferenceChange(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="h-12 w-full md:w-[150px] rounded-2xl bg-background/50 border-border/50 font-bold text-sm">
            <Search className="h-4 w-4 mr-2 text-amber-500" />
            <SelectValue placeholder="Board/Ref" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Boards</SelectItem>
            <SelectItem value="ঢা. বো.">ঢাকা বোর্ড</SelectItem>
            <SelectItem value="কু. বো.">কুমিল্লা বোর্ড</SelectItem>
            <SelectItem value="রা. বো.">রাজশাহী বোর্ড</SelectItem>
            <SelectItem value="য. বো.">যশোর বোর্ড</SelectItem>
            <SelectItem value="ব. বো.">বরিশাল বোর্ড</SelectItem>
            <SelectItem value="সি. বো. ২৪">সিলেট বোর্ড</SelectItem>
            <SelectItem value="দি. বো.">দিনাজপুর বোর্ড</SelectItem>
            <SelectItem value="ম. বো.">ময়মনসিংহ বোর্ড</SelectItem>
            <SelectItem value="চ. বো.">চট্টগ্রাম বোর্ড</SelectItem>
            <SelectItem value="মাদ. বো.">মাদ্রাসা বোর্ড</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={chapterId ?? "all"}
          onValueChange={(v) => onChapterIdChange(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="h-12 w-full md:w-[180px] rounded-2xl bg-background/50 border-border/50 font-bold text-sm">
            <Layers className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Chapters</SelectItem>
            {chapters?.map((c) => (
              <SelectItem key={c.id} value={c.id} className="font-medium">
                {c.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="h-10 px-4 rounded-xl font-black text-xs bg-primary/5 text-primary border-primary/10"
          >
            {totalCount} Total
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="h-10 rounded-xl font-bold text-xs"
          >
            {selectedCount === filteredItemsCount && filteredItemsCount > 0
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
      </div>
    </div>
  );
};

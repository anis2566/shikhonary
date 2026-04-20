"use client";

import { MoreHorizontal, Users, GraduationCap, Calendar } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

interface BatchCardProps {
  batch: any;
}

export function BatchCard({ batch }: BatchCardProps) {
  return (
    <Card className="p-5 rounded-2xl border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 line-clamp-1">{batch.name}</h3>
            <p className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-1">
              Section {batch.section} • {batch.shift}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400 -mr-2">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Class</p>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-700">{batch.className}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Year</p>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-700">{batch.academicYear}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="w-7 h-7 border-2 border-white shadow-sm">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${batch.id}${i}`} />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-600">
            {batch.studentCount}/{batch.capacity} Students
          </p>
        </div>
        <Badge 
          className={batch.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-slate-100 text-slate-600 font-bold"}
        >
          {batch.status}
        </Badge>
      </div>
    </Card>
  );
}

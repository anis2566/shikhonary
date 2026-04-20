"use client";

import React from "react";
import { CheckCircle, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useGetTimeline } from "@workspace/api-client";
import { Card } from "@workspace/ui/components/card";

export function Timeline() {
  const { data: timelineData } = useGetTimeline();

  const years = timelineData?.data || [];
  const currentId = timelineData?.currentId;

  return (
    <Card className="flex p-8 rounded-xl shadow-sm border-slate-100">
      <div className="w-full py-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-[600px] px-8 relative">
          {/* Connecting Lines Background */}
          <div className="absolute top-6 left-20 right-20 h-[3px] bg-slate-100 z-0" />

          {years.map((year, i) => {
            const isCurrent = year.id === currentId || year.isCurrent;
            const now = new Date().getTime();

            // Safely handle potentially undefined dates
            const endDateValue = year.endDate
              ? new Date(year.endDate).getTime()
              : 0;

            const isPast = endDateValue < now && !isCurrent;
            const isSelected = year.id === currentId;

            // Calculate line highlight for the segment after this node
            const nextYear = years[i + 1];
            const nextStartDateValue = nextYear?.startDate
              ? new Date(nextYear.startDate).getTime()
              : Infinity;
            const hasPastNext =
              !!nextYear &&
              (nextStartDateValue <= now ||
                nextYear.isCurrent ||
                nextYear.id === currentId);

            return (
              <React.Fragment key={year.id}>
                <div className="flex flex-col items-center relative z-10 cursor-pointer group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                    flex items-center justify-center transition-all duration-300
                    ${
                      isCurrent
                        ? "w-14 h-14 rounded-full bg-emerald-600 text-white ring-8 ring-emerald-50 border-2 border-white shadow-xl -mt-1"
                        : isPast
                          ? "w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-100 shadow-sm"
                          : "w-11 h-11 rounded-full bg-slate-50 text-slate-400 border-2 border-white shadow-sm"
                    }
                  `}
                  >
                    {isCurrent ? (
                      <Calendar className="w-6 h-6" />
                    ) : isPast ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </motion.div>

                  <div className="mt-4 text-center">
                    <span
                      className={`
                    text-sm block transition-colors
                    ${
                      isCurrent
                        ? "font-extrabold text-emerald-700"
                        : isSelected
                          ? "font-bold text-slate-900 underline decoration-emerald-500"
                          : "font-bold text-slate-500 group-hover:text-slate-700"
                    }
                  `}
                    >
                      {year.name} {isCurrent && "(Active)"}
                    </span>
                    {isCurrent && (
                      <div className="mt-1 flex items-center justify-center gap-1.5">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                          In Progress
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting Line Section */}
                {i < years.length - 1 && (
                  <div className="flex-1 px-2 pointer-events-none">
                    <div
                      className={`h-[3px] transition-all duration-500 ${hasPastNext ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-transparent"}`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

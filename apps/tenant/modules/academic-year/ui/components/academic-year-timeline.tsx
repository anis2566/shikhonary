import React from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { type AcademicYear } from "@workspace/schema";

interface AcademicYearTimelineProps {
  years: (AcademicYear & { totalStudents?: number; totalBatches?: number })[];
  currentId?: string;
}

const AcademicYearTimeline: React.FC<AcademicYearTimelineProps> = ({
  years,
  currentId,
}) => {
  const router = useRouter();
  const sorted = [...years].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max px-4">
        {sorted.map((year, i) => {
          const isSelected = year.id === currentId;
          const today = new Date();
          const start = new Date(year.startDate);
          const end = new Date(year.endDate);
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
            Math.max(0, (elapsed / totalDays) * 100),
          );

          return (
            <React.Fragment key={year.id}>
              {/* Node */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => router.push(`/academic-years/${year.id}`)}
              >
                {/* Dot */}
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 group-hover:scale-110 ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : year.isCurrent
                        ? "bg-primary/10 border-primary text-primary"
                        : year.isActive
                          ? "bg-background border-border text-foreground hover:border-primary/50"
                          : "bg-muted border-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {year.isCurrent ? (
                    <Star className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">
                      {year.name.slice(-2)}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {year.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {year.totalStudents} students
                  </p>
                  {year.isCurrent && (
                    <div className="mt-1 w-12 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {i < sorted.length - 1 && (
                <div className="w-12 h-0.5 bg-border self-start mt-5 mx-1 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicYearTimeline;

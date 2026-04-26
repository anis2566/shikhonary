"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";

export const TopPerformers = () => {
  const performers = [
    {
      rank: 1,
      name: "Rahim Ahmed",
      section: "Science Section",
      score: 98.5,
      avatar: "https://i.pravatar.cc/150?u=1",
      rankColor: "bg-amber-400",
    },
    {
      rank: 2,
      name: "Fatima Begum",
      section: "Science Section",
      score: 96.2,
      avatar: "https://i.pravatar.cc/150?u=2",
      rankColor: "bg-slate-300",
    },
    {
      rank: 3,
      name: "Nusrat Jahan",
      section: "Science Section",
      score: 94.8,
      avatar: "https://i.pravatar.cc/150?u=3",
      rankColor: "bg-orange-300",
    },
  ];

  return (
    <section className="space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Top Performers
        </h2>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100/50">
        <div className="divide-y divide-slate-50">
          {performers.map((student) => (
            <div key={student.rank} className="flex items-center px-4 py-4 gap-4 hover:bg-slate-50 transition-colors">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="text-[10px] font-bold">ST</AvatarFallback>
                </Avatar>
                <div className={`absolute -top-1 -right-1 w-5 h-5 ${student.rankColor} rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm border-2 border-white`}>
                  {student.rank}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {student.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Rank 0{student.rank} • {student.section}
                </p>
              </div>
              <div className="text-right">
                <p className="text-md font-black text-emerald-600 leading-none">
                  {student.score}
                </p>
                <p className="text-[9px] uppercase font-bold text-slate-400 mt-1 tracking-tighter">
                  Overall Score
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

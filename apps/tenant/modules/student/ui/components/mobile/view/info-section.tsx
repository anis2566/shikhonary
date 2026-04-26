"use client";

import { Info, User, School, Users as People } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";

interface InfoSectionProps {
  student: TenantTypes.Student & {
    batch?: { name: string } | null;
    academicYear?: { name: string };
  };
}

export const InfoSection = ({ student }: InfoSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Personal Info Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/50">
        <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <User size={16} className="text-emerald-600" />
          Personal Details
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MobileInfoItem label="Gender" value={student.gender} />
            <MobileInfoItem label="Blood Group" value={student.bloodGroup || "N/A"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MobileInfoItem label="DOB" value={student.dateOfBirth?.toLocaleDateString() || "N/A"} />
            <MobileInfoItem label="Religion" value={student.religion} />
          </div>
          <MobileInfoItem label="Address" value={student.presentAddress} />
        </div>
      </section>

      {/* Academic Info Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/50">
        <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <School size={16} className="text-blue-600" />
          Academic Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MobileInfoItem label="Class" value={student.className} />
            <MobileInfoItem label="Batch" value={student.batch?.name || "N/A"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MobileInfoItem label="Roll" value={student.roll} />
            <MobileInfoItem label="Year" value={student.academicYear?.name || "N/A"} />
          </div>
        </div>
      </section>

      {/* Guardian Info Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/50">
        <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <People size={16} className="text-purple-600" />
          Guardian Information
        </h2>

        <div className="space-y-4">
          <MobileInfoItem label="Father's Name" value={student.fatherName} />
          <MobileInfoItem label="Mother's Name" value={student.motherName} />
          <MobileInfoItem label="Primary Phone" value={student.primaryPhone} />
        </div>
      </section>
    </div>
  );
};

const MobileInfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-[13px] font-bold text-slate-900 leading-snug">{value}</p>
  </div>
);

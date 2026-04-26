"use client";

import { cn } from "@workspace/ui/lib/utils";
import { TenantTypes } from "@workspace/db";
import { User, School, Users as People } from "lucide-react";

interface OverviewProps {
  student: TenantTypes.Student & {
    batch?: { name: string } | null;
    academicYear?: { name: string };
  };
}

export const Overview = ({ student }: OverviewProps) => {
  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <User size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <InfoItem label="Full Name" value={student.name} />
          <InfoItem label="Student ID" value={student.studentId} />
          <InfoItem label="Gender" value={student.gender} />
          <InfoItem label="Date of Birth" value={student.dateOfBirth?.toLocaleDateString() || "N/A"} />
          <InfoItem label="Blood Group" value={student.bloodGroup || "N/A"} />
          <InfoItem label="Religion" value={student.religion} />
          <InfoItem label="Nationality" value={student.nationality} />
          <InfoItem label="Phone Number" value={student.primaryPhone} />
          <div className="md:col-span-2">
            <InfoItem label="Present Address" value={student.presentAddress} />
          </div>
        </div>
      </section>

      {/* Academic Information */}
      <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <School size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Academic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <InfoItem label="Academic Year" value={student.academicYear?.name || "N/A"} />
          <InfoItem label="Class" value={student.className} />
          <InfoItem label="Batch" value={student.batch?.name || "Not Assigned"} />
          <InfoItem label="Roll Number" value={student.roll} />
          <InfoItem label="Group" value={student.group || "N/A"} />
          <InfoItem label="Shift" value={student.shift || "N/A"} />
        </div>
      </section>

      {/* Guardian Information */}
      <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <People size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Guardian Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <InfoItem label="Father's Name" value={student.fatherName} />
          <InfoItem label="Mother's Name" value={student.motherName} />
          <InfoItem label="Secondary Contact" value={student.secondaryPhone || "N/A"} />
        </div>
      </section>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <p className="text-slate-900 font-semibold text-[15px]">{value}</p>
  </div>
);

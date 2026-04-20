export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
  totalStudents: number;
  totalBatches: number;
  createdAt: string;
}
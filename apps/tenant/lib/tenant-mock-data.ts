// Mock data for tenant dashboard based on Prisma schema
import type { AcademicYear } from './academic-year';

export type { AcademicYear };

interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  primaryPhone: string;
  secondaryPhone?: string;
  academicClassId: string;
  className: string;
  batchId: string;
  batchName: string;
  roll: string;
  group: string;
  shift: string;
  section: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  presentAddress: string;
  permanentAddress?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Batch {
  id: string;
  name: string;
  academicClassId: string;
  className: string;
  academicYear: string;
  capacity: number;
  currentSize: number;
  isActive: boolean;
  createdAt: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjectIds: string[];
  subjectNames: string[];
  designation: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  createdAt: string;
}

interface Guardian {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phonePrimary: string;
  phoneSecondary?: string;
  occupation?: string;
  address?: string;
  nidNumber?: string;
  studentIds: string[];
  studentNames: string[];
  isActive: boolean;
  createdAt: string;
}

interface Staff {
  id: string;
  name: string;
  employeeId: string;
  email?: string;
  phone: string;
  designation: string;
  department: string;
  dateOfBirth?: string;
  gender?: string;
  joiningDate?: string;
  salary?: number;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  type: string;
  total: number;
  mcq: number;
  cq: number;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  hasNegativeMark: boolean;
  negativeMark: number;
  startDate: string;
  endDate: string;
  batchId?: string;
  batchName?: string;
  teacherId?: string;
  teacherName?: string;
  status: string;
  isPublished: boolean;
  isActive: boolean;
  attemptCount: number;
  avgScore: number;
  createdAt: string;
}

interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  totalQuestions: number;
  duration: number;
  status: string;
  startTime: string;
  endTime: string;
  rank: number;
  createdAt: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetType: string;
  priority: string;
  isPublished: boolean;
  isPinned: boolean;
  createdBy: string;
  createdAt: string;
}

interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  batchName: string;
  className: string;
  room?: string;
  type: string;
}

interface Timetable {
  id: string;
  name: string;
  batchId: string;
  batchName: string;
  className: string;
  academicYearId: string;
  academicYear: string;
  effectiveFrom: string;
  isActive: boolean;
  slots: TimetableSlot[];
  createdAt: string;
}

interface TenantDashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalBatches: number;
  totalExams: number;
  upcomingExams: number;
  ongoingExams: number;
  completedExams: number;
  averageAttendance: number;
  averageExamScore: number;
  totalAttempts: number;
  pendingResults: number;
  totalGuardians: number;
  totalStaff: number;
}

// Mock data generators
export const mockStudents: Student[] = [
  {
    id: 'std-1',
    studentId: '2024001',
    name: 'Rahim Ahmed',
    email: 'rahim@example.com',
    phone: '01712345678',
    primaryPhone: '01712345678',
    secondaryPhone: '01712345679',
    academicClassId: 'cls-1',
    className: 'Class 10',
    batchId: 'batch-1',
    batchName: 'Morning Batch A',
    roll: '01',
    group: 'Science',
    shift: 'Morning',
    section: 'A',
    fatherName: 'Abdul Ahmed',
    motherName: 'Hasina Begum',
    dateOfBirth: '2008-05-15',
    gender: 'Male',
    bloodGroup: 'A+',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '123 Main St, Dhaka',
    permanentAddress: '123 Main St, Dhaka',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'std-2',
    studentId: '2024002',
    name: 'Fatima Begum',
    email: 'fatima@example.com',
    phone: '01812345678',
    primaryPhone: '01812345678',
    academicClassId: 'cls-1',
    className: 'Class 10',
    batchId: 'batch-1',
    batchName: 'Morning Batch A',
    roll: '02',
    group: 'Science',
    shift: 'Morning',
    section: 'A',
    fatherName: 'Karim Uddin',
    motherName: 'Salma Akter',
    dateOfBirth: '2008-08-20',
    gender: 'Female',
    bloodGroup: 'B+',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '456 Park Ave, Dhaka',
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'std-3',
    studentId: '2024003',
    name: 'Karim Hassan',
    email: 'karim@example.com',
    phone: '01912345678',
    primaryPhone: '01912345678',
    academicClassId: 'cls-1',
    className: 'Class 10',
    batchId: 'batch-2',
    batchName: 'Evening Batch B',
    roll: '01',
    group: 'Commerce',
    shift: 'Evening',
    section: 'B',
    fatherName: 'Hassan Ali',
    motherName: 'Fatema Khatun',
    dateOfBirth: '2008-03-10',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '789 Lake Road, Chittagong',
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'std-4',
    studentId: '2024004',
    name: 'Ayesha Khan',
    email: 'ayesha@example.com',
    phone: '01612345678',
    primaryPhone: '01612345678',
    academicClassId: 'cls-2',
    className: 'Class 9',
    batchId: 'batch-3',
    batchName: 'Morning Batch A',
    roll: '01',
    group: 'Science',
    shift: 'Morning',
    section: 'A',
    fatherName: 'Khan Mohammad',
    motherName: 'Roksana Begum',
    dateOfBirth: '2009-11-25',
    gender: 'Female',
    bloodGroup: 'AB+',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '321 Hill Street, Sylhet',
    isActive: true,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'std-5',
    studentId: '2024005',
    name: 'Mohammad Ali',
    email: 'ali@example.com',
    phone: '01512345678',
    primaryPhone: '01512345678',
    academicClassId: 'cls-2',
    className: 'Class 9',
    batchId: 'batch-3',
    batchName: 'Morning Batch A',
    roll: '02',
    group: 'Science',
    shift: 'Morning',
    section: 'A',
    fatherName: 'Ali Rahman',
    motherName: 'Shirin Akter',
    dateOfBirth: '2009-07-12',
    gender: 'Male',
    bloodGroup: 'A-',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '654 Green Road, Rajshahi',
    isActive: false,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'std-6',
    studentId: '2024006',
    name: 'Nusrat Jahan',
    email: 'nusrat@example.com',
    phone: '01712345680',
    primaryPhone: '01712345680',
    academicClassId: 'cls-1',
    className: 'Class 10',
    batchId: 'batch-1',
    batchName: 'Morning Batch A',
    roll: '03',
    group: 'Science',
    shift: 'Morning',
    section: 'A',
    fatherName: 'Jahan Uddin',
    motherName: 'Nasima Begum',
    dateOfBirth: '2008-02-28',
    gender: 'Female',
    bloodGroup: 'O-',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '987 River View, Dhaka',
    isActive: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'std-7',
    studentId: '2024007',
    name: 'Tanvir Rahman',
    email: 'tanvir@example.com',
    phone: '01812345680',
    primaryPhone: '01812345680',
    academicClassId: 'cls-1',
    className: 'Class 10',
    batchId: 'batch-2',
    batchName: 'Evening Batch B',
    roll: '02',
    group: 'Commerce',
    shift: 'Evening',
    section: 'B',
    fatherName: 'Rahman Khan',
    motherName: 'Sufia Khatun',
    dateOfBirth: '2008-09-05',
    gender: 'Male',
    bloodGroup: 'B-',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '147 Trade Center, Dhaka',
    isActive: true,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'std-8',
    studentId: '2024008',
    name: 'Sabrina Akter',
    email: 'sabrina@example.com',
    phone: '01912345680',
    primaryPhone: '01912345680',
    academicClassId: 'cls-2',
    className: 'Class 9',
    batchId: 'batch-3',
    batchName: 'Morning Batch A',
    roll: '03',
    group: 'Arts',
    shift: 'Morning',
    section: 'A',
    fatherName: 'Akter Hossain',
    motherName: 'Rahima Begum',
    dateOfBirth: '2009-04-18',
    gender: 'Female',
    bloodGroup: 'AB-',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    presentAddress: '258 Culture Lane, Khulna',
    isActive: true,
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
];

export const mockBatches: Batch[] = [
  {
    id: 'batch-1',
    name: 'Morning Batch A',
    academicClassId: 'cls-1',
    className: 'Class 10',
    academicYear: '2024',
    capacity: 30,
    currentSize: 25,
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'batch-2',
    name: 'Evening Batch B',
    academicClassId: 'cls-1',
    className: 'Class 10',
    academicYear: '2024',
    capacity: 25,
    currentSize: 20,
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'batch-3',
    name: 'Morning Batch A',
    academicClassId: 'cls-2',
    className: 'Class 9',
    academicYear: '2024',
    capacity: 30,
    currentSize: 28,
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'batch-4',
    name: 'Weekend Batch',
    academicClassId: 'cls-1',
    className: 'Class 10',
    academicYear: '2024',
    capacity: 20,
    currentSize: 15,
    isActive: true,
    createdAt: '2024-01-05T10:00:00Z',
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: 'tch-1',
    name: 'Dr. Salim Rahman',
    email: 'salim@example.com',
    phone: '01711111111',
    subjectIds: ['sub-1', 'sub-2'],
    subjectNames: ['Physics', 'Mathematics'],
    designation: 'Senior Lecturer',
    department: 'Science',
    joinDate: '2020-01-15',
    isActive: true,
    createdAt: '2020-01-15T10:00:00Z',
  },
  {
    id: 'tch-2',
    name: 'Nasreen Akter',
    email: 'nasreen@example.com',
    phone: '01811111111',
    subjectIds: ['sub-3'],
    subjectNames: ['Chemistry'],
    designation: 'Lecturer',
    department: 'Science',
    joinDate: '2021-06-01',
    isActive: true,
    createdAt: '2021-06-01T10:00:00Z',
  },
  {
    id: 'tch-3',
    name: 'Rafiq Uddin',
    email: 'rafiq@example.com',
    phone: '01911111111',
    subjectIds: ['sub-4', 'sub-5'],
    subjectNames: ['English', 'Bengali'],
    designation: 'Assistant Professor',
    department: 'Languages',
    joinDate: '2019-03-10',
    isActive: true,
    createdAt: '2019-03-10T10:00:00Z',
  },
  {
    id: 'tch-4',
    name: 'Momena Khatun',
    email: 'momena@example.com',
    phone: '01611111111',
    subjectIds: ['sub-6'],
    subjectNames: ['Biology'],
    designation: 'Lecturer',
    department: 'Science',
    joinDate: '2022-01-10',
    isActive: true,
    createdAt: '2022-01-10T10:00:00Z',
  },
  {
    id: 'tch-5',
    name: 'Jamal Hossain',
    email: 'jamal@example.com',
    phone: '01511111111',
    subjectIds: ['sub-7'],
    subjectNames: ['ICT'],
    designation: 'Assistant Teacher',
    department: 'Technology',
    joinDate: '2023-07-01',
    isActive: false,
    createdAt: '2023-07-01T10:00:00Z',
  },
];

export const mockGuardians: Guardian[] = [
  {
    id: 'grd-1',
    name: 'Abdul Ahmed',
    relationship: 'Father',
    email: 'abdul.ahmed@example.com',
    phonePrimary: '01712345000',
    phoneSecondary: '01712345001',
    occupation: 'Businessman',
    address: '123 Main St, Dhaka',
    nidNumber: '1234567890',
    studentIds: ['std-1'],
    studentNames: ['Rahim Ahmed'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'grd-2',
    name: 'Karim Uddin',
    relationship: 'Father',
    email: 'karim.uddin@example.com',
    phonePrimary: '01812345000',
    occupation: 'Teacher',
    address: '456 Park Ave, Dhaka',
    studentIds: ['std-2'],
    studentNames: ['Fatima Begum'],
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'grd-3',
    name: 'Hassan Ali',
    relationship: 'Father',
    phonePrimary: '01912345000',
    occupation: 'Engineer',
    address: '789 Lake Road, Chittagong',
    nidNumber: '9876543210',
    studentIds: ['std-3'],
    studentNames: ['Karim Hassan'],
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'grd-4',
    name: 'Khan Mohammad',
    relationship: 'Father',
    email: 'khan.mohammad@example.com',
    phonePrimary: '01612345000',
    occupation: 'Doctor',
    address: '321 Hill Street, Sylhet',
    studentIds: ['std-4'],
    studentNames: ['Ayesha Khan'],
    isActive: true,
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'grd-5',
    name: 'Roksana Begum',
    relationship: 'Mother',
    phonePrimary: '01712345100',
    occupation: 'Homemaker',
    address: '321 Hill Street, Sylhet',
    studentIds: ['std-4'],
    studentNames: ['Ayesha Khan'],
    isActive: true,
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'grd-6',
    name: 'Ali Rahman',
    relationship: 'Father',
    phonePrimary: '01512345000',
    occupation: 'Government Officer',
    address: '654 Green Road, Rajshahi',
    studentIds: ['std-5'],
    studentNames: ['Mohammad Ali'],
    isActive: false,
    createdAt: '2024-01-19T10:00:00Z',
  },
];

export const mockStaff: Staff[] = [
  {
    id: 'stf-1',
    name: 'Mizanur Rahman',
    employeeId: 'EMP-001',
    email: 'mizan@example.com',
    phone: '01711100001',
    designation: 'Accountant',
    department: 'Administration',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    joiningDate: '2018-01-01',
    salary: 35000,
    address: '12 Office Lane, Dhaka',
    isActive: true,
    createdAt: '2018-01-01T10:00:00Z',
  },
  {
    id: 'stf-2',
    name: 'Shirin Akter',
    employeeId: 'EMP-002',
    email: 'shirin@example.com',
    phone: '01811100002',
    designation: 'Librarian',
    department: 'Library',
    dateOfBirth: '1990-07-20',
    gender: 'Female',
    joiningDate: '2019-06-15',
    salary: 28000,
    address: '45 Book Street, Dhaka',
    isActive: true,
    createdAt: '2019-06-15T10:00:00Z',
  },
  {
    id: 'stf-3',
    name: 'Kamal Hasan',
    employeeId: 'EMP-003',
    phone: '01911100003',
    designation: 'Lab Assistant',
    department: 'Science Lab',
    dateOfBirth: '1988-11-10',
    gender: 'Male',
    joiningDate: '2020-03-01',
    salary: 22000,
    address: '78 Lab Road, Dhaka',
    isActive: true,
    createdAt: '2020-03-01T10:00:00Z',
  },
  {
    id: 'stf-4',
    name: 'Rina Begum',
    employeeId: 'EMP-004',
    phone: '01611100004',
    designation: 'Receptionist',
    department: 'Administration',
    gender: 'Female',
    joiningDate: '2021-09-01',
    salary: 20000,
    isActive: true,
    createdAt: '2021-09-01T10:00:00Z',
  },
  {
    id: 'stf-5',
    name: 'Babul Mia',
    employeeId: 'EMP-005',
    phone: '01511100005',
    designation: 'Security Guard',
    department: 'Security',
    gender: 'Male',
    joiningDate: '2017-04-15',
    salary: 15000,
    isActive: false,
    createdAt: '2017-04-15T10:00:00Z',
  },
];

export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'Weekly Test - Physics Chapter 1',
    description: 'Motion and Force concepts',
    type: 'WEEKLY',
    total: 50,
    mcq: 25,
    cq: 2,
    duration: 60,
    totalMarks: 50,
    passingMarks: 20,
    hasNegativeMark: true,
    negativeMark: 0.25,
    startDate: '2024-02-01T10:00:00Z',
    endDate: '2024-02-01T11:00:00Z',
    batchId: 'batch-1',
    batchName: 'Morning Batch A',
    teacherId: 'tch-1',
    teacherName: 'Dr. Salim Rahman',
    status: 'Completed',
    isPublished: true,
    isActive: true,
    attemptCount: 23,
    avgScore: 35.5,
    createdAt: '2024-01-28T10:00:00Z',
  },
  {
    id: 'exam-2',
    title: 'Monthly Assessment - Mathematics',
    description: 'Algebra and Trigonometry',
    type: 'MONTHLY',
    total: 100,
    mcq: 40,
    cq: 4,
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    hasNegativeMark: false,
    negativeMark: 0,
    startDate: '2024-02-10T09:00:00Z',
    endDate: '2024-02-10T11:00:00Z',
    batchId: 'batch-1',
    batchName: 'Morning Batch A',
    teacherId: 'tch-1',
    teacherName: 'Dr. Salim Rahman',
    status: 'Published',
    isPublished: true,
    isActive: true,
    attemptCount: 0,
    avgScore: 0,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'exam-3',
    title: 'Mock Test - Full Syllabus',
    description: 'Complete syllabus revision test',
    type: 'MOCK',
    total: 200,
    mcq: 80,
    cq: 8,
    duration: 180,
    totalMarks: 200,
    passingMarks: 80,
    hasNegativeMark: true,
    negativeMark: 0.5,
    startDate: '2024-02-15T10:00:00Z',
    endDate: '2024-02-15T13:00:00Z',
    status: 'Pending',
    isPublished: false,
    isActive: true,
    attemptCount: 0,
    avgScore: 0,
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'exam-4',
    title: 'Practice Quiz - Chemistry',
    description: 'Organic Chemistry basics',
    type: 'PRACTICE',
    total: 30,
    mcq: 30,
    duration: 30,
    totalMarks: 30,
    passingMarks: 12,
    hasNegativeMark: false,
    negativeMark: 0,
    startDate: '2024-01-25T10:00:00Z',
    endDate: '2024-01-25T10:30:00Z',
    batchId: 'batch-2',
    batchName: 'Evening Batch B',
    teacherId: 'tch-2',
    teacherName: 'Nasreen Akter',
    status: 'Ongoing',
    isPublished: true,
    isActive: true,
    attemptCount: 15,
    avgScore: 22.3,
    createdAt: '2024-01-20T10:00:00Z',
  },
];

export const mockExamAttempts: ExamAttempt[] = [
  {
    id: 'att-1',
    examId: 'exam-1',
    examTitle: 'Weekly Test - Physics Chapter 1',
    studentId: 'std-1',
    studentName: 'Rahim Ahmed',
    score: 42,
    percentage: 84,
    correctAnswers: 21,
    wrongAnswers: 3,
    skippedQuestions: 1,
    totalQuestions: 25,
    duration: 55,
    status: 'Submitted',
    startTime: '2024-02-01T10:00:00Z',
    endTime: '2024-02-01T10:55:00Z',
    rank: 1,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'att-2',
    examId: 'exam-1',
    examTitle: 'Weekly Test - Physics Chapter 1',
    studentId: 'std-2',
    studentName: 'Fatima Begum',
    score: 38,
    percentage: 76,
    correctAnswers: 19,
    wrongAnswers: 5,
    skippedQuestions: 1,
    totalQuestions: 25,
    duration: 58,
    status: 'Submitted',
    startTime: '2024-02-01T10:00:00Z',
    endTime: '2024-02-01T10:58:00Z',
    rank: 2,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'att-3',
    examId: 'exam-4',
    examTitle: 'Practice Quiz - Chemistry',
    studentId: 'std-3',
    studentName: 'Karim Hassan',
    score: 24,
    percentage: 80,
    correctAnswers: 24,
    wrongAnswers: 6,
    skippedQuestions: 0,
    totalQuestions: 30,
    duration: 28,
    status: 'Submitted',
    startTime: '2024-01-25T10:00:00Z',
    endTime: '2024-01-25T10:28:00Z',
    rank: 1,
    createdAt: '2024-01-25T10:00:00Z',
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Upcoming Term Exam Schedule',
    content: 'The term examination will begin from February 20, 2024. Please check the detailed schedule in the notice board.',
    targetType: 'ALL',
    priority: 'HIGH',
    isPublished: true,
    isPinned: true,
    createdBy: 'admin',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Holiday Notice - Victory Day',
    content: 'The institution will remain closed on December 16th on the occasion of Victory Day.',
    targetType: 'ALL',
    priority: 'NORMAL',
    isPublished: true,
    isPinned: false,
    createdBy: 'admin',
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'ann-3',
    title: 'Science Fair Registration Open',
    content: 'Interested students can register for the annual science fair. Last date: February 28, 2024.',
    targetType: 'CLASS',
    priority: 'NORMAL',
    isPublished: true,
    isPinned: false,
    createdBy: 'tch-1',
    createdAt: '2024-02-08T10:00:00Z',
  },
];

export const mockDashboardStats: TenantDashboardStats = {
  totalStudents: 156,
  activeStudents: 148,
  totalTeachers: 12,
  totalBatches: 8,
  totalExams: 45,
  upcomingExams: 5,
  ongoingExams: 2,
  completedExams: 38,
  averageAttendance: 87.5,
  averageExamScore: 68.2,
  totalAttempts: 892,
  pendingResults: 3,
  totalGuardians: 42,
  totalStaff: 8,
};

// Academic Years
export const mockAcademicYears: AcademicYear[] = [
  {
    id: 'ay-1',
    name: '2025',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isCurrent: true,
    isActive: true,
    totalStudents: 156,
    totalBatches: 8,
    createdAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'ay-2',
    name: '2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isCurrent: false,
    isActive: false,
    totalStudents: 142,
    totalBatches: 6,
    createdAt: '2023-12-15T10:00:00Z',
  },
  {
    id: 'ay-3',
    name: '2023',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    isCurrent: false,
    isActive: false,
    totalStudents: 128,
    totalBatches: 5,
    createdAt: '2022-12-15T10:00:00Z',
  },
];

// Timetables
const morningBatchSlots: TimetableSlot[] = [
  { id: 'ts-1', day: 'Sunday', startTime: '08:00', endTime: '08:45', subjectName: 'Physics', teacherName: 'Dr. Salim Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-2', day: 'Sunday', startTime: '08:50', endTime: '09:35', subjectName: 'Mathematics', teacherName: 'Shahana Parveen', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-3', day: 'Sunday', startTime: '09:35', endTime: '09:50', subjectName: 'Break', teacherName: '', batchName: 'Morning Batch A', className: 'Class 10', type: 'BREAK' },
  { id: 'ts-4', day: 'Sunday', startTime: '09:50', endTime: '10:35', subjectName: 'Chemistry', teacherName: 'Nasir Uddin', batchName: 'Morning Batch A', className: 'Class 10', room: 'Lab 1', type: 'LAB' },
  { id: 'ts-5', day: 'Sunday', startTime: '10:40', endTime: '11:25', subjectName: 'English', teacherName: 'Rafiq Islam', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-6', day: 'Monday', startTime: '08:00', endTime: '08:45', subjectName: 'Mathematics', teacherName: 'Shahana Parveen', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-7', day: 'Monday', startTime: '08:50', endTime: '09:35', subjectName: 'Biology', teacherName: 'Taslima Khatun', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-8', day: 'Monday', startTime: '09:35', endTime: '09:50', subjectName: 'Break', teacherName: '', batchName: 'Morning Batch A', className: 'Class 10', type: 'BREAK' },
  { id: 'ts-9', day: 'Monday', startTime: '09:50', endTime: '10:35', subjectName: 'Physics', teacherName: 'Dr. Salim Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Lab 2', type: 'LAB' },
  { id: 'ts-10', day: 'Monday', startTime: '10:40', endTime: '11:25', subjectName: 'Bangla', teacherName: 'Nadia Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-11', day: 'Tuesday', startTime: '08:00', endTime: '08:45', subjectName: 'Chemistry', teacherName: 'Nasir Uddin', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-12', day: 'Tuesday', startTime: '08:50', endTime: '09:35', subjectName: 'Physics', teacherName: 'Dr. Salim Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-13', day: 'Tuesday', startTime: '09:35', endTime: '09:50', subjectName: 'Break', teacherName: '', batchName: 'Morning Batch A', className: 'Class 10', type: 'BREAK' },
  { id: 'ts-14', day: 'Tuesday', startTime: '09:50', endTime: '10:35', subjectName: 'English', teacherName: 'Rafiq Islam', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-15', day: 'Tuesday', startTime: '10:40', endTime: '11:25', subjectName: 'Mathematics', teacherName: 'Shahana Parveen', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-16', day: 'Wednesday', startTime: '08:00', endTime: '08:45', subjectName: 'Biology', teacherName: 'Taslima Khatun', batchName: 'Morning Batch A', className: 'Class 10', room: 'Lab 1', type: 'LAB' },
  { id: 'ts-17', day: 'Wednesday', startTime: '08:50', endTime: '09:35', subjectName: 'Bangla', teacherName: 'Nadia Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-18', day: 'Wednesday', startTime: '09:35', endTime: '09:50', subjectName: 'Break', teacherName: '', batchName: 'Morning Batch A', className: 'Class 10', type: 'BREAK' },
  { id: 'ts-19', day: 'Wednesday', startTime: '09:50', endTime: '10:35', subjectName: 'Mathematics', teacherName: 'Shahana Parveen', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-20', day: 'Wednesday', startTime: '10:40', endTime: '11:25', subjectName: 'Physics', teacherName: 'Dr. Salim Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-21', day: 'Thursday', startTime: '08:00', endTime: '08:45', subjectName: 'English', teacherName: 'Rafiq Islam', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-22', day: 'Thursday', startTime: '08:50', endTime: '09:35', subjectName: 'Chemistry', teacherName: 'Nasir Uddin', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-23', day: 'Thursday', startTime: '09:35', endTime: '09:50', subjectName: 'Break', teacherName: '', batchName: 'Morning Batch A', className: 'Class 10', type: 'BREAK' },
  { id: 'ts-24', day: 'Thursday', startTime: '09:50', endTime: '10:35', subjectName: 'Biology', teacherName: 'Taslima Khatun', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
  { id: 'ts-25', day: 'Thursday', startTime: '10:40', endTime: '11:25', subjectName: 'Bangla', teacherName: 'Nadia Rahman', batchName: 'Morning Batch A', className: 'Class 10', room: 'Room 101', type: 'CLASS' },
];

export const mockTimetables: Timetable[] = [
  {
    id: 'tt-1',
    name: 'Class 10 - Morning Batch A Routine',
    batchId: 'batch-1',
    batchName: 'Morning Batch A',
    className: 'Class 10',
    academicYearId: 'ay-1',
    academicYear: '2025',
    effectiveFrom: '2025-01-01',
    isActive: true,
    slots: morningBatchSlots,
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'tt-2',
    name: 'Class 10 - Evening Batch B Routine',
    batchId: 'batch-2',
    batchName: 'Evening Batch B',
    className: 'Class 10',
    academicYearId: 'ay-1',
    academicYear: '2025',
    effectiveFrom: '2025-01-01',
    isActive: true,
    slots: [],
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'tt-3',
    name: 'Class 9 - Morning Batch A Routine',
    batchId: 'batch-3',
    batchName: 'Morning Batch A',
    className: 'Class 9',
    academicYearId: 'ay-1',
    academicYear: '2025',
    effectiveFrom: '2025-01-01',
    isActive: true,
    slots: [],
    createdAt: '2025-01-01T10:00:00Z',
  },
];

// Chart data
export const examPerformanceData = [
  { month: 'Jan', avgScore: 65, passRate: 78 },
  { month: 'Feb', avgScore: 68, passRate: 82 },
  { month: 'Mar', avgScore: 72, passRate: 85 },
  { month: 'Apr', avgScore: 70, passRate: 80 },
  { month: 'May', avgScore: 75, passRate: 88 },
  { month: 'Jun', avgScore: 73, passRate: 85 },
];

export const attendanceData = [
  { day: 'Mon', present: 142, absent: 14 },
  { day: 'Tue', present: 145, absent: 11 },
  { day: 'Wed', present: 138, absent: 18 },
  { day: 'Thu', present: 150, absent: 6 },
  { day: 'Fri', present: 147, absent: 9 },
  { day: 'Sat', present: 135, absent: 21 },
];

export const subjectPerformanceData = [
  { subject: 'Physics', avgScore: 72, students: 45 },
  { subject: 'Chemistry', avgScore: 68, students: 42 },
  { subject: 'Mathematics', avgScore: 75, students: 48 },
  { subject: 'Biology', avgScore: 70, students: 40 },
  { subject: 'English', avgScore: 78, students: 50 },
];

export const examTypeDistribution = [
  { name: 'Weekly', value: 20, color: 'hsl(var(--chart-1))' },
  { name: 'Monthly', value: 10, color: 'hsl(var(--chart-2))' },
  { name: 'Term', value: 4, color: 'hsl(var(--chart-3))' },
  { name: 'Mock', value: 6, color: 'hsl(var(--chart-4))' },
  { name: 'Practice', value: 5, color: 'hsl(var(--chart-5))' },
];

export const recentActivities = [
  { id: '1', type: 'exam', message: 'Weekly Test - Physics completed', time: '2 hours ago' },
  { id: '2', type: 'student', message: 'New student Ayesha Khan enrolled', time: '3 hours ago' },
  { id: '3', type: 'result', message: 'Results published for Monthly Math Test', time: '5 hours ago' },
  { id: '4', type: 'announcement', message: 'New announcement posted', time: '1 day ago' },
  { id: '5', type: 'attendance', message: 'Attendance marked for Morning Batch A', time: '1 day ago' },
];

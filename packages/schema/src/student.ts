import { z } from "zod";
import {
  GENDER,
  BLOOD_GROUP,
  RELIGION,
  NATIONALITY,
  SHIFT,
} from "@workspace/utils/constants";
import {
  nameSchema,
  emailSchema,
  bdPhoneSchema,
  uuidSchema,
  addressSchema,
  citySchema,
  stateSchema,
  postalCodeSchema,
} from "./shared/fields";

/**
 * Student Schema
 */

export const studentFormSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  email: emailSchema.optional().or(z.literal("")),
  academicClassId: uuidSchema,
  batchId: uuidSchema.nullable().optional(),
  institute: z.string().min(1, "Institute is required"),
  roll: z.string().min(1, "Roll is required"),
  group: z.string().optional(),
  shift: z.string().optional(),
  section: z.string().optional(),
  fatherName: z.string().min(1, "Father name is required"),
  motherName: z.string().min(1, "Mother name is required"),
  dateOfBirth: z.date().optional(),
  gender: z.string().min(1, "Gender is required"),
  bloodGroup: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().min(1, "Religion is required"),
  imageUrl: z.string().optional(),
  primaryPhone: z.string().length(11, "Phone number must be 11 digits"),
  secondaryPhone: z
    .string()
    .length(11, "Phone number must be 11 digits")
    .optional(),
  presentAddress: z.string().min(1, "Present address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  isActive: z.boolean(),
  academicYearId: uuidSchema,
  admissionFee: z.number().int().min(0, "Admission fee must be at least 0"),
  monthlyFee: z.number().int().min(0, "Monthly fee must be at least 0"),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

export const defaultStudentValues: Partial<StudentFormValues> = {
  studentId: "",
  name: "",
  email: "",
  academicClassId: "",
  batchId: "",
  institute: "",
  roll: "",
  group: "",
  shift: SHIFT.DAY,
  section: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: new Date(),
  gender: GENDER.MALE,
  bloodGroup: "",
  nationality: NATIONALITY.BANGLADESHI,
  religion: RELIGION.ISLAM,
  imageUrl: "",
  primaryPhone: "",
  secondaryPhone: "",
  presentAddress: "",
  permanentAddress: "",
  isActive: true,
  academicYearId: "",
  admissionFee: 0,
  monthlyFee: 0,
};

export const updateStudentSchema = studentFormSchema.partial();

export const studentSchema = studentFormSchema.extend({
  id: uuidSchema,
});

export type Student = z.infer<typeof studentSchema>;

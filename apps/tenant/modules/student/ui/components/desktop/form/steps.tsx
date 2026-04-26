import { School, BookOpen, User, Contact, Wallet, ClipboardCheck } from "lucide-react";

export const studentFormSteps = [
  {
    id: 1,
    title: "Setup",
    description: "Core institutional enrollment details",
    icon: School,
    fields: ["academicYearId", "academicClassId", "studentId", "batchId"],
  },
  {
    id: 2,
    title: "Personal Profile",
    description: "Student identity and demographics",
    icon: User,
    fields: [
      "name",
      "email",
      "dateOfBirth",
      "gender",
      "bloodGroup",
      "nationality",
      "religion",
      "imageUrl",
    ],
  },
  {
    id: 3,
    title: "Academic Placement",
    description: "Class, section, and group assignment",
    icon: BookOpen,
    fields: ["institute", "group", "shift", "section", "roll"],
  },
  {
    id: 4,
    title: "Guardians & Contact",
    description: "Address and emergency contact info",
    icon: Contact,
    fields: [
      "fatherName",
      "motherName",
      "primaryPhone",
      "secondaryPhone",
      "presentAddress",
      "permanentAddress",
    ],
  },
  {
    id: 5,
    title: "Financials",
    description: "Fee structures and billing details",
    icon: Wallet,
    fields: ["admissionFee", "monthlyFee", "isActive"],
  },
  {
    id: 6,
    title: "Review",
    description: "Confirm Details",
    icon: ClipboardCheck,
    fields: [],
  },
];

export const Steps = () => {
  return <div>Steps</div>;
};

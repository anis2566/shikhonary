/**
 * Personal information options for students/members
 */

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum NATIONALITY {
  BANGLADESHI = "BANGLADESHI",
  OTHER = "OTHER",
}

export enum BLOOD_GROUP {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export enum RELIGION {
  ISLAM = "ISLAM",
  HINDUISM = "HINDUISM",
  CHRISTIANITY = "CHRISTIANITY",
  BUDDHISM = "BUDDHISM",
  OTHER = "OTHER",
}

export const genderOptions = [
  { value: GENDER.MALE, label: "Male" },
  { value: GENDER.FEMALE, label: "Female" },
  { value: GENDER.OTHER, label: "Other" },
] as const;

export const bloodGroupOptions = [
  { value: BLOOD_GROUP.A_POSITIVE, label: "A+" },
  { value: BLOOD_GROUP.A_NEGATIVE, label: "A-" },
  { value: BLOOD_GROUP.B_POSITIVE, label: "B+" },
  { value: BLOOD_GROUP.B_NEGATIVE, label: "B-" },
  { value: BLOOD_GROUP.AB_POSITIVE, label: "AB+" },
  { value: BLOOD_GROUP.AB_NEGATIVE, label: "AB-" },
  { value: BLOOD_GROUP.O_POSITIVE, label: "O+" },
  { value: BLOOD_GROUP.O_NEGATIVE, label: "O-" },
] as const;

export const religionOptions = [
  { value: RELIGION.ISLAM, label: "Islam" },
  { value: RELIGION.HINDUISM, label: "Hinduism" },
  { value: RELIGION.CHRISTIANITY, label: "Christianity" },
  { value: RELIGION.BUDDHISM, label: "Buddhism" },
  { value: RELIGION.OTHER, label: "Other" },
] as const;

export const nationalityOptions = [
  { value: "BANGLADESHI", label: "Bangladeshi" },
  { value: "OTHER", label: "Other" },
] as const;

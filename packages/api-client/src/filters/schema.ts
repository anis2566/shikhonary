import {
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
  parseAsBoolean,
} from "nuqs/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  ACADEMIC_LEVEL,
  SORT,
  SORT_WITH_POSITION,
  TENANT_TYPE,
  MCQ_TYPE,
} from "@workspace/utils/constants";

// Common constants if not found in utils
export const ACTIVE_STATUS = ["ACTIVE", "INACTIVE"];
export const SORT_ORDER = ["asc", "desc"];

/**
 * Base pagination and search filters used across most list endpoints
 */
export const baseFilterSchema = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  limit: parseAsInteger
    .withDefault(DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  sortBy: parseAsString.withOptions({ clearOnDefault: true }),
  sortOrder: parseAsStringEnum(["asc", "desc"]).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Class Filters
 */
export const academicClassFilterSchema = {
  ...baseFilterSchema,
  level: parseAsStringEnum(Object.values(ACADEMIC_LEVEL)).withOptions({
    clearOnDefault: true,
  }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Subject Filters
 */
export const academicSubjectFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Chapter Filters
 */
export const academicChapterFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Topic Filters
 */
export const academicTopicFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  chapterId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Subtopic Filters
 */
export const academicSubTopicFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  chapterId: parseAsString.withOptions({ clearOnDefault: true }),
  topicId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * MCQ Filters
 */
export const mcqFilterSchema = {
  ...baseFilterSchema,
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  chapterId: parseAsString.withOptions({ clearOnDefault: true }),
  topicId: parseAsString.withOptions({ clearOnDefault: true }),
  subtopicId: parseAsString.withOptions({ clearOnDefault: true }),
  type: parseAsStringEnum(Object.values(MCQ_TYPE)).withOptions({
    clearOnDefault: true,
  }),
  isMath: parseAsBoolean.withOptions({ clearOnDefault: true }),
  questionTypeId: parseAsString.withOptions({ clearOnDefault: true }),
  reference: parseAsString.withOptions({ clearOnDefault: true }),
  sort: parseAsStringEnum(Object.values(SORT)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Question Type Filters
 */
export const questionTypeFilterSchema = {
  ...baseFilterSchema,
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Student Filters
 */
export const studentFilterSchema = {
  ...baseFilterSchema,
  batchId: parseAsString.withOptions({ clearOnDefault: true }),
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Tenant Filters
 */
export const tenantFilterSchema = {
  ...baseFilterSchema,
  type: parseAsStringEnum(Object.values(TENANT_TYPE)).withOptions({
    clearOnDefault: true,
  }),
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Subscription Plan Filters
 */
export const subscriptionPlanFilterSchema = {
  ...baseFilterSchema,
  isActive: parseAsStringEnum(ACTIVE_STATUS).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Subscription Filters
 */
export const subscriptionFilterSchema = {
  ...baseFilterSchema,
  status: parseAsString.withOptions({ clearOnDefault: true }),
  tier: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Academic Year Filters
 */
export const academicYearFilterSchema = {
  ...baseFilterSchema,
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
  isCurrent: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Batch Filters
 */
export const batchFilterSchema = {
  ...baseFilterSchema,
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Counter Filters
 */
export const counterFilterSchema = {
  ...baseFilterSchema,
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Admission Fee Filters
 */
export const admissionFeeFilterSchema = {
  ...baseFilterSchema,
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Monthly Fee Filters
 */
export const monthlyFeeFilterSchema = {
  ...baseFilterSchema,
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
};

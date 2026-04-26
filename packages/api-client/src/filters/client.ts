"use client";

import { useQueryStates } from "nuqs";
import {
  academicClassFilterSchema,
  academicSubjectFilterSchema,
  academicChapterFilterSchema,
  academicTopicFilterSchema,
  academicSubTopicFilterSchema,
  mcqFilterSchema,
  studentFilterSchema,
  batchFilterSchema,
  tenantFilterSchema,
  subscriptionPlanFilterSchema,
  subscriptionFilterSchema,
  questionTypeFilterSchema,
  academicYearFilterSchema,
  counterFilterSchema,
  admissionFeeFilterSchema,
  monthlyFeeFilterSchema,
} from "./schema";

export const useAcademicClassFilters = () =>
  useQueryStates(academicClassFilterSchema);
export const useAcademicSubjectFilters = () =>
  useQueryStates(academicSubjectFilterSchema);
export const useAcademicChapterFilters = () =>
  useQueryStates(academicChapterFilterSchema);
export const useAcademicTopicFilters = () =>
  useQueryStates(academicTopicFilterSchema);
export const useAcademicSubTopicFilters = () =>
  useQueryStates(academicSubTopicFilterSchema);
export const useMCQFilters = () => useQueryStates(mcqFilterSchema);
export const useStudentFilters = () => useQueryStates(studentFilterSchema);
export const useBatchFilters = () => useQueryStates(batchFilterSchema);
export const useTenantFilters = () => useQueryStates(tenantFilterSchema);
export const useSubscriptionPlanFilters = () =>
  useQueryStates(subscriptionPlanFilterSchema);
export const useSubscriptionFilters = () =>
  useQueryStates(subscriptionFilterSchema);
export const useQuestionTypeFilters = () =>
  useQueryStates(questionTypeFilterSchema);
export const useAcademicYearFilters = () =>
  useQueryStates(academicYearFilterSchema);
export const useCounterFilters = () => useQueryStates(counterFilterSchema);
export const useAdmissionFeeFilters = () =>
  useQueryStates(admissionFeeFilterSchema);
export const useMonthlyFeeFilters = () =>
  useQueryStates(monthlyFeeFilterSchema);

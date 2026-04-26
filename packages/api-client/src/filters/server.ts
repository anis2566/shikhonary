import { createLoader } from "nuqs/server";
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

export const academicClassLoader = createLoader(academicClassFilterSchema);
export const academicSubjectLoader = createLoader(academicSubjectFilterSchema);
export const academicChapterLoader = createLoader(academicChapterFilterSchema);
export const academicTopicLoader = createLoader(academicTopicFilterSchema);
export const academicSubTopicLoader = createLoader(
  academicSubTopicFilterSchema,
);
export const mcqLoader = createLoader(mcqFilterSchema);
export const studentLoader = createLoader(studentFilterSchema);
export const batchLoader = createLoader(batchFilterSchema);
export const tenantLoader = createLoader(tenantFilterSchema);
export const subscriptionPlanLoader = createLoader(
  subscriptionPlanFilterSchema,
);
export const subscriptionLoader = createLoader(subscriptionFilterSchema);
export const questionTypeLoader = createLoader(questionTypeFilterSchema);
export const academicYearLoader = createLoader(academicYearFilterSchema);
export const counterLoader = createLoader(counterFilterSchema);
export const admissionFeeLoader = createLoader(admissionFeeFilterSchema);
export const monthlyFeeLoader = createLoader(monthlyFeeFilterSchema);

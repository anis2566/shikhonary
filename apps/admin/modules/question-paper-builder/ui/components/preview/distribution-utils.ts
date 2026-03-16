import {
  PaperQuestion,
  PaperSubjectAction,
  PaperSubjectBreakdown,
} from "../types";

/**
 * Matches a question to a specific distribution.
 * Logic copied and consolidated from PaperContent.
 */
export function matchesDistribution(
  q: PaperQuestion,
  subjectId: string,
  distribution: PaperSubjectAction,
  subjects?: PaperSubjectBreakdown[],
): boolean {
  if (q.distributionId && q.distributionId === distribution.id) return true;

  // 1. Subject Match Strategy
  const hasSingleSubject = subjects?.length === 1;
  if (!hasSingleSubject) {
    if (q.subjectId && q.subjectId !== subjectId) return false;
  }

  // 2. Type Match Strategy
  const targetTypeId = distribution.questionTypeId;
  const targetTypeName = (distribution.questionType?.name || "").toLowerCase();

  // Exact ID Match
  if (q.questionTypeId && targetTypeId && q.questionTypeId === targetTypeId) {
    return true;
  }

  // Robust Name/Type Mapping
  const qType = q.type || "single";

  // MCQ Group
  if (
    targetTypeName.includes("mcq") ||
    targetTypeName.includes("single") ||
    targetTypeName.includes("multi") ||
    targetTypeName.includes("objective")
  ) {
    return qType === "single" || qType === "multiple" || qType === "contextual";
  }

  // Statement Group
  if (
    targetTypeName.includes("statement") ||
    targetTypeName.includes("বিবৃতি")
  ) {
    return qType === "statement";
  }

  // CQ Group
  if (
    targetTypeName === "cq" ||
    targetTypeName.includes("creative") ||
    targetTypeName.includes("সৃজনশীল")
  ) {
    return qType === "creative";
  }

  // Final loose name match
  const qLabels = [qType.toLowerCase()];
  if (qType === "single" || qType === "multiple") qLabels.push("mcq");

  if (targetTypeName === "cq" && qLabels.includes("mcq")) return false;

  return qLabels.some(
    (label) =>
      targetTypeName === label ||
      (targetTypeName.includes(label) && label !== "mcq") ||
      (label.includes(targetTypeName) && targetTypeName !== "cq"),
  );
}

export interface DistributionStats {
  [distributionId: string]: {
    count: number;
    marks: number;
  };
}

/**
 * Calculates current counts and marks for all distributions in one pass.
 * Prevents O(N*D) performance bottleneck.
 */
export function calculateDistributionStats(
  questions: PaperQuestion[],
  subjects: PaperSubjectBreakdown[] | undefined,
): DistributionStats {
  const stats: DistributionStats = {};

  if (!subjects) return stats;

  subjects.forEach((s) => {
    s.distributions?.forEach((d: PaperSubjectAction) => {
      let count = 0;
      let marks = 0;

      questions.forEach((q) => {
        if (matchesDistribution(q, s.subjectId, d, subjects)) {
          count++;
          if (q.subQuestions && q.subQuestions.length > 0) {
            marks += q.subQuestions.reduce(
              (sum: number, sq: { marks: number }) => sum + sq.marks,
              0,
            );
          } else {
            marks += d.marksPerQuestion;
          }
        }
      });

      stats[d.id] = { count, marks };
    });
  });

  return stats;
}

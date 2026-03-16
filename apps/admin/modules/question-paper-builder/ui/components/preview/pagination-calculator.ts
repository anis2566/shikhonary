"use client";

import { PaperQuestion, PaperSettings, PaperSubjectBreakdown } from "../types";

/**
 * Pure calculation-based pagination — replaces the old DOM-measurement approach
 * (PaperMeasurer) that rendered all questions 2× off-screen.
 *
 * All heights are in px (mm × 3.78).
 */

const MM_TO_PX = 3.78;

// ─── Estimation helpers ──────────────────────────────────────────────────────

/**
 * Estimate the number of wrapped lines for a text string given a font size
 * and available width (in px).
 */
function estimateLines(
  text: string | undefined | null,
  fontSize: number,
  availableWidth: number,
): number {
  if (!text || text.length === 0) return 0;
  // Average character width ≈ fontSize × 0.55 for Bengali / mixed text.
  // Bengali glyphs are generally wider; use a conservative factor.
  const avgCharWidth = fontSize * 0.55;
  const charsPerLine = Math.max(1, Math.floor(availableWidth / avgCharWidth));
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}

/**
 * Estimated height (px) of the paper header section on the first page.
 */
export function estimateHeaderHeight(settings: PaperSettings): number {
  let h = 0;

  // Institution name
  if (settings.institutionName) {
    const fs =
      settings.headerStyles?.institutionName?.fontSize ?? 20;
    h += fs * 1.4 + 4;
  }

  // Exam name
  if (settings.showExamName && settings.examName) {
    const fs = settings.headerStyles?.examName?.fontSize ?? 16;
    h += fs * 1.4 + 4;
  }

  // Class / Subject / Chapter row
  if (settings.showClassName || settings.showSubjectName || settings.showChapterName) {
    h += 20;
  }

  // Set code
  if (settings.showSetCode) {
    h += 32;
  }

  // Time + Total marks row
  if (settings.showTime || settings.showTotalMarks) {
    h += 20;
  }

  // Instructions
  if (settings.showInstructions && settings.instructions) {
    h += 18;
  }

  // Bottom padding / divider
  h += 12;

  return h;
}

/**
 * Estimate the height in px of a single question including its context,
 * options / sub-questions, and surrounding spacing.
 */
export function estimateQuestionHeight(
  q: PaperQuestion,
  settings: PaperSettings,
  availableWidth: number,
): number {
  const fontSize = q.questionStyle?.fontSize ?? settings.fontSize;
  const lineH = fontSize * (settings.lineHeight || 1.1);
  let height = 0;

  // Context
  if (q.context) {
    const ctxFontSize = q.contextStyle?.fontSize ?? 12;
    const ctxLineH = ctxFontSize * (settings.lineHeight || 1.1);
    height += estimateLines(q.context, ctxFontSize, availableWidth) * ctxLineH;
    height += 4; // spacing after context
  }

  // Question text (MCQ question stem)
  if (q.question) {
    height += estimateLines(q.question, fontSize, availableWidth - 24) * lineH;
  }

  // Statements (for statement-type MCQs)
  if (q.statements && q.statements.length > 0) {
    const stmtFontSize = 12;
    const stmtLineH = stmtFontSize * (settings.lineHeight || 1.1);
    q.statements.forEach((s) => {
      height += estimateLines(s, stmtFontSize, availableWidth - 30) * stmtLineH;
    });
  }

  // Options (MCQ)
  if (q.type !== "creative" && q.options && q.options.length > 0) {
    const optFontSize = q.options[0]?.style?.fontSize ?? settings.fontSize;
    const optLineH = optFontSize * (settings.lineHeight || 1.1);

    // Determine column layout
    const maxLen = Math.max(...q.options.map((o) => o.text.length), 0);
    const baseThreshold = settings.columns === 1 ? 50 : 24;
    const threshold = Math.floor(baseThreshold * (14 / settings.fontSize));
    const isTwoCol =
      q.optionsColumns === 2 ||
      (q.optionsColumns !== 1 && maxLen <= threshold && settings.columns < 3);

    if (isTwoCol) {
      // Two columns — options are paired
      const rows = Math.ceil(q.options.length / 2);
      const halfWidth = (availableWidth - 16) / 2;
      for (let r = 0; r < rows; r++) {
        const leftOpt = q.options[r * 2];
        const rightOpt = q.options[r * 2 + 1];
        const leftLines = estimateLines(leftOpt?.text, optFontSize, halfWidth);
        const rightLines = rightOpt
          ? estimateLines(rightOpt.text, optFontSize, halfWidth)
          : 0;
        height += Math.max(leftLines, rightLines) * optLineH;
      }
    } else {
      // Single column
      q.options.forEach((opt) => {
        height +=
          estimateLines(opt.text, optFontSize, availableWidth - 30) * optLineH;
      });
    }
  }

  // Sub-questions (CQ)
  if (q.subQuestions && q.subQuestions.length > 0) {
    q.subQuestions.forEach((sq) => {
      const sqFontSize = sq.style?.fontSize ?? fontSize;
      const sqLineH = sqFontSize * (settings.lineHeight || 1.1);
      height +=
        estimateLines(sq.text, sqFontSize, availableWidth - 40) * sqLineH;
      height += 4; // spacing between sub-questions
    });
  }

  // Reference line
  if (settings.showReference && q.reference && q.reference.length > 0) {
    height += 14;
  }

  // Padding around the question
  height += 8;

  return height;
}

/**
 * Estimate the height of the subject header + distribution info that appears
 * before a group of questions.
 */
function estimateSubjectHeaderHeight(
  subject: PaperSubjectBreakdown,
  isStart: boolean,
): number {
  if (!isStart) return 0;
  let h = 0;

  // Subject title + total marks row
  h += 28;

  // Distribution info rows (excluding CQ)
  const nonCqDistributions = (subject.distributions || []).filter((d) => {
    const name = (d.questionType?.name || "").toLowerCase();
    return (
      !name.includes("cq") &&
      !name.includes("creative") &&
      !name.includes("সৃজনশীল")
    );
  });
  h += nonCqDistributions.length * 20;

  // Bottom spacing
  h += 8;

  return h;
}

// ─── Main pagination function ────────────────────────────────────────────────

export interface PaginationResult {
  pages: PaperQuestion[][];
  firstPageEnd: number;
}

export function calculatePagination(
  questions: PaperQuestion[],
  settings: PaperSettings,
  subjects: PaperSubjectBreakdown[] | undefined,
  paperDimensions: { width: number; height: number },
): PaginationResult {
  if (questions.length === 0) {
    return { pages: [[]], firstPageEnd: 0 };
  }

  const pageHeightPx =
    (paperDimensions.height - settings.margins.top - settings.margins.bottom) *
    MM_TO_PX;
  const pageWidthPx =
    (paperDimensions.width - settings.margins.left - settings.margins.right) *
    MM_TO_PX;

  // When multi-column, the effective content width is divided
  const columnGap = 24; // 1.5rem ≈ 24px
  const numCols = settings.columns || 1;
  const availableWidth =
    numCols > 1
      ? (pageWidthPx - columnGap * (numCols - 1)) / numCols
      : pageWidthPx;

  const headerHeight = estimateHeaderHeight(settings);

  // We'll track which subjects have had their header rendered
  const renderedSubjectHeaders = new Set<string>();

  // Build question heights with subject headers
  interface QuestionBlock {
    question: PaperQuestion;
    height: number;
  }

  const blocks: QuestionBlock[] = questions.map((q) => {
    let blockHeight = 0;

    // Check if we need a subject header
    if (subjects && q.subjectId) {
      const subject = subjects.find((s) => s.subjectId === q.subjectId);
      if (subject && !renderedSubjectHeaders.has(q.subjectId)) {
        renderedSubjectHeaders.add(q.subjectId);
        blockHeight += estimateSubjectHeaderHeight(subject, true);

        // Section label (for multi-distribution subjects)
        if (subject.distributions && subject.distributions.length > 1) {
          blockHeight += 24;
        }
      }
    }

    blockHeight += estimateQuestionHeight(q, settings, availableWidth);
    return { question: q, height: blockHeight };
  });

  // Paginate using multi-column aware logic
  const pages: PaperQuestion[][] = [];
  let currentPage: PaperQuestion[] = [];
  let currentColumnHeight = 0;
  let currentColumn = 0;

  // First page has less space because of header
  const isLandscapeMultiCol =
    settings.paperOrientation === "landscape" && numCols > 1;
  const firstPageAvailable = isLandscapeMultiCol
    ? pageHeightPx // Header is inline with first column in landscape multi-col
    : pageHeightPx - headerHeight;
  let currentPageAvailable = firstPageAvailable;

  for (const block of blocks) {
    const fitsInCurrentColumn = currentColumnHeight + block.height <= currentPageAvailable;

    if (fitsInCurrentColumn) {
      currentPage.push(block.question);
      currentColumnHeight += block.height;
    } else {
      // Try next column on same page
      if (numCols > 1 && currentColumn < numCols - 1) {
        currentColumn++;
        currentColumnHeight = block.height;
        currentPage.push(block.question);
      } else {
        // New page
        pages.push(currentPage);
        currentPage = [block.question];
        currentColumn = 0;
        currentColumnHeight = block.height;
        currentPageAvailable = pageHeightPx; // Subsequent pages have no header
      }
    }
  }

  // Push last page
  if (currentPage.length > 0 || pages.length === 0) {
    pages.push(currentPage);
  }

  const firstPageEnd = pages[0]?.length ?? questions.length;

  return { pages, firstPageEnd };
}

export interface ElementStyle {
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
}

export interface PaperQuestion {
  id: string;
  number: number;
  question: string;
  questionStyle?: ElementStyle;
  options: { label: string; text: string; style?: ElementStyle }[];
  correctAnswer?: string;
  context?: string;
  contextStyle?: ElementStyle;
  statements?: string[];
  statementStyles?: ElementStyle[];
  type: "single" | "multiple" | "assertion" | "statement" | "contextual";
}

export interface HeaderStyles {
  institutionName?: ElementStyle;
  className?: ElementStyle;
  subjectName?: ElementStyle;
  chapterName?: ElementStyle;
  setCode?: ElementStyle;
  examName?: ElementStyle;
  time?: ElementStyle;
  totalMarks?: ElementStyle;
  instructions?: ElementStyle;
}

export interface MarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PaperSettings {
  // Header settings
  institutionName: string;
  showClassName: boolean;
  showSubjectName: boolean;
  showChapterName: boolean;
  showSetCode: boolean;
  setCode: string;
  showExamName: boolean;
  examName: string;
  showInstructions: boolean;
  instructions: string;
  showNoMarkingNote: boolean;
  showTime: boolean;
  time: string;
  showTotalMarks: boolean;
  totalMarks: number;
  className: string;
  subjectName: string;
  chapterName: string;

  // Per-element styles for header
  headerStyles: HeaderStyles;

  // Page layout
  paperSize: "A4" | "Letter" | "Legal" | "A5";
  paperOrientation: "portrait" | "landscape";
  margins: MarginSettings;
  columns: 1 | 2 | 3;
  showColumnDivider: boolean;

  // Typography
  optionStyle: "parentheses" | "dot" | "bracket" | "round";
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  lineHeight: number;
  textAlign: "left" | "center" | "right" | "justify";

  // Tools
  detectDuplicates: boolean;
  enableShuffle: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;

  // Branding
  showAddress: boolean;
  address: string;
  showWatermark: boolean;
  watermark: string;
}

export interface PaperMetadata {
  className: string;
  subjectName: string;
  chapterName: string;
}

// Active element context for toolbar
export interface ActiveElementContext {
  type: "header" | "question" | "option" | "statement" | "context";
  field?: keyof HeaderStyles;
  questionId?: string;
  optionIndex?: number;
  statementIndex?: number;
  currentStyle: ElementStyle;
}

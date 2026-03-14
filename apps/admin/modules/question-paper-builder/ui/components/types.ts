export interface ElementStyle {
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  fontWeight?: string | number;
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
  optionsColumns?: 1 | 2;
  subjectId?: string;
  questionTypeId?: string;
  distributionId?: string;
  reference?: string[];
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
  showLogo: boolean;
  logoUrl: string;
  showAddress: boolean;
  address: string;
  showWatermark: boolean;
  watermark: string;
  showReference: boolean;
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
  optionsColumns?: 1 | 2;
}

export interface PaperSubjectAction {
  id: string;
  questionTypeId: string;
  questionType: {
    name: string;
    label: string;
  };
  marksPerQuestion: number;
  questionCount: number;
  totalMarks: number;
  questionsToAttempt: number | null;
}

export interface PaperSubjectBreakdown {
  id: string;
  subjectId: string;
  subject: {
    displayName: string;
  };
  distributions: PaperSubjectAction[];
}

export interface PaperPreviewProps {
  questions: PaperQuestion[];
  subjects?: PaperSubjectBreakdown[];
  settings: PaperSettings;
  onUpdateQuestion: (question: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: PaperQuestion) => void;
  onReorderQuestions?: (questions: PaperQuestion[]) => void;
  onSettingsChange: (settings: PaperSettings) => void;
  isEditing: boolean;
  zoom?: number | "auto";
}

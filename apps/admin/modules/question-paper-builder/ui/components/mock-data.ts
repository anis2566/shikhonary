import { PaperSettings, HeaderStyles, MarginSettings } from "./types";

const defaultHeaderStyles: HeaderStyles = {
  institutionName: {
    fontSize: 20,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
  },
  className: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "center" },
  subjectName: {
    fontSize: 16,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
  },
  chapterName: {
    fontSize: 14,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
  },
  setCode: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "center" },
  examName: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "center" },
  time: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "left" },
  totalMarks: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "right" },
  instructions: { fontSize: 12, fontFamily: "SolaimanLipi", textAlign: "left" },
};

const defaultMargins: MarginSettings = {
  top: 20,
  bottom: 20,
  left: 15,
  right: 15,
};

export const defaultPaperSettings: PaperSettings = {
  institutionName: "Basic Education Care",
  showClassName: true,
  showSubjectName: true,
  showChapterName: true,
  showSetCode: true,
  setCode: "ক",
  showExamName: true,
  examName: "Model Test",
  showInstructions: true,
  instructions:
    "প্রতিটি প্রশ্নের সঠিক উত্তর শুধু একটি। উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে প্রদত্ত বর্ণসমূহলিত বৃত্ত সমূহ হতে সঠিক উত্তরের বৃত্তটি বল পয়েন্ট কলম দ্বারা সম্পূর্ণ ভরাট করো। প্রতিটি প্রশ্নের মান ১।",
  showNoMarkingNote: true,
  showTime: true,
  time: "৩০ মিনিট",
  showTotalMarks: true,
  totalMarks: 20,
  className: "নবম/দশম",
  subjectName: "বাংলা ১ম পত্র",
  chapterName: "গদ্য ১ - সুভা",

  headerStyles: defaultHeaderStyles,

  // Page layout
  paperSize: "A4",
  paperOrientation: "portrait",
  margins: defaultMargins,
  columns: 2,
  showColumnDivider: true,

  // Typography
  optionStyle: "parentheses",
  fontFamily: "SolaimanLipi",
  fontSize: 14,
  fontWeight: "normal",
  lineHeight: 1.1,
  textAlign: "left",

  // Tools
  detectDuplicates: false,
  enableShuffle: false,
  shuffleQuestions: false,
  shuffleOptions: false,

  // Branding
  showAddress: false,
  address: "",
  showWatermark: false,
  watermark: "",
};

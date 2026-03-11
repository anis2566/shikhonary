import { PaperSettings, HeaderStyles, MarginSettings } from "./types";

const defaultHeaderStyles: HeaderStyles = {
  institutionName: {
    fontSize: 20,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
    fontWeight: "bold",
  },
  className: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "center" },
  subjectName: {
    fontSize: 14,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
  },
  chapterName: {
    fontSize: 14,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
  },
  setCode: { fontSize: 14, fontFamily: "SolaimanLipi", textAlign: "center" },
  examName: {
    fontSize: 16,
    fontFamily: "SolaimanLipi",
    textAlign: "center",
    fontWeight: "bold",
  },
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
  institutionName: "",
  showClassName: true,
  showSubjectName: true,
  showChapterName: true,
  showSetCode: true,
  setCode: "ক",
  showExamName: true,
  examName: "",
  showInstructions: true,
  instructions:
    "[প্রতিটি প্রশ্নের সঠিক উত্তর শুধু একটি। উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে প্রদত্ত বর্ণসমূহলিত বৃত্ত সমূহ হতে সঠিক উত্তরের বৃত্তটি বল পয়েন্ট কলম দ্বারা সম্পূর্ণ ভরাট করো। প্রতিটি প্রশ্নের মান ১।]",
  showNoMarkingNote: true,
  showTime: true,
  time: "",
  showTotalMarks: true,
  totalMarks: 0,
  className: "",
  subjectName: "",
  chapterName: "",

  headerStyles: defaultHeaderStyles,

  // Page layout
  paperSize: "A4",
  paperOrientation: "portrait",
  margins: defaultMargins,
  columns: 1,
  showColumnDivider: true,

  // Typography
  optionStyle: "parentheses",
  fontFamily: "SolaimanLipi",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: 1.4,
  textAlign: "left",

  // Tools
  detectDuplicates: false,
  enableShuffle: false,
  shuffleQuestions: false,
  shuffleOptions: false,

  // Branding
  showLogo: true,
  logoUrl: "/placeholder-logo.png",
  showAddress: false,
  address: "",
  showWatermark: false,
  watermark: "",
  showReference: true,
};

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Menu,
  X,
  Bell,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  LoaderCircle,
  Pencil,
  FolderPlus,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { useAssignmentStore, Assignment } from "@/app/assignments/assignmentStore";
import { toast } from "sonner";

const DEFAULT_RUBRIC_OPTIONS = [
  "Accuracy / Correctness",
  "Step-wise Explanation",
  "Presentation / Flow",
  "Concept Clarity",
  "Grammar & Language",
];

const generateFeedbackText = (rubrics: string[]) => {
  if (rubrics.length === 0) return "";
  const feedbacks: Record<string, string> = {
    "Accuracy / Correctness": "The response shows perfect accuracy regarding scientific details. It correctly identifies the primary light-absorbing pigment (chlorophyll) and specifies the carbon dioxide-water chemical conversion formula precisely.",
    "Step-wise Explanation": "The explanation is structured in logical steps: starting from light absorption by chlorophyll, followed by water photolysis, and ending with carbon fixation and glucose synthesis in the stroma.",
    "Presentation / Flow": "The writing flows exceptionally well, using smooth transitions between chemical inputs and organic outputs. Visual readability is enhanced by clear section headings.",
    "Concept Clarity": "A deep understanding of biochemistry is demonstrated. The student clearly understands both the light-dependent and light-independent (Calvin cycle) reactions, showing complete concept clarity.",
    "Grammar & Language": "The grammar and sentence structures are precise, formal, and free of any technical or typographical errors.",
  };
  return rubrics.map(r => feedbacks[r] || "").filter(Boolean).join("\n\n");
};

interface QuestionEvaluationCardProps {
  question: any;
  index: number;
}

function QuestionEvaluationCard({ question, index }: QuestionEvaluationCardProps) {
  const {
    assessmentToggles,
    assessmentRubrics,
    assessmentExplanations,
    setAssessmentToggle,
    setAssessmentRubrics,
    setAssessmentExplanation,
  } = useAssignmentStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const enabled = assessmentToggles[question.id] || false;
  const selectedRubrics = assessmentRubrics[question.id] || [];
  const explanation = assessmentExplanations[question.id] || "";

  const handleSelectRubric = (rubric: string) => {
    if (!selectedRubrics.includes(rubric)) {
      const nextRubrics = [...selectedRubrics, rubric];
      setAssessmentRubrics(question.id, nextRubrics);
      setAssessmentExplanation(question.id, generateFeedbackText(nextRubrics));
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveRubric = (rubric: string) => {
    const nextRubrics = selectedRubrics.filter((r: string) => r !== rubric);
    setAssessmentRubrics(question.id, nextRubrics);
    setAssessmentExplanation(question.id, generateFeedbackText(nextRubrics));
  };

  const handleTextareaChange = (text: string) => {
    setAssessmentExplanation(question.id, text);
  };

  return (
    <div className="w-full bg-white rounded-[24px] p-6 border border-[#EBEBEB] flex flex-col gap-5 relative text-[#1F1F1F] shadow-sm select-none">
      {/* Question Header row */}
      <div className="w-full flex items-start gap-3.5">
        <div className="w-[30px] h-[30px] rounded-full bg-[#FF5029] flex items-center justify-center text-white font-bricolage font-bold text-[14px] shrink-0 mt-0.5 shadow-sm">
          {index}
        </div>
        <div className="flex-1 font-bricolage text-[15px] md:text-[16px] font-bold text-[#1F1F1F] leading-snug text-left pt-0.5">
          {question.text}
        </div>
      </div>

      {/* AI Assessment Toggle Row */}
      <div className="w-full flex items-center justify-between border-t border-neutral-100/80 pt-4">
        <div className="flex items-center gap-2 text-[#1F1F1F]">
          <Sparkles size={16} className="text-[#FF5029] shrink-0 animate-pulse" />
          <span className="font-bricolage font-bold text-[14.5px] md:text-[15.5px] tracking-tight leading-none">
            AI Criterion-by-Criterion Assessment
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAssessmentToggle(question.id, !enabled)}
          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-[#1F1F1F]/20 relative shrink-0 ${
            enabled ? "bg-[#1F1F1F]" : "bg-[#CCCCCC]/60"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
              enabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Assessment Settings area */}
      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full flex flex-col gap-4 overflow-hidden"
          >
            {/* Select Rubric Container */}
            <div className="w-full bg-[#F9F9F9] rounded-[20px] p-5 border border-neutral-100/50 flex flex-col gap-3.5 relative text-left">
              <span className="font-bricolage font-bold text-[13.5px] text-[#1F1F1F] tracking-tight">
                Select rubric
              </span>

              {/* Custom Dropdown select input */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-[44px] w-full px-4 rounded-[12px] bg-white border border-[#E1E1E1] flex items-center justify-between text-[13.5px] font-semibold text-[#1F1F1F] cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition-all select-none"
                >
                  <span>Select rubric</span>
                  <ChevronDown
                    size={16}
                    className={`text-neutral-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Options List */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#EBEBEB] rounded-[16px] shadow-2xl z-50 p-2 flex flex-col gap-1 max-h-[220px] overflow-y-auto thin-scrollbar animate-in fade-in zoom-in-95 duration-100">
                      {DEFAULT_RUBRIC_OPTIONS.map((opt) => {
                        const isSelected = selectedRubrics.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectRubric(opt)}
                            disabled={isSelected}
                            className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-colors select-none ${
                              isSelected
                                ? "text-neutral-300 bg-neutral-50/50 cursor-not-allowed"
                                : "text-[#1F1F1F] hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Removable chips/tags */}
              {selectedRubrics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedRubrics.map((rubric: string) => (
                    <div
                      key={rubric}
                      className="bg-white border border-[#EBEBEB] text-[#1F1F1F] text-[12px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm select-none animate-in scale-in duration-150"
                    >
                      <span>{rubric}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRubric(rubric)}
                        className="p-0.5 rounded-full hover:bg-neutral-100 flex items-center justify-center shrink-0 cursor-pointer outline-none"
                      >
                        <X size={12} className="text-neutral-400 hover:text-black shrink-0" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Explanation Card Container */}
            <div className="w-full bg-[#F9F9F9] rounded-[20px] p-5 border border-neutral-100/50 flex flex-col gap-3 text-left">
              <span className="font-bricolage font-bold text-[13.5px] text-[#1F1F1F] tracking-tight">
                Explanation
              </span>

              {selectedRubrics.length === 0 ? (
                /* Pulse Skeleton Placeholders */
                <div className="flex flex-col gap-2.5 py-1.5">
                  <div className="w-full h-3.5 bg-neutral-200/80 rounded-full animate-pulse" />
                  <div className="w-[60%] h-3.5 bg-neutral-200/80 rounded-full animate-pulse" />
                </div>
              ) : (
                /* Editable Feedback Textarea */
                <div className="w-full animate-in fade-in duration-200">
                  <textarea
                    value={explanation}
                    onChange={(e) => handleTextareaChange(e.target.value)}
                    rows={3}
                    placeholder="Select rubrics above to generate AI evaluation feedback, or type your custom evaluation here..."
                    className="w-full bg-transparent text-[13.5px] font-normal leading-relaxed text-[#1F1F1F] outline-none placeholder:text-neutral-400/80 border-0 resize-none p-0 focus:ring-0"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIEvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    assignments,
    pdfGenerationState,
    setPdfGenerationState,
    fetchAssignmentById,
  } = useAssignmentStore();

  const assignment = assignments.find((asm) => asm.id === id);
  const [isFetching, setIsFetching] = useState(!assignment);

  useEffect(() => {
    if (!assignment) {
      setIsFetching(true);
      fetchAssignmentById(id)
        .then((asm) => {
          setIsFetching(false);
          if (!asm) {
            router.push("/assignments");
          }
        })
        .catch(() => {
          setIsFetching(false);
          router.push("/assignments");
        });
    }
  }, [assignment, id, fetchAssignmentById, router]);

  if (isFetching || !assignment) {
    return (
      <div className="min-h-screen w-full bg-[#E2E2E2] flex items-center justify-center font-bricolage">
        <div className="text-center p-6 bg-white rounded-[24px] shadow-lg">
          <LoaderCircle className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-2" />
          <p className="text-[#1F1F1F] font-bold">Loading assessment details...</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    setPdfGenerationState("generating");
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("question-paper-print");
      if (!element) {
        setPdfGenerationState("error");
        return;
      }

      const opt = {
        margin: [10, 12, 10, 12],
        filename: `${assignment.title.replace(/\s+/g, "_")}_AI_Evaluations.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Temporarily prepare element for full-page print capture without scroll clipping
      const originalOverflow = element.style.overflow;
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;

      element.style.overflow = "visible";
      element.style.height = "auto";
      element.style.maxHeight = "none";

      try {
        await html2pdf().set(opt).from(element).save();
        setPdfGenerationState("success");
      } finally {
        // Restore original styles
        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;
        element.style.maxHeight = originalMaxHeight;
      }

      setTimeout(() => {
        setPdfGenerationState("idle");
      }, 2000);
    } catch (err) {
      console.error("PDF export failed:", err);
      setPdfGenerationState("error");
      setTimeout(() => {
        setPdfGenerationState("idle");
      }, 2000);
    }
  };

  const quizDescription =
    assignment.additionalInfo?.trim() ||
    `This quiz on ${assignment.subject || "photosynthesis"} features multiple choice and short answer questions designed to test knowledge on the topic. Perfect for engaging students in learning about this essential process.`;

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] flex p-3 gap-3 overflow-hidden font-bricolage">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-[304px] h-full bg-white rounded-[16px] p-6 card-shadow shrink-0">
          <Sidebar />
        </aside>

        {/* MOBILE SIDEBAR DRAWERS */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="relative flex flex-col w-[280px] h-full bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#1F1F1F]" />
              </button>
              <div className="h-full pt-4">
                <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
              </div>
            </aside>
          </div>
        )}

      {/* RIGHT CONTENT COLUMN */}
      <div className="flex flex-col flex-1 h-full gap-[22px] min-w-0 relative">
          
          {/* TOP NAVBAR */}
          <header className="w-full h-[56px] bg-white rounded-[16px] pl-6 pr-3 flex items-center justify-between navbar-shadow shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <Menu size={20} className="text-[#1F1F1F]" />
              </button>

              <button
                onClick={() => router.push(`/assignments/output/${id}`)}
                className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer shrink-0 border border-neutral-100/50"
              >
                <ArrowLeft size={18} className="text-[#1F1F1F]" />
              </button>

              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-[#8E8E93] shrink-0" />
                <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                  Assignments
                </span>
                <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                  / Output
                </span>
                <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                  / Evaluation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toast.info("No new notifications")}
                className="w-9 h-9 flex items-center justify-center hover:bg-[#F1F1F1] rounded-full relative transition-all duration-200 cursor-pointer"
              >
                <Bell size={18} className="text-[#1F1F1F]" />
                <span className="absolute top-[8px] right-[8px] w-[7px] h-[7px] bg-[#FF5029] rounded-full border border-white" />
              </button>

              <div className="bg-[#F1F1F1] hover:bg-[#EAEAEA] p-1 pl-1.5 pr-3 h-[38px] rounded-full flex items-center gap-2.5 cursor-pointer transition-colors duration-200">
                <div className="w-[28px] h-[28px] rounded-full overflow-hidden shrink-0 bg-neutral-200">
                  <img
                    src="/Avatar.png"
                    alt="John Doe Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bricolage text-[14px] font-medium text-[#1F1F1F] leading-none shrink-0">
                  John Doe
                </span>
                <ChevronDown size={14} className="text-[#1F1F1F] opacity-70 shrink-0" />
              </div>
            </div>
          </header>

          {/* MAIN CONTENT AREA */}
          <main className="w-full flex-1 min-h-0 overflow-hidden flex flex-col gap-[22px]">
            
            {/* Top Summary Card (Sit on light gray background) */}
            <div className="w-full bg-white rounded-[24px] p-6 border border-[#EBEBEB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative text-[#1F1F1F] shrink-0">
              <div className="flex-1 min-w-0 flex flex-col gap-1 text-left">
                <h2 className="font-bricolage text-[20px] md:text-[22px] font-bold tracking-tight text-[#1F1F1F]">
                  {assignment.title}
                </h2>
                <p className="font-inter text-[13.5px] text-[#5E5E5E] leading-relaxed max-w-[850px] mt-1">
                  {quizDescription}
                </p>
                
                {/* Action buttons row */}
                <div className="flex items-center gap-2.5 mt-4">
                  <button
                    type="button"
                    onClick={() => toast.info("Edit quiz details...")}
                    className="h-[38px] px-5 rounded-full font-bricolage text-[13px] font-semibold text-[#1F1F1F] bg-white border border-[#E1E1E1] hover:bg-neutral-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all select-none"
                  >
                    <Pencil size={14} className="text-[#1F1F1F]" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => toast.success("Saved to Library!")}
                    className="h-[38px] px-5 rounded-full font-bricolage text-[13px] font-semibold text-[#1F1F1F] bg-white border border-[#E1E1E1] hover:bg-neutral-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all select-none"
                  >
                    <FolderPlus size={14} className="text-[#1F1F1F]" />
                    <span>Save to Library</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={pdfGenerationState === "generating"}
                    className="h-[38px] px-5 rounded-full font-bricolage text-[13px] font-bold text-white bg-[#FF5029] hover:bg-[#E04420] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed select-none shrink-0"
                  >
                    {pdfGenerationState === "generating" ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin text-white" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} className="text-white shrink-0" />
                        <span>Export</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Large Questions Evaluation Cards Panel (Sit inside dark gray panel, scroll internally) */}
            <div
              id="question-paper-print"
              className="w-full flex-1 bg-[#4A4A4A] rounded-[24px] p-6 overflow-y-auto thin-scrollbar flex flex-col gap-4 min-h-0 animate-in fade-in duration-200"
            >
              {assignment.questions?.map((question, idx) => (
                <QuestionEvaluationCard
                  key={question.id}
                  question={question}
                  index={idx + 1}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
}

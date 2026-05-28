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
  LoaderCircle,
  FileText,
  Sparkles,
  Pencil,
  FolderPlus,
  Share2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAssignmentStore, Assignment } from "@/app/assignments/assignmentStore";

export default function QuestionPaperPage() {
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
          <p className="text-[#1F1F1F] font-bold">Loading assignment...</p>
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
        filename: `${assignment.title.replace(/\s+/g, "_")}_Question_Paper.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      setPdfGenerationState("success");
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

  const handleAIAssessmentClick = () => {
    router.push(`/assignments/output/${id}/evaluation`);
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
                onClick={() => router.push("/assignments")}
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
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => alert("No new notifications")}
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
                <div className="flex flex-wrap items-center gap-2.5 mt-4">
                  <button
                    type="button"
                    onClick={() => alert("Edit quiz details...")}
                    className="h-[38px] px-5 rounded-full font-bricolage text-[13px] font-semibold text-[#1F1F1F] bg-white border border-[#E1E1E1] hover:bg-neutral-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all select-none"
                  >
                    <Pencil size={14} className="text-[#1F1F1F]" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => alert("Saved to Library!")}
                    className="h-[38px] px-5 rounded-full font-bricolage text-[13px] font-semibold text-[#1F1F1F] bg-white border border-[#E1E1E1] hover:bg-neutral-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all select-none"
                  >
                    <FolderPlus size={14} className="text-[#1F1F1F]" />
                    <span>Save to Library</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAIAssessmentClick}
                    className="h-[38px] px-5 rounded-full font-bricolage text-[13px] font-bold text-white bg-black hover:bg-neutral-800 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all select-none"
                  >
                    <Sparkles size={14} fill="white" className="text-white shrink-0 animate-pulse" />
                    <span>AI Assessment</span>
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

            {/* Print-Ready Exam Sheet Card (Sitting inside scrolling viewport area) */}
            <div className="w-full flex-1 overflow-y-auto thin-scrollbar bg-neutral-400/10 rounded-[24px] p-1 pr-1.5 flex flex-col gap-4">
              <div
                id="question-paper-print"
                className="w-full bg-white rounded-[24px] p-8 md:p-10 flex flex-col gap-6 relative border border-[#EBEBEB] text-[#1F1F1F] shadow-sm animate-in fade-in duration-200"
              >
                {/* School Header */}
                <div className="flex flex-col items-center justify-center text-center font-bricolage gap-0.5 pb-1 border-b border-neutral-100">
                  <h2 className="text-[20px] md:text-[22px] font-bold tracking-tight text-[#1F1F1F]">
                    Delhi Public School, Bokaro Steel City
                  </h2>
                  <div className="flex flex-col gap-0.5 text-[14px] font-bold text-neutral-500">
                    <span>Subject: {assignment.subject || "English"}</span>
                    <span>Class: {assignment.className || "Class: 5th"}</span>
                  </div>
                </div>

                {/* Space-between row for Time Allowed and Max Marks */}
                <div className="flex items-center justify-between text-[13px] font-bold text-[#1F1F1F] tracking-tight px-0.5 font-bricolage">
                  <span>Time Allowed: {assignment.duration || "45 minutes"}</span>
                  <span>Maximum Marks: {assignment.totalMarks || 20}</span>
                </div>

                {/* Compulsory Instruction plain text */}
                <p className="font-bricolage text-[13px] font-bold text-[#1F1F1F] tracking-tight text-left">
                  All questions are compulsory unless stated otherwise.
                </p>

                {/* Student Credentials pre-filled/blank lines */}
                <div className="flex flex-col gap-3.5 font-bricolage text-[14px] text-[#1F1F1F] mt-2 max-w-[360px] text-left">
                  <div className="flex items-end gap-1.5">
                    <span className="font-bold text-[#1F1F1F] shrink-0 leading-none">Name:</span>
                    <div className="flex-1 border-b border-[#1F1F1F] h-[2px]" />
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="font-bold text-[#1F1F1F] shrink-0 leading-none">Roll Number:</span>
                    <div className="flex-1 border-b border-[#1F1F1F] h-[2px]" />
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="font-bold text-[#1F1F1F] shrink-0 leading-none">Class:</span>
                    <span className="font-normal text-[#1F1F1F] leading-none shrink-0">
                      {assignment.className?.replace("Class: ", "") || "5th"}
                    </span>
                    <span className="font-bold text-[#1F1F1F] shrink-0 leading-none ml-2">Section:</span>
                    <div className="w-[100px] border-b border-[#1F1F1F] h-[2px] flex-1" />
                  </div>
                </div>

                {/* Question List */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center justify-center text-center font-bricolage py-2 border-b border-neutral-100/80">
                    <h3 className="text-[16px] font-bold text-[#1F1F1F] uppercase tracking-wider">
                      Section A
                    </h3>
                  </div>
                  <div className="flex flex-col gap-0.5 font-bricolage">
                    <h4 className="text-[14px] font-bold text-[#1F1F1F] tracking-tight">
                      Short Answer Questions
                    </h4>
                    <p className="text-[12px] text-neutral-400 italic font-medium mt-0.5">
                      Attempt all questions. Each question carries marks as indicated.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 font-inter text-left">
                    {assignment.questions?.map((q, idx) => (
                      <div
                        key={q.id}
                        className="text-[14px] leading-relaxed tracking-tight py-1 text-[#1F1F1F] flex items-start"
                      >
                        <span className="font-bold text-neutral-400 w-6 shrink-0 text-left">
                          {idx + 1}.
                        </span>
                        <p className="flex-1 font-normal pl-1.5">
                          <span className="text-[#1F1F1F] font-bold">[{q.difficulty}] </span>
                          {q.text}{" "}
                          <span className="font-bold">[{q.marks} Marks]</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center font-bold text-[13px] text-neutral-400 uppercase tracking-widest mt-6 py-2 border-y border-dotted border-neutral-200">
                    End of Question Paper
                  </div>
                </div>

                {/* Answer Key Section */}
                <div
                  className="flex flex-col gap-6 mt-10 pt-10 border-t border-dashed border-neutral-200 break-before-page"
                  style={{ pageBreakBefore: "always" }}
                >
                  <div className="font-bricolage text-left">
                    <h3 className="text-[18px] font-bold text-[#1F1F1F] tracking-tight">
                      Answer Key
                    </h3>
                    <p className="text-[12px] text-neutral-400 mt-0.5">
                      Model answers and criteria for evaluation
                    </p>
                  </div>

                  <div className="flex flex-col gap-5 font-inter text-left">
                    {assignment.questions?.map((q, idx) => (
                      <div
                        key={`ans-${q.id}`}
                        className="flex items-start gap-4 text-[13.5px] leading-relaxed py-1"
                      >
                        <span className="font-bold text-[#1F1F1F] w-5 shrink-0 text-right">
                          {idx + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-[#1F1F1F] mb-1">
                            Question:{" "}
                            <span className="font-normal text-neutral-700">{q.text}</span>
                          </p>
                          <p className="text-[#5E5E5E] bg-neutral-50/50 border border-neutral-100 rounded-[12px] p-3 mt-1.5 italic">
                            {q.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
}

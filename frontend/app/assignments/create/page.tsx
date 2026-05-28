"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Menu,
  X,
  Bell,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Plus,
  Mic,
  LoaderCircle,
  Sliders,
  Calendar,
  FileCode,
  SquareCheckBig,
  Square,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import DatePicker from "@/components/DatePicker";
import FileUploadZone from "@/components/FileUploadZone";
import QuestionRow from "@/components/QuestionRow";
import { useAssignmentStore } from "@/app/assignments/assignmentStore";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const recognitionRef = useRef<any>(null);

  const {
    currentStep,
    assignments,
    title,
    file,
    dueDate,
    questionRows,
    additionalInfo,
    difficulty,
    duration,
    customDuration,
    sections,
    outputFormat,
    errors,
    setStep,
    setTitle,
    setFile,
    setDueDate,
    setAdditionalInfo,
    setDifficulty,
    setDuration,
    setCustomDuration,
    toggleSection,
    setOutputFormat,
    addQuestionRow,
    updateQuestionRow,
    deleteQuestionRow,
    validateStep,
    createAssignment,
    resetForm,
  } = useAssignmentStore();

  // Reset the wizard form on initial mount so we start clean
  useEffect(() => {
    resetForm();
  }, []);

  // Live Totals Calculations
  const totalQuestions = questionRows.reduce((sum, row) => sum + row.numQuestions, 0);
  const totalMarks = questionRows.reduce((sum, row) => sum + row.numQuestions * row.marks, 0);

  const handlePrev = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    } else {
      router.push("/assignments");
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep(1)) {
        setStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep(2)) {
        setIsGenerating(true);
        setGenerationStep(0);

        createAssignment(setGenerationStep)
          .then((newAsm) => {
            setIsGenerating(false);
            if (newAsm) {
              router.push(`/assignments/output/${newAsm.id}`);
            } else {
              router.push("/assignments");
            }
          })
          .catch((err) => {
            console.error("Assignment generation failed:", err);
            alert(`Generation failed: ${err.message || err}`);
            setIsGenerating(false);
          });
      }
    }
  };

  const handleSpeechInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setAdditionalInfo(
            additionalInfo ? `${additionalInfo} ${transcript}` : transcript
          );
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
        setIsListening(false);
      }
    }
  };

  const DURATION_OPTIONS = ["1 Hour", "2 Hours", "3 Hours", "Custom"];
  const FORMAT_OPTIONS = ["PDF Document", "Word Document (.docx)", "Google Forms"];

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
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer shrink-0 border border-neutral-100/50"
              >
                <ArrowLeft size={18} className="text-[#1F1F1F]" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                  Create New
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
        <main className="w-full flex-1 min-h-0 overflow-y-auto pr-1 pb-6 md:pb-6 thin-scrollbar">
            <div className="w-full px-4 pt-1 pb-10 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-3 duration-250">

              {/* Form Title & Subtitle Header */}
              <div className="w-full max-w-[810px] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#34C759]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-bricolage text-[20px] md:text-[22px] font-bold text-[#1F1F1F] tracking-[-0.03em] leading-none">
                    Create Assignment
                  </h1>
                  <p className="font-inter text-[13px] md:text-[14px] font-normal text-[#7E7E7E] leading-normal tracking-tight">
                    Set up a new assignment for your students
                  </p>
                </div>
              </div>

              {/* Progress Bar Segmented with Framer Motion */}
              <div className="w-full max-w-[810px] flex items-center gap-2.5 px-0.5">
                {/* Tab Segment 1 */}
                <div className="h-[3px] flex-1 rounded-full bg-[#1F1F1F]" />

                {/* Tab Segment 2 */}
                <div className="h-[3px] flex-1 rounded-full bg-[#CCCCCC]/60 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-[#1F1F1F]"
                    initial={{ x: "-100%" }}
                    animate={{ x: currentStep >= 2 ? "0%" : "-100%" }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Main Card Wrapper */}
              <div className="w-full max-w-[810px] bg-white rounded-[32px] p-6 md:p-8 card-shadow flex flex-col gap-8 relative">

                {/* AI Generation Overlay Spinner */}
                {isGenerating && (
                  <div className="absolute inset-0 z-[9999] bg-white/95 rounded-[32px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
                    <LoaderCircle className="w-10 h-10 text-[#FF5029] animate-spin mb-4" />
                    <h3 className="font-bricolage text-[18px] font-bold text-[#1F1F1F] tracking-tight">
                      Generating Assignment
                    </h3>
                    <p className="text-[14px] text-[#5E5E5E] mt-2 max-w-[320px]">
                      {generationStep === 0 && "Reading your uploaded document..."}
                      {generationStep === 1 && "Formulating specific question patterns..."}
                      {generationStep === 2 && "Finalizing grading rubrics & layout..."}
                    </p>
                    <div className="w-[180px] h-[5px] bg-[#F1F1F1] rounded-full overflow-hidden mt-4">
                      <motion.div
                        className="h-full bg-[#1F1F1F]"
                        initial={{ width: "0%" }}
                        animate={{
                          width:
                            generationStep === 0 ? "25%" : generationStep === 1 ? "65%" : "90%",
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-8 w-full"
                    >
                      <div>
                        <h2 className="font-bricolage text-[20px] md:text-[22px] font-bold text-[#1F1F1F] tracking-[-0.02em] leading-normal">
                          Assignment Details
                        </h2>
                        <p className="font-bricolage text-[13px] md:text-[14px] font-normal text-[#8E8E93] mt-0.5 leading-normal">
                          Basic information about your assignment
                        </p>
                      </div>

                      {/* Title input field */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em]">
                          Assignment Name
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Quiz on Electricity"
                          className={`w-full h-[48px] px-4 rounded-[12px] bg-[#F1F1F1] text-[#1F1F1F] font-inter text-[15px] font-medium tracking-tight outline-none border transition-all duration-150 ${errors.title
                              ? "border-red-500/80 focus:border-red-500 bg-red-50/10"
                              : "border-transparent focus:bg-[#EAEAEA] focus:border-[#CCCCCC]"
                            }`}
                        />
                        {errors.title && (
                          <span className="text-[12px] font-medium text-red-500 mt-1 leading-none tracking-tight">
                            {errors.title}
                          </span>
                        )}
                      </div>

                      {/* File Upload Zone */}
                      <FileUploadZone value={file} onChange={setFile} error={errors.file} />

                      {/* Due Date picker */}
                      <DatePicker value={dueDate} onChange={setDueDate} error={errors.dueDate} />

                      {/* Question Types table */}
                      <div className="flex flex-col gap-4">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em]">
                          Question Type Configuration
                        </label>

                        {/* Table Headers */}
                        <div className="hidden md:flex justify-between items-center text-[13px] font-bold text-[#1F1F1F] tracking-[-0.02em] px-0.5 mt-1">
                          <span className="flex-1">Question Type</span>
                          <div className="flex items-center gap-[42px] pr-3">
                            <span>No. of Questions</span>
                            <span className="w-10 text-right">Marks</span>
                          </div>
                        </div>

                        {/* Rows mapping */}
                        <div className="flex flex-col gap-3.5">
                          {questionRows.map((row) => (
                            <QuestionRow
                              key={row.id}
                              row={row}
                              onUpdate={(updates) => updateQuestionRow(row.id, updates)}
                              onDelete={() => deleteQuestionRow(row.id)}
                            />
                          ))}
                        </div>

                        {errors.questionRows && (
                          <p className="text-[12px] font-medium text-red-500 tracking-tight mt-1">
                            {errors.questionRows}
                          </p>
                        )}

                        {/* Add Row CTA */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => addQuestionRow()}
                            className="inline-flex items-center gap-2.5 text-[#1F1F1F] hover:opacity-85 font-bricolage text-[15px] font-bold tracking-[-0.02em] cursor-pointer group"
                          >
                            <div className="w-[32px] h-[32px] rounded-full bg-[#1F1F1F] group-hover:bg-black text-white flex items-center justify-center transition-colors">
                              <Plus size={16} strokeWidth={2.5} />
                            </div>
                            <span>Add Question Type</span>
                          </button>
                        </div>

                        {/* Live Totals Column */}
                        <div className="flex flex-col items-end gap-1 pt-3.5 px-0.5">
                          <span className="font-bricolage text-[15px] font-bold text-[#1F1F1F] tracking-tight leading-normal">
                            Total Questions : {totalQuestions}
                          </span>
                          <span className="font-bricolage text-[15px] font-bold text-[#1F1F1F] tracking-tight leading-normal">
                            Total Marks : {totalMarks}
                          </span>
                        </div>
                      </div>

                      {/* Additional Information voice field */}
                      <div className="flex flex-col gap-2 pt-2">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em]">
                          Additional Information (For better output)
                        </label>
                        <div className="relative">
                          <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                            className="w-full min-h-[100px] md:min-h-[110px] rounded-[20px] bg-[#F1F1F1] text-[#1F1F1F] font-bricolage text-[14px] md:text-[15px] leading-relaxed p-4 pr-12 pb-8 border border-transparent outline-none focus:bg-[#EAEAEA] focus:border-[#CCCCCC] transition-all resize-none placeholder-neutral-400 font-normal"
                          />
                          <button
                            type="button"
                            onClick={handleSpeechInput}
                            className={`absolute right-4 bottom-4 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm transition-all duration-200 cursor-pointer ${isListening
                                ? "bg-red-500 text-white border-red-400 animate-pulse scale-105"
                                : "bg-white text-[#1F1F1F] border-neutral-100 hover:bg-[#F9F9F9]"
                              }`}
                            title={isListening ? "Listening... click to stop" : "Start Voice Input"}
                          >
                            <Mic size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-8 w-full"
                    >
                      <div>
                        <h2 className="font-bricolage text-[20px] md:text-[22px] font-bold text-[#1F1F1F] tracking-[-0.02em] leading-normal">
                          AI Configuration
                        </h2>
                        <p className="font-bricolage text-[13px] md:text-[14px] font-normal text-[#8E8E93] mt-0.5 leading-normal">
                          Configure specific generation rules and output guidelines
                        </p>
                      </div>

                      {/* Difficulty level selection */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em] flex items-center gap-1.5">
                          <Sliders size={16} className="text-[#8E8E93] rotate-90" />
                          <span>Difficulty level</span>
                        </label>
                        <div className="flex items-center gap-2">
                          {["Easy", "Medium", "Hard"].map((level) => {
                            const active = difficulty === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setDifficulty(level)}
                                className={`h-[38px] px-5 rounded-full font-bricolage text-[14px] font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer ${active
                                    ? "bg-[#1F1F1F] text-white shadow-md"
                                    : "bg-[#F1F1F1] text-[#5E5E5E] hover:bg-[#EAEAEA] hover:text-[#1F1F1F]"
                                  }`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Exam Duration */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em] flex items-center gap-1.5">
                          <Calendar size={16} className="text-[#8E8E93]" />
                          <span>Exam duration</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {DURATION_OPTIONS.map((time) => {
                            const active = duration === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setDuration(time)}
                                className={`h-[38px] px-5 rounded-full font-bricolage text-[14px] font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer ${active
                                    ? "bg-[#1F1F1F] text-white shadow-md"
                                    : "bg-[#F1F1F1] text-[#5E5E5E] hover:bg-[#EAEAEA] hover:text-[#1F1F1F]"
                                  }`}
                              >
                                {time}
                              </button>
                            );
                          })}

                          {/* Custom Duration Input */}
                          {duration === "Custom" && (
                            <input
                              type="text"
                              placeholder="e.g. 90 Minutes"
                              value={customDuration}
                              onChange={(e) => setCustomDuration(e.target.value)}
                              className="h-[38px] px-4 rounded-full bg-[#F1F1F1] border border-transparent text-[#1F1F1F] font-bricolage text-[14px] font-medium tracking-tight outline-none focus:bg-white focus:border-neutral-300 max-w-[150px] animate-in slide-in-from-left-2 duration-150"
                            />
                          )}
                        </div>
                      </div>

                      {/* Included Sections checklist */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em] flex items-center gap-1.5">
                          <Sliders size={16} className="text-[#8E8E93]" />
                          <span>Included sections</span>
                        </label>

                        <div className="flex flex-col gap-2.5">
                          {[
                            {
                              title: "Section A - Multiple Choice Questions",
                              desc: "Factual memory and concept checking",
                            },
                            {
                              title: "Section B - Short Questions",
                              desc: "Definitions and short logical explanations",
                            },
                            {
                              title: "Section C - Diagram/Graph-Based Questions",
                              desc: "Visual data interpretation and drawing",
                            },
                            {
                              title: "Section D - Numerical Problems",
                              desc: "Formula applications and logic calculations",
                            },
                          ].map((sec) => {
                            const isIncluded = sections.includes(sec.title);
                            return (
                              <button
                                key={sec.title}
                                type="button"
                                onClick={() => toggleSection(sec.title)}
                                className={`w-full text-left p-4 rounded-[16px] border flex items-center gap-4 transition-all duration-150 cursor-pointer ${isIncluded
                                    ? "bg-white border-[#1F1F1F] shadow-sm"
                                    : "bg-[#FBFBFB]/50 border-neutral-100 hover:bg-[#F5F5F5]/60 hover:border-neutral-200"
                                  }`}
                              >
                                <div className="shrink-0 text-[#1F1F1F]">
                                  {isIncluded ? (
                                    <SquareCheckBig size={20} strokeWidth={2.5} />
                                  ) : (
                                    <Square size={20} className="text-neutral-300" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block font-bricolage text-[14px] md:text-[15px] font-bold text-[#1F1F1F] tracking-tight leading-none">
                                    {sec.title}
                                  </span>
                                  <span className="block font-bricolage text-[12px] font-normal text-[#8E8E93] leading-none mt-1">
                                    {sec.desc}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {errors.sections && (
                          <p className="text-[12px] font-medium text-red-500 tracking-tight mt-1">
                            {errors.sections}
                          </p>
                        )}
                      </div>

                      {/* Output Format options */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em] flex items-center gap-1.5">
                          <FileCode size={16} className="text-[#8E8E93]" />
                          <span>Output Format</span>
                        </label>
                        <div className="flex items-center gap-2">
                          {FORMAT_OPTIONS.map((format) => {
                            const active = outputFormat === format;
                            return (
                              <button
                                key={format}
                                type="button"
                                onClick={() => setOutputFormat(format)}
                                className={`h-[38px] px-5 rounded-full font-bricolage text-[14px] font-semibold tracking-tight transition-all active:scale-[0.98] cursor-pointer ${active
                                    ? "bg-[#1F1F1F] text-white shadow-md"
                                    : "bg-[#F1F1F1] text-[#5E5E5E] hover:bg-[#EAEAEA] hover:text-[#1F1F1F]"
                                  }`}
                              >
                                {format}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BOTTOM BUTTONS ROW */}
              <div className="w-full max-w-[810px] flex justify-between items-center mt-6 pb-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="h-[44px] bg-white hover:bg-neutral-50 text-[#1F1F1F] border border-[#E1E1E1] font-inter font-semibold text-[14px] px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-sm select-none"
                >
                  <ArrowLeft size={16} className="text-[#1F1F1F]" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="h-[44px] bg-[#1F1F1F] hover:bg-black text-white font-inter font-semibold text-[14px] px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg select-none"
                >
                  {currentStep === 2 ? (
                    <>
                      <span>Generate</span>
                      <Sparkles size={16} fill="white" className="shrink-0 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
}

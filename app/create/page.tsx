"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Settings,
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Plus,
  Mic,
  Calendar,
  LoaderCircle,
  Sliders,
  FileCode,
  Search,
  CheckSquare,
  Square,
  SquareCheckBig,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import DatePicker from "@/components/DatePicker";
import UploadBox from "@/components/assignment/UploadBox";
import QuestionRow from "@/components/QuestionRow";
import AssignmentCard from "@/components/AssignmentCard";
import { useAssignmentStore, Assignment } from "./assignmentStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema, AssignmentFormValues } from "@/lib/validations/assignmentSchema";
import { Toaster, toast } from "sonner";

interface GeneratedQuestionPaperViewProps {
  assignment: Assignment;
  handleDownloadPDF: () => void;
  pdfGenerationState: "idle" | "generating" | "success" | "error";
}

function GeneratedQuestionPaperView({
  assignment,
  handleDownloadPDF,
  pdfGenerationState,
}: GeneratedQuestionPaperViewProps) {
  return (
    <div className="w-full flex flex-col gap-6 select-none animate-in fade-in slide-in-from-bottom-4 duration-250">
      {/* AI Response Banner */}
      <div className="w-full bg-[#1F1F1F] rounded-[16px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white font-bricolage">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] md:text-[15px] font-normal leading-relaxed tracking-tight text-neutral-200">
            Certainly, Lakshya! Here is the customized{" "}
            <span className="font-bold text-white">Question Paper</span> for your{" "}
            CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={pdfGenerationState === "generating"}
          className="h-[42px] bg-white hover:bg-neutral-100 text-black font-inter font-bold text-[13px] px-5 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-md shrink-0 disabled:opacity-60 disabled:cursor-not-allowed select-none"
        >
          {pdfGenerationState === "generating" ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin text-black" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <FileText size={16} className="text-black animate-bounce" />
              <span>Download as PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Print-Ready Exam Sheet Card */}
      <div
        id="question-paper-print"
        className="w-full bg-white rounded-[24px] p-8 md:p-10 flex flex-col gap-6 relative border border-[#EBEBEB] text-[#1F1F1F]"
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
  );
}

export default function CreateAssignmentPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Filter dropdown state
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Zustand Store hooks
  const {
    isCreating,
    currentStep,
    assignments,
    searchQuery,
    filterDifficulty,
    filterFormat,
    title,
    generatedAssignment,
    pdfGenerationState,
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
    setCreating,
    setStep,
    setTitle,
    setGeneratedAssignment,
    setPdfGenerationState,
    setFile,
    setDueDate,
    setAdditionalInfo,
    setSearchQuery,
    setFilterDifficulty,
    setFilterFormat,
    deleteAssignment,
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

  // Initialize React Hook Form with Zod validation resolver
  const {
    register,
    setValue,
    watch,
    formState: { errors: formErrors, isValid },
    trigger,
    reset: resetFormValues,
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    mode: "onChange",
    defaultValues: {
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
    },
  });

  // Keep react-hook-form in sync when creating/resetting from store
  useEffect(() => {
    resetFormValues({
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
    });
  }, [isCreating, resetFormValues]);

  // Sync dynamic nested arrays
  useEffect(() => {
    setValue("questionRows", questionRows, { shouldValidate: true });
  }, [questionRows, setValue]);

  useEffect(() => {
    setValue("sections", sections, { shouldValidate: true });
  }, [sections, setValue]);

  // Navigation Items
  const menuItems = [
    { name: "Home", icon: LayoutGrid, type: "lucide", active: false },
    { name: "My Groups", icon: "/mygroup.png", type: "custom", active: false },
    { name: "Assignments", icon: FileText, type: "lucide", active: true },
    { name: "AI Teacher's Toolkit", icon: "/toolkit.png", type: "custom", active: false },
    { name: "My Library", icon: "/mylibrary.png", type: "custom", active: false },
  ];

  // Close dropdown menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Live Totals Calculations
  const totalQuestions = questionRows.reduce((sum, row) => sum + row.numQuestions, 0);
  const totalMarks = questionRows.reduce((sum, row) => sum + row.numQuestions * row.marks, 0);

  const handlePrev = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    } else {
      setCreating(false);
      resetForm();
    }
  };

  const handleCreateNewClick = () => {
    setCreating(true);
    resetForm();
    setGeneratedAssignment(null);
  };

  const handleDownloadPDF = async () => {
    if (generatedAssignment) {
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
          filename: `${generatedAssignment.title.replace(/\s+/g, "_")}_Question_Paper.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2.5, useCORS: true, logging: false, letterRendering: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        await html2pdf().set(opt as any).from(element).save();
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

  // Filtered Assignments
  const filteredAssignments = assignments.filter((asm) => {
    const matchesSearch =
      asm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asm.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === "All" || asm.difficulty === filterDifficulty;
    const matchesFormat = filterFormat === "All" || asm.outputFormat === filterFormat;

    return matchesSearch && matchesDifficulty && matchesFormat;
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between font-bricolage">
      {/* Top Part */}
      <div className="flex flex-col">
        {/* Logo */}
        <Logo className="pl-1" />

        {/* Create Assignment Button (Uses Inter Font explicitly) */}
        <button
          className="w-full mt-7 h-[48px] rounded-full text-white create-assignment-glow text-[16px] font-medium font-inter tracking-[-0.04em] leading-[28px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
          onClick={handleCreateNewClick}
        >
          <Sparkles size={16} fill="white" className="shrink-0" />
          <span>Create Assignment</span>
        </button>

        {/* Navigation links */}
        <nav className="mt-8 flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Assignments") {
                  setCreating(false);
                  resetForm();
                } else {
                  alert(`Navigating to ${item.name}...`);
                }
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] transition-all duration-150 text-left font-bricolage text-[16px] font-normal tracking-[-0.04em] leading-[1.4] cursor-pointer ${item.active && !isCreating
                ? "bg-[#F1F1F1] text-[#1F1F1F]"
                : "text-[#5E5E5E] hover:bg-[#F9F9F9] hover:text-[#1F1F1F]"
                }`}
            >
              {item.type === "custom" ? (
                <img
                  src={item.icon as string}
                  alt={item.name}
                  className={`w-[18px] h-[18px] object-contain shrink-0 transition-opacity duration-150 ${item.active && !isCreating ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                />
              ) : (
                React.createElement(item.icon as React.ComponentType<any>, {
                  size: 18,
                  className: `shrink-0 ${item.active && !isCreating ? "text-[#1F1F1F]" : "text-[#8E8E93]"
                    }`,
                })
              )}
              <span className="flex-1">{item.name}</span>

              {item.name === "Assignments" && assignments.length > 0 && (
                <span className="bg-[#FF5029] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 tracking-normal font-inter transition-all duration-300">
                  {assignments.length}
                </span>
              )}

              {item.name === "My Library" && (
                <span className="bg-[#FF5029] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 tracking-normal font-inter">
                  32
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Part */}
      <div className="flex flex-col gap-4">
        {/* Settings */}
        <button
          onClick={() => alert("Settings clicked...")}
          className="w-full flex items-center gap-3 px-4 py-2 text-left font-bricolage text-[16px] font-normal tracking-[-0.04em] leading-[1.4] text-[#5E5E5E] hover:bg-[#F9F9F9] hover:text-[#1F1F1F] transition-all duration-150 cursor-pointer"
        >
          <Settings size={18} className="shrink-0 text-[#8E8E93]" />
          <span>Settings</span>
        </button>

        {/* School Profile Card */}
        <div className="bg-[#F1F1F1] rounded-[16px] p-3.5 flex items-center gap-3 card-shadow hover:bg-[#EAEAEA] transition-colors duration-200 cursor-pointer">
          <div className="w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 bg-neutral-200">
            <img
              src="/Avatar.png"
              alt="Delhi Public School Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bricolage text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em] truncate">
              Delhi Public School
            </span>
            <span className="font-bricolage text-[12px] font-normal text-[#7E7E7E] leading-normal truncate">
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const DURATION_OPTIONS = ["1 Hour", "2 Hours", "3 Hours", "Custom"];
  const FORMAT_OPTIONS = ["PDF Document", "Word Document (.docx)", "Google Forms"];

  const handleNext = async () => {
    if (currentStep === 1) {
      const isStep1Valid = await trigger(["title", "file", "dueDate", "questionRows"]);
      if (isStep1Valid) {
        setStep(2);
      } else {
        toast.error("Please complete the required fields and resolve errors.");
      }
    } else if (currentStep === 2) {
      const isStep2Valid = await trigger(["sections", "difficulty", "duration", "outputFormat"]);
      if (isStep2Valid) {
        setIsGenerating(true);
        setGenerationStep(0);
        toast.loading("Generating your assessment...", { id: "gen-toast" });

        const t1 = setTimeout(() => {
          setGenerationStep(1);
        }, 1200);
        
        const t2 = setTimeout(() => {
          setGenerationStep(2);
        }, 2600);

        const t3 = setTimeout(() => {
          createAssignment();
          setIsGenerating(false);
          toast.dismiss("gen-toast");
          toast.success("Assignment successfully generated!");
        }, 4200);

      } else {
        toast.error("Please select at least one section to include.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E2E2E2] flex items-center justify-center p-0 md:p-6 overflow-y-auto overflow-x-hidden font-bricolage">
      <Toaster position="top-center" richColors />
      <div className="w-full min-h-screen md:min-h-0 md:w-[1440px] md:h-[780px] md:min-w-[1440px] md:max-h-[780px] bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] md:rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row p-3 gap-3">
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="hidden md:flex flex-col w-[304px] h-[756px] bg-white rounded-[16px] p-6 card-shadow shrink-0">
          <SidebarContent />
        </aside>

        {/* MOBILE SIDEBAR DRAWERS */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer Container */}
            <aside className="relative flex flex-col w-[280px] h-full bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#1F1F1F]" />
              </button>
              <div className="h-full pt-4">
                <SidebarContent />
              </div>
            </aside>
          </div>
        )}

        {/* RIGHT CONTENT COLUMN */}
        <div className="flex flex-col flex-1 h-full md:h-[756px] gap-[22px] min-w-0 relative">
          {/* TOP NAVBAR */}
          <header className="w-full h-[56px] bg-white rounded-[16px] pl-6 pr-3 flex items-center justify-between navbar-shadow shrink-0">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <Menu size={20} className="text-[#1F1F1F]" />
              </button>

              {/* Back Arrow Button */}
              <button
                onClick={() => {
                  if (generatedAssignment) {
                    setGeneratedAssignment(null);
                    setCreating(false);
                    resetForm();
                  } else if (isCreating) {
                    handlePrev();
                  } else {
                    setCreating(false);
                    resetForm();
                  }
                }}
                className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer shrink-0 border border-neutral-100/50"
              >
                <ArrowLeft size={18} className="text-[#1F1F1F]" />
              </button>

              {/* Page Identity */}
              <div className="flex items-center gap-2">
                {generatedAssignment ? (
                  <>
                    <Sparkles size={16} className="text-[#8E8E93] shrink-0" />
                    <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                      Create New
                    </span>
                  </>
                ) : (
                  <>
                    <LayoutGrid size={18} className="text-[#8E8E93] shrink-0" />
                    <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                      Assignment
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button
                onClick={() => alert("No new notifications")}
                className="w-9 h-9 flex items-center justify-center hover:bg-[#F1F1F1] rounded-full relative transition-all duration-200 cursor-pointer"
              >
                <Bell size={18} className="text-[#1F1F1F]" />
                <span className="absolute top-[8px] right-[8px] w-[7px] h-[7px] bg-[#FF5029] rounded-full border border-white" />
              </button>

              {/* User Dropdown Capsule */}
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
          <main
            className={`w-full flex-1 min-h-0 md:h-[678px] md:max-h-[678px] ${generatedAssignment
              ? "flex flex-col bg-[#4A4A4A] rounded-[24px] p-6 overflow-y-auto thin-scrollbar"
              : "overflow-y-auto pr-1 pb-6 md:pb-6 thin-scrollbar"
              }`}
          >
            {generatedAssignment ? (
              <GeneratedQuestionPaperView
                assignment={generatedAssignment}
                handleDownloadPDF={handleDownloadPDF}
                pdfGenerationState={pdfGenerationState}
              />
            ) : isCreating ? (
              /* Create Assignment Form Wizard */
              <div className="w-full px-4 pt-1 pb-10 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
                {/* Form Title & Subtitle Header */}
                <div className="w-full max-w-[810px] flex items-start gap-3">
                  {/* Status Ring Glow indicator */}
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

                {/* Progress Bar Segmented */}
                <div className="w-full max-w-[810px] flex items-center gap-2.5 px-0.5">
                  <div className="h-[3px] flex-1 rounded-full bg-[#1F1F1F] transition-all duration-300" />
                  <div
                    className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-[#1F1F1F]" : "bg-[#CCCCCC]/60"
                      }`}
                  />
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
                        {/* Section Header */}
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
                            onChange={(e) => {
                              setTitle(e.target.value);
                              setValue("title", e.target.value, { shouldValidate: true });
                            }}
                            placeholder="e.g. Quiz on Electricity"
                            className={`w-full h-[48px] px-4 rounded-[12px] bg-[#F1F1F1] text-[#1F1F1F] font-inter text-[15px] font-medium tracking-tight outline-none border transition-all duration-150 ${
                              formErrors.title || errors.title
                                ? "border-red-500/80 focus:border-red-500 bg-red-50/10"
                                : "border-transparent focus:bg-[#EAEAEA] focus:border-[#CCCCCC]"
                            }`}
                          />
                          {(formErrors.title || errors.title) && (
                            <span className="text-[12px] font-medium text-red-500 mt-1 leading-none tracking-tight">
                              {formErrors.title?.message || errors.title}
                            </span>
                          )}
                        </div>

                        {/* File Upload Zone */}
                        <UploadBox
                          value={file}
                          onChange={(uploadedFile) => {
                            setFile(uploadedFile);
                            setValue("file", uploadedFile, { shouldValidate: true });
                          }}
                          error={formErrors.file?.message || errors.file}
                        />

                        {/* Due Date picker */}
                        <DatePicker
                          value={dueDate}
                          onChange={(dateStr) => {
                            setDueDate(dateStr);
                            setValue("dueDate", dateStr, { shouldValidate: true });
                          }}
                          error={formErrors.dueDate?.message || errors.dueDate}
                        />

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

                          {(formErrors.questionRows || errors.questionRows) && (
                            <p className="text-[12px] font-medium text-red-500 tracking-tight mt-1">
                              {formErrors.questionRows?.message || errors.questionRows}
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
                        {/* Section Header */}
                        <div>
                          <h2 className="font-bricolage text-[20px] md:text-[22px] font-bold text-[#1F1F1F] tracking-[-0.02em] leading-normal">
                            AI Configuration
                          </h2>
                          <p className="font-bricolage text-[13px] md:text-[14px] font-normal text-[#8E8E93] mt-0.5 leading-normal">
                            Configure specific generation rules and output guidelines
                          </p>
                        </div>

                        {/* Difficulty level selection (Easy, Medium, Hard pills) */}
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

                          {(formErrors.sections || errors.sections) && (
                            <p className="text-[12px] font-medium text-red-500 tracking-tight mt-1">
                              {formErrors.sections?.message || errors.sections}
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
                  {/* Previous button */}
                  <button
                    onClick={handlePrev}
                    className="h-[44px] bg-white hover:bg-neutral-50 text-[#1F1F1F] border border-[#E1E1E1] font-inter font-semibold text-[14px] px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-sm select-none"
                  >
                    <ArrowLeft size={16} className="text-[#1F1F1F]" />
                    <span>Previous</span>
                  </button>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    disabled={
                      currentStep === 1
                        ? !title || !file || !dueDate || questionRows.length === 0 || !!formErrors.title || !!formErrors.dueDate || !!formErrors.file
                        : sections.length === 0 || !!formErrors.sections
                    }
                    className="h-[44px] bg-[#1F1F1F] hover:bg-black text-white font-inter font-semibold text-[14px] px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg select-none disabled:opacity-50 disabled:cursor-not-allowed"
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
            ) : (
              /* Dashboard Filled State */
              <div className="w-full h-full flex flex-col">
                {assignments.length === 0 ? (
                  /* Empty state dashboard */
                  <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src="/Illustrations.png"
                      alt="No assignments yet illustration"
                      className="w-[260px] h-auto object-contain animate-in fade-in zoom-in duration-300"
                    />
                    <h2 className="mt-8 font-bricolage text-[24px] font-bold text-[#1F1F1F] tracking-[-0.02em] leading-normal">
                      No assignments yet
                    </h2>
                    <p className="mt-2.5 font-bricolage text-[14px] font-normal text-[#5E5E5E] leading-[21px] max-w-[440px]">
                      Create your first assignment to start collecting and grading student submissions.
                      You can set up rubrics, define marking criteria, and let AI assist with grading.
                    </p>
                    <button
                      className="mt-8 bg-black hover:bg-[#1A1A1A] active:scale-[0.98] text-white font-inter font-medium text-[15px] px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                      onClick={handleCreateNewClick}
                    >
                      <Plus size={16} strokeWidth={2.5} className="shrink-0" />
                      <span>Create Your First Assignment</span>
                    </button>
                  </div>
                ) : (
                  /* Filled state dashboard */
                  <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
                    {/* Header title */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#34C759]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h1 className="font-bricolage text-[20px] md:text-[22px] font-bold text-[#1F1F1F] tracking-[-0.03em] leading-none">
                          Assignments
                        </h1>
                        <p className="font-inter text-[13px] md:text-[14px] font-normal text-[#7E7E7E] leading-normal tracking-tight">
                          Manage and create assignments for your classes.
                        </p>
                      </div>
                    </div>

                    {/* Filter & Search Capsule row */}
                    <div className="w-full max-w-[1100px] bg-white border border-[#EBEBEB] rounded-[16px] px-4 py-2 flex items-center justify-between shadow-sm relative z-40 gap-4">
                      {/* Filter capsule dropdown */}
                      <div className="relative" ref={filterMenuRef}>
                        <button
                          type="button"
                          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                          className="flex items-center gap-2 text-neutral-400 hover:text-black font-semibold text-[13px] md:text-[14px] transition-colors cursor-pointer p-1.5"
                        >
                          <Sliders size={16} className="rotate-90 text-[#8E8E93]" />
                          <span>Filter By</span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${isFilterMenuOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {isFilterMenuOpen && (
                          <div className="absolute left-0 top-10 w-[240px] bg-white rounded-[16px] p-3 border border-neutral-100 shadow-2xl z-[999] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-100">
                            {/* Filter Difficulty */}
                            <div>
                              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                                Difficulty
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setFilterDifficulty("All")}
                                  className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${filterDifficulty === "All"
                                    ? "bg-[#1F1F1F] text-white"
                                    : "bg-[#F1F1F1] text-neutral-500 hover:bg-[#EAEAEA]"
                                    }`}
                                >
                                  All
                                </button>
                                {["Easy", "Medium", "Hard"].map((level) => (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFilterDifficulty(level)}
                                    className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${filterDifficulty === level
                                      ? "bg-[#1F1F1F] text-white"
                                      : "bg-[#F1F1F1] text-neutral-500 hover:bg-[#EAEAEA]"
                                      }`}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <hr className="border-neutral-100" />

                            {/* Filter Format */}
                            <div>
                              <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                                Output Format
                              </span>
                              <div className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => setFilterFormat("All")}
                                  className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg text-left ${filterFormat === "All"
                                    ? "bg-[#1F1F1F] text-white"
                                    : "hover:bg-[#F1F1F1] text-neutral-600"
                                    }`}
                                >
                                  All Formats
                                </button>
                                {DURATION_OPTIONS.slice(0, 3).map((_, idx) => {
                                  const format = FORMAT_OPTIONS[idx];
                                  return (
                                    <button
                                      key={format}
                                      type="button"
                                      onClick={() => setFilterFormat(format)}
                                      className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg text-left truncate ${filterFormat === format
                                        ? "bg-[#1F1F1F] text-white"
                                        : "hover:bg-[#F1F1F1] text-neutral-600"
                                        }`}
                                    >
                                      {format}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Search box input */}
                      <div className="relative flex items-center min-w-0">
                        <Search
                          size={16}
                          className="absolute left-3 text-neutral-400 shrink-0 pointer-events-none"
                        />
                        <input
                          type="text"
                          placeholder="Search Assignment"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-[36px] pl-9 pr-4 rounded-full bg-[#F1F1F1] text-black placeholder-neutral-400 text-[13px] font-medium outline-none border border-transparent focus:border-neutral-300 w-[160px] md:w-[220px] focus:w-[260px] transition-all"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 text-neutral-400 hover:text-black p-0.5"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dashboard grid cards */}
                    <div className="w-full max-w-[1100px] mx-auto pb-24 md:pb-24">
                      {filteredAssignments.length === 0 ? (
                        /* Filters returned nothing empty state */
                        <div className="w-full py-16 bg-white border border-[#EBEBEB] rounded-[24px] flex flex-col items-center justify-center p-6 text-center shadow-sm">
                          <Search size={36} className="text-neutral-300 mb-3 animate-pulse" />
                          <h4 className="font-bricolage text-[16px] font-bold text-[#1F1F1F] tracking-tight">
                            No assignments match your criteria
                          </h4>
                          <p className="text-[13px] text-[#8E8E93] mt-1 max-w-[280px] leading-relaxed">
                            Try adjusting your filters or keyword query to find other classes.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setFilterDifficulty("All");
                              setFilterFormat("All");
                            }}
                            className="mt-4 text-[13px] font-bold text-black border border-neutral-300 hover:bg-neutral-50 px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
                          >
                            Reset Filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                          {filteredAssignments.map((assignment) => (
                            <AssignmentCard
                              key={assignment.id}
                              assignment={assignment}
                              onDelete={deleteAssignment}
                              onView={(asm) => setGeneratedAssignment(asm)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Floating Bottom CTA Bar */}
                    <div className="absolute bottom-3 left-0 right-0 h-[80px] bg-gradient-to-t from-[#EEEEEE]/95 via-[#EEEEEE]/40 to-transparent backdrop-blur-[2px] flex items-center justify-center z-40 max-w-[1100px] mx-auto rounded-b-[24px] pointer-events-none select-none">
                      <button
                        onClick={handleCreateNewClick}
                        className="h-[44px] bg-[#1F1F1F] hover:bg-black text-white font-inter font-semibold text-[14px] px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg pointer-events-auto select-none"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Create Assignment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

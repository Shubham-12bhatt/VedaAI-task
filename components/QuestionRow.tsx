"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Minus, Plus } from "lucide-react";
import { QuestionRowType } from "@/app/create/assignmentStore";

interface QuestionRowProps {
  row: QuestionRowType;
  onUpdate: (updates: Partial<Omit<QuestionRowType, "id">>) => void;
  onDelete: () => void;
}

const QUESTION_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Essay-Based Questions",
  "True/False Questions",
];

export default function QuestionRow({ row, onUpdate, onDelete }: QuestionRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTypeSelect = (type: string) => {
    onUpdate({ type });
    setIsOpen(false);
  };

  const handleDecrementQuestions = () => {
    if (row.numQuestions > 1) {
      onUpdate({ numQuestions: row.numQuestions - 1 });
    }
  };

  const handleIncrementQuestions = () => {
    onUpdate({ numQuestions: row.numQuestions + 1 });
  };

  const handleDecrementMarks = () => {
    if (row.marks > 1) {
      onUpdate({ marks: row.marks - 1 });
    }
  };

  const handleIncrementMarks = () => {
    onUpdate({ marks: row.marks + 1 });
  };

  return (
    <div 
      className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 font-bricolage text-[#1F1F1F] relative"
      style={{ zIndex: isOpen ? 50 : 1 }}
    >
      
      {/* Column 1: Dropdown & Delete Icon */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        
        {/* Custom Dropdown Selector */}
        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-[46px] px-4 rounded-[14px] bg-[#F8F8F8] border border-[#EBEBEB] hover:bg-[#F2F2F2] flex items-center justify-between text-left transition-all duration-150 cursor-pointer"
          >
            <span className="font-bricolage text-[14px] md:text-[15px] font-semibold tracking-[-0.02em] truncate pr-2 text-[#1F1F1F]">
              {row.type}
            </span>
            <ChevronDown size={16} className={`text-[#8E8E93] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-185" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-[52px] z-[9999] bg-white border border-[#EBEBEB] rounded-[16px] p-1.5 shadow-xl max-h-[220px] overflow-y-auto animate-in fade-in-50 slide-in-from-top-2 duration-100">
              {QUESTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`w-full text-left px-3 py-2 rounded-[10px] font-bricolage text-[14px] tracking-[-0.02em] font-medium transition-colors ${
                    row.type === type
                      ? "bg-[#1F1F1F] text-white"
                      : "text-[#5E5E5E] hover:bg-[#F1F1F1] hover:text-[#1F1F1F]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete Row X Button */}
        <button
          type="button"
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-red-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* Steppers Column Wrapper (aligned right on desktop) */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Column 2: No. of Questions Stepper */}
        <div className="w-[104px] h-[46px] rounded-[14px] bg-[#F8F8F8] border border-[#EBEBEB] flex items-center justify-between px-2 shrink-0">
          <button
            type="button"
            onClick={handleDecrementQuestions}
            disabled={row.numQuestions <= 1}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
              row.numQuestions <= 1
                ? "text-[#C7C7CC] cursor-not-allowed"
                : "text-[#5E5E5E] hover:bg-[#ECECEC] hover:text-[#1F1F1F] cursor-pointer"
            }`}
          >
            <Minus size={14} />
          </button>
          
          <span className="font-inter text-[15px] font-bold text-[#1F1F1F] w-6 text-center select-none">
            {row.numQuestions}
          </span>
          
          <button
            type="button"
            onClick={handleIncrementQuestions}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#5E5E5E] hover:bg-[#ECECEC] hover:text-[#1F1F1F] transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Column 3: Marks Stepper */}
        <div className="w-[104px] h-[46px] rounded-[14px] bg-[#F8F8F8] border border-[#EBEBEB] flex items-center justify-between px-2 shrink-0">
          <button
            type="button"
            onClick={handleDecrementMarks}
            disabled={row.marks <= 1}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
              row.marks <= 1
                ? "text-[#C7C7CC] cursor-not-allowed"
                : "text-[#5E5E5E] hover:bg-[#ECECEC] hover:text-[#1F1F1F] cursor-pointer"
            }`}
          >
            <Minus size={14} />
          </button>
          
          <span className="font-inter text-[15px] font-bold text-[#1F1F1F] w-6 text-center select-none">
            {row.marks}
          </span>
          
          <button
            type="button"
            onClick={handleIncrementMarks}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#5E5E5E] hover:bg-[#ECECEC] hover:text-[#1F1F1F] transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

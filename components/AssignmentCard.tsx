"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import { Assignment } from "@/app/create/assignmentStore";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
  onView: (assignment: Assignment) => void;
}

export default function AssignmentCard({ assignment, onDelete, onView }: AssignmentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(assignment.id);
    setIsMenuOpen(false);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(assignment);
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full max-w-[542px] h-[162px] bg-white border border-[#EBEBEB] rounded-[24px] p-6 card-shadow flex flex-col justify-between relative transition-all duration-150 hover:border-neutral-300 font-bricolage select-none">
      
      {/* Top Section: Title & 3-Dot Menu */}
      <div className="flex items-start justify-between">
        <h3 
          onClick={() => onView(assignment)}
          className="font-bricolage text-[18px] md:text-[20px] font-bold text-[#1F1F1F] tracking-tight leading-tight cursor-pointer truncate max-w-[80%]"
        >
          {assignment.title}
        </h3>
        
        {/* Menu Wrapper */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-[#1F1F1F] hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>

          {/* Options Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-9 w-[150px] bg-white rounded-[16px] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[#EBEBEB] z-[999] flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={handleViewClick}
                className="w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-semibold text-[#1F1F1F] hover:bg-[#F5F5F5] cursor-pointer transition-colors"
              >
                View Assignment
              </button>
              
              <button
                type="button"
                onClick={handleDeleteClick}
                className="w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-bold text-[#FF3B30] bg-[#F5F5F5] hover:bg-[#EAEAEA] cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle/Bottom Space Spacer */}
      <div className="flex-1" />

      {/* Bottom Section: Assigned & Due Dates */}
      <div className="flex items-center justify-between text-[13px] tracking-tight">
        {/* Assigned Date */}
        <div>
          <span className="text-[#1F1F1F] font-bold">Assigned on : </span>
          <span className="text-[#8E8E93] font-medium">{assignment.createdAt}</span>
        </div>

        {/* Due Date */}
        <div>
          <span className="text-[#1F1F1F] font-bold">Due : </span>
          <span className="text-[#8E8E93] font-medium">{assignment.dueDate}</span>
        </div>
      </div>
    </div>
  );
}

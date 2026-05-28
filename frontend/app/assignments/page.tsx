"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  Plus,
  Sliders,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AssignmentCard from "@/components/AssignmentCard";
import { useAssignmentStore } from "@/app/assignments/assignmentStore";

export default function AssignmentsDashboardPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const {
    assignments,
    searchQuery,
    filterDifficulty,
    filterFormat,
    setSearchQuery,
    setFilterDifficulty,
    setFilterFormat,
    deleteAssignment,
    setCreating,
    resetForm,
    fetchAssignments,
  } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Close filter dropdown on click outside
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

  const handleCreateNewClick = () => {
    setCreating(true);
    resetForm();
    router.push("/assignments/create");
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
                <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
              </div>
            </aside>
          </div>
        )}

      {/* RIGHT CONTENT COLUMN */}
      <div className="flex flex-col flex-1 h-full gap-[22px] min-w-0 relative">

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

              {/* Page Identity */}
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-[#8E8E93] shrink-0" />
                <span className="font-bricolage text-[16px] font-normal tracking-[-0.04em] text-[#8E8E93] leading-none">
                  Assignment
                </span>
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
        <main className="w-full flex-1 min-h-0 overflow-y-auto pr-1 pb-6 md:pb-6 thin-scrollbar">

            {assignments.length === 0 ? (
              /* Empty state dashboard */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
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
              <div className="w-full max-w-[1100px] flex flex-col gap-6 animate-in fade-in duration-200">
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
                        className={`transition-transform duration-200 ${isFilterMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isFilterMenuOpen && (
                      <div className="absolute left-0 top-10 w-[240px] bg-white rounded-[16px] p-3 border border-neutral-100 shadow-2xl z-[999] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-100 animate-duration-100">
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
                          onView={(asm) => router.push(`/assignments/output/${asm.id}`)}
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
          </main>
        </div>
      </div>
    );
}

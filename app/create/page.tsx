"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  FileText,
  Settings,
  ArrowLeft,
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Plus,
} from "lucide-react";
import Logo from "@/components/Logo";
import EmptyStateIllustration from "@/components/EmptyStateIllustration";

export default function CreateAssignmentPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menu items with custom image paths for the user-supplied assets
  const menuItems = [
    { name: "Home", icon: LayoutGrid, type: "lucide", active: false },
    { name: "My Groups", icon: "/mygroup.png", type: "custom", active: false },
    { name: "Assignments", icon: FileText, type: "lucide", active: true },
    { name: "AI Teacher's Toolkit", icon: "/toolkit.png", type: "custom", active: false },
    { name: "My Library", icon: "/mylibrary.png", type: "custom", active: false },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between font-bricolage">
      {/* Top Part */}
      <div className="flex flex-col">
        {/* Logo */}
        <Logo className="pl-1" />

        {/* Create Assignment Button (Uses Inter Font explicitly) */}
        <button
          className="w-full mt-7 h-[48px] rounded-full text-white create-assignment-glow text-[16px] font-medium font-inter tracking-[-0.04em] leading-[28px] flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => alert("Creating a new assignment...")}
        >
          <Sparkles size={16} fill="white" className="shrink-0" />
          <span>Create Assignment</span>
        </button>

        {/* Menu Items */}
        <nav className="mt-8 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            return (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] transition-all duration-150 text-left font-bricolage text-[16px] font-normal tracking-[-0.04em] leading-[1.4] cursor-pointer ${
                  item.active
                    ? "bg-[#F1F1F1] text-[#1F1F1F]"
                    : "text-[#5E5E5E] hover:bg-[#F9F9F9] hover:text-[#1F1F1F]"
                }`}
              >
                {item.type === "custom" ? (
                  <img
                    src={item.icon as string}
                    alt={item.name}
                    className={`w-[18px] h-[18px] object-contain shrink-0 transition-opacity duration-150 ${
                      item.active ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ) : (
                  // Lucide Icon fallback (React Component)
                  React.createElement(item.icon as React.ComponentType<any>, {
                    size: 18,
                    className: `shrink-0 ${item.active ? "text-[#1F1F1F]" : "text-[#8E8E93]"}`,
                  })
                )}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part */}
      <div className="flex flex-col gap-4">
        {/* Settings */}
        <button className="w-full flex items-center gap-3 px-4 py-2 text-left font-bricolage text-[16px] font-normal tracking-[-0.04em] leading-[1.4] text-[#5E5E5E] hover:bg-[#F9F9F9] hover:text-[#1F1F1F] transition-all duration-150 cursor-pointer">
          <Settings size={18} className="shrink-0 text-[#8E8E93]" />
          <span>Settings</span>
        </button>

        {/* School Profile Card */}
        <div className="bg-[#F1F1F1] rounded-[16px] p-3.5 flex items-center gap-3 card-shadow hover:bg-[#EAEAEA] transition-colors duration-200 cursor-pointer">
          <div className="w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 bg-neutral-200">
            {/* Render user-supplied Avatar */}
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EEEEEE] to-[#DADADA] flex flex-col md:flex-row p-3 gap-3 overflow-auto md:overflow-hidden font-bricolage">
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-[304px] h-[calc(100vh-24px)] bg-white rounded-[16px] p-6 card-shadow shrink-0">
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
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full transition-colors"
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
      <div className="flex flex-col flex-1 h-full md:h-[calc(100vh-24px)] gap-[22px] min-w-0">
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
            <button className="p-1.5 hover:bg-[#F1F1F1] rounded-full transition-colors cursor-pointer flex items-center justify-center">
              <ArrowLeft size={18} className="text-[#1F1F1F]" />
            </button>

            {/* Divider / Spacer */}
            <span className="w-[1px] h-[16px] bg-neutral-200 hidden md:block" />

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
            <button className="w-9 h-9 flex items-center justify-center hover:bg-[#F1F1F1] rounded-full relative transition-all duration-200 cursor-pointer">
              <Bell size={18} className="text-[#1F1F1F]" />
              {/* Red/Orange active status dot */}
              <span className="absolute top-[8px] right-[8px] w-[7px] h-[7px] bg-[#FF5029] rounded-full border border-white" />
            </button>

            {/* User Dropdown Capsule */}
            <div className="bg-[#F1F1F1] hover:bg-[#EAEAEA] p-1 pl-1.5 pr-3 h-[38px] rounded-full flex items-center gap-2.5 cursor-pointer transition-colors duration-200">
              <div className="w-[28px] h-[28px] rounded-full overflow-hidden shrink-0 bg-neutral-200">
                {/* Render user-supplied Avatar */}
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

        {/* MAIN CONTENT AREA / EMPTY STATE */}
        <main className="w-full flex-1 md:h-[calc(100vh-102px)] flex flex-col items-center justify-center p-6 shrink-0 relative">
          <div className="flex flex-col items-center max-w-[480px] text-center">
            {/* Custom Empty State Illustration */}
            <img
              src="/Illustrations.png"
              alt="No assignments yet illustration"
              className="w-[280px] h-auto object-contain animate-in fade-in zoom-in duration-300"
            />

            {/* Header */}
            <h2 className="mt-8 font-bricolage text-[24px] font-bold text-[#1F1F1F] tracking-[-0.02em] leading-normal">
              No assignments yet
            </h2>

            {/* Description */}
            <p className="mt-2.5 font-bricolage text-[14px] font-normal text-[#5E5E5E] leading-[21px] max-w-[440px]">
              Create your first assignment to start collecting and grading student
              submissions. You can set up rubrics, define marking criteria, and let AI
              assist with grading.
            </p>

            {/* CTA Button (Uses Inter Font explicitly) */}
            <button
              className="mt-8 bg-black hover:bg-[#1A1A1A] active:scale-[0.98] text-white font-inter font-medium text-[15px] px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => alert("Creating your first assignment...")}
            >
              <Plus size={16} strokeWidth={2.5} className="shrink-0" />
              <span>Create Your First Assignment</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

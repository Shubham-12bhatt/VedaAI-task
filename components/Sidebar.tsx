"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, FileText, Settings, Sparkles, BarChart2 } from "lucide-react";
import Logo from "@/components/Logo";
import { useAssignmentStore } from "@/app/assignments/assignmentStore";

interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export default function Sidebar({ className = "", onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { assignments } = useAssignmentStore();

  // Show assignment count badge ONLY on assignment-related pages
  const isAssignmentPage = pathname?.startsWith("/assignments");
  const assignmentCount = assignments.length;

  const handleCreateAssignmentClick = () => {
    router.push("/assignments/create");
    if (onCloseMobile) onCloseMobile();
  };

  const handleMenuItemClick = (name: string) => {
    if (name === "Assignments") {
      router.push("/assignments");
    } else {
      alert(`Navigating to ${name}...`);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const menuItems = [
    { name: "Home", icon: LayoutGrid, type: "lucide" as const },
    { name: "My Classes", icon: "/mygroup.png", type: "custom" as const },
    { name: "Assignments", icon: FileText, type: "lucide" as const },
    { name: "Analytics", icon: "/toolkit.png", type: "custom" as const },
    { name: "My Library", icon: "/mylibrary.png", type: "custom" as const },
  ];

  return (
    <div className={`flex flex-col h-full justify-between font-bricolage select-none ${className}`}>
      {/* Top Part */}
      <div className="flex flex-col">
        {/* Logo */}
        <Logo className="pl-1" />

        {/* Create Assignment Button (Uses Inter Font explicitly) */}
        <button
          className="w-full mt-7 h-[48px] rounded-full text-white create-assignment-glow text-[16px] font-medium font-inter tracking-[-0.04em] leading-[28px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]"
          onClick={handleCreateAssignmentClick}
        >
          <Sparkles size={16} fill="white" className="shrink-0" />
          <span>Create Assignment</span>
        </button>

        {/* Navigation links */}
        <nav className="mt-8 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isAssignmentsTab = item.name === "Assignments";
            // Check if active
            const isActive = isAssignmentsTab && isAssignmentPage;

            return (
              <button
                key={item.name}
                onClick={() => handleMenuItemClick(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] transition-all duration-150 text-left font-bricolage text-[16px] font-normal tracking-[-0.04em] leading-[1.4] cursor-pointer ${isActive
                    ? "bg-[#F1F1F1] text-[#1F1F1F]"
                    : "text-[#5E5E5E] hover:bg-[#F9F9F9] hover:text-[#1F1F1F]"
                  }`}
              >
                {item.type === "custom" ? (
                  <img
                    src={item.icon as string}
                    alt={item.name}
                    className={`w-[18px] h-[18px] object-contain shrink-0 transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                  />
                ) : (
                  React.createElement(item.icon as React.ComponentType<any>, {
                    size: 18,
                    className: `shrink-0 ${isActive ? "text-[#1F1F1F]" : "text-[#8E8E93]"}`,
                  })
                )}
                <span className="flex-1">{item.name}</span>

                {/* Assignment dynamic count badge (Shown only on /assignments routes) */}
                {isAssignmentsTab && isAssignmentPage && assignmentCount > 0 && (
                  <span className="bg-[#FF5029] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 tracking-normal font-inter transition-all duration-300">
                    {assignmentCount}
                  </span>
                )}

                {/* My Library static count badge */}
                {item.name === "My Library"}
              </button>
            );
          })}
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
}

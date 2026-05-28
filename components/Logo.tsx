import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom logo image provided in public */}
      <img
        src="/logo 2.png"
        alt="VedaAI Logo"
        className="w-[38px] h-[38px] object-contain shrink-0"
      />
      {/* VedaAI typography */}
      <span className="font-bricolage text-[22px] font-bold tracking-tight text-[#1E1E1E]">
        VedaAI
      </span>
    </div>
  );
}

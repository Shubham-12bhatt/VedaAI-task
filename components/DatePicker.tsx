"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  error,
  placeholder = "DD-MM-YYYY",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Date states for the calendar view
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [d, m, y] = value.split("-").map(Number);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return new Date(y, m - 1, 1);
      }
    }
    return new Date();
  });

  // Keep viewDate in sync when value changes externally
  useEffect(() => {
    if (value) {
      const [d, m, y] = value.split("-").map(Number);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        setViewDate(new Date(y, m - 1, 1));
      }
    }
  }, [value]);

  // Click outside to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date helper
  const formatDateString = (day: number, month: number, year: number) => {
    const dStr = String(day).padStart(2, "0");
    const mStr = String(month + 1).padStart(2, "0");
    return `${dStr}-${mStr}-${year}`;
  };

  // Keyboard input handler with auto-masking (DD-MM-YYYY)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value.replace(/[^0-9-]/g, ""); // Allow digits and dashes
    
    // Auto-formatting mask
    const cleaned = inputVal.replace(/-/g, "");
    if (cleaned.length > 8) return; // Limit to 8 digits (DDMMYYYY)
    
    let formatted = "";
    if (cleaned.length > 0) {
      formatted += cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += "-" + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += "-" + cleaned.substring(4, 8);
    }
    
    onChange(formatted);
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const formatted = formatDateString(day, currentMonth, currentYear);
    onChange(formatted);
    setIsOpen(false);
  };

  // Generate calendar days
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Days list to render
  const calendarDays = [];
  
  // Previous month padding days
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i),
    });
  }

  // Next month padding days to complete grid (multiples of 7)
  const remaining = 42 - calendarDays.length; // 6 rows of 7
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i),
    });
  }

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Check if calendar date matches selected value
  const isSelected = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !value) return false;
    const [d, m, y] = value.split("-").map(Number);
    return d === day && m === currentMonth + 1 && y === currentYear;
  };

  // Check if calendar date is today
  const isToday = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <div className="relative w-full font-bricolage" ref={containerRef}>
      {/* Label & Input Wrapper */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-[#1F1F1F] tracking-[-0.02em]">
          Due Date
        </label>
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full h-[48px] px-4 rounded-[12px] bg-[#F1F1F1] text-[#1F1F1F] font-inter text-[15px] font-medium tracking-tight outline-none border transition-all duration-150 ${
              error 
                ? "border-red-500/80 focus:border-red-500 bg-red-50/10" 
                : "border-transparent focus:bg-[#EAEAEA] focus:border-[#CCCCCC]"
            }`}
            onClick={() => setIsOpen(true)}
            onFocus={() => setIsOpen(true)}
          />
          <button
            type="button"
            className="absolute right-4 text-[#1F1F1F] opacity-75 hover:opacity-100 transition-opacity p-0.5"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CalendarIcon size={18} />
          </button>
        </div>

        {error && (
          <span className="text-[12px] font-medium text-red-500 mt-1 leading-none tracking-tight">
            {error}
          </span>
        )}
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute z-[9999] top-[84px] right-0 md:left-0 w-[290px] bg-white rounded-[20px] p-4 card-shadow border border-neutral-100 animate-in fade-in-50 zoom-in-95 duration-100">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[14px] font-bold text-[#1F1F1F] tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-[#1F1F1F] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-[#1F1F1F] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Grid Weekdays */}
          <div className="grid grid-cols-7 text-center mb-1">
            {weekdayNames.map((day) => (
              <span key={day} className="text-[11px] font-medium text-neutral-400 leading-[22px]">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 text-center gap-[2px]">
            {calendarDays.map((cell, idx) => {
              const selected = isSelected(cell.day, cell.isCurrentMonth);
              const today = isToday(cell.day, cell.isCurrentMonth);
              
              return (
                <button
                  key={`${cell.day}-${idx}`}
                  type="button"
                  onClick={() => cell.isCurrentMonth && handleDateSelect(cell.day)}
                  disabled={!cell.isCurrentMonth}
                  className={`h-8 text-[13px] font-medium rounded-full flex items-center justify-center transition-all ${
                    !cell.isCurrentMonth 
                      ? "text-neutral-300 cursor-default" 
                      : selected
                        ? "bg-black text-white font-semibold"
                        : today
                          ? "bg-neutral-100 text-black border border-neutral-300 font-semibold"
                          : "text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

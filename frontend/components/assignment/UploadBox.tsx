"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { FileData } from "@/types/assignment";
import { toast } from "sonner";

interface UploadBoxProps {
  value: FileData | null;
  onChange: (file: FileData | null) => void;
  error?: string;
}

export default function UploadBox({ value, onChange, error }: UploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Strictly allow PDF and TXT only as requested by the user
  const allowedExtensions = [".pdf", ".txt"];
  const allowedMimeTypes = ["application/pdf", "text/plain", "text/markdown"];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit

  const validateAndProcessFile = (file: File) => {
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const isValidType =
      allowedMimeTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      toast.error("Invalid file format. Only PDF and TXT files are allowed.");
      return;
    }

    if (file.size > maxSizeBytes) {
      toast.error("File size exceeds the 10MB limit.");
      return;
    }

    // Simulate progress bar increase
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          
          const reader = new FileReader();
          reader.onload = () => {
            onChange({
              name: file.name,
              size: file.size,
              type: file.type || (file.name.endsWith(".txt") ? "text/plain" : "application/pdf"),
              previewUrl: undefined, // PDF/TXT don't have visual preview URLs
            });
            setUploadProgress(null);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 25; // Increase 25% every 120ms
      });
    }, 120);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full font-bricolage">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".pdf,.txt"
        className="hidden"
      />

      {!value && uploadProgress === null ? (
        /* DND Dropzone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerFileInput}
          className={`w-full min-h-[190px] md:h-[200px] border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-[#FF5029] bg-[#FF5029]/5 scale-[1.01]"
              : error
                ? "border-red-500/80 bg-red-50/5 hover:bg-red-50/10"
                : "border-[#E1E1E1] bg-white hover:bg-[#F9F9F9]"
          }`}
        >
          {/* Upload Cloud Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-[#E1E1E1] card-shadow mb-3 text-[#1F1F1F]">
            <Upload size={18} />
          </div>

          <p className="font-bricolage text-[16px] font-bold text-[#1F1F1F] tracking-[-0.02em] leading-normal mb-1">
            Choose a file or drag & drop it here
          </p>
          <p className="font-bricolage text-[12px] font-normal text-[#8E8E93] leading-normal mb-4">
            PDF, TXT files up to 10MB
          </p>

          <button
            type="button"
            className="h-[36px] bg-[#F1F1F1] hover:bg-[#EAEAEA] text-[#1F1F1F] font-inter font-medium text-[13px] tracking-[-0.02em] px-5 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer card-shadow"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <span>Browse Files</span>
          </button>
        </div>
      ) : uploadProgress !== null ? (
        /* Uploading State */
        <div className="w-full h-[200px] border border-[#E1E1E1] bg-white rounded-[24px] flex flex-col items-center justify-center p-6 text-center card-shadow">
          <div className="w-12 h-12 flex items-center justify-center bg-[#F1F1F1] rounded-full animate-bounce mb-4 text-[#1F1F1F]">
            <Upload size={22} className="animate-pulse" />
          </div>
          <p className="font-bricolage text-[15px] font-bold text-[#1F1F1F] tracking-tight mb-2">
            Uploading document... {uploadProgress}%
          </p>
          <div className="w-[200px] h-[6px] bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1F1F1F] rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        /* Uploaded Preview State */
        <div className="w-full border border-[#E1E1E1] bg-white rounded-[24px] p-5 flex items-center justify-between card-shadow transition-all duration-200">
          <div className="flex items-center gap-4 min-w-0">
            {/* File Icon */}
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#F1F1F1] overflow-hidden flex items-center justify-center shrink-0 border border-neutral-100">
              <FileText size={24} className="text-[#5E5E5E]" />
            </div>

            {/* File Details */}
            <div className="flex flex-col min-w-0">
              <span className="font-bricolage text-[15px] font-bold text-[#1F1F1F] tracking-[-0.02em] truncate pr-2">
                {value?.name}
              </span>
              <span className="font-bricolage text-[12px] font-normal text-[#8E8E93] leading-normal flex items-center gap-1.5 mt-0.5">
                <span>{formatFileSize(value?.size || 0)}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="text-green-600 font-medium flex items-center gap-0.5">
                  <CheckCircle2 size={12} />
                  Ready
                </span>
              </span>
            </div>
          </div>

          {/* Delete Action */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 border border-neutral-100"
            onClick={() => onChange(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Subtext info */}
      {!value && (
        <p className="font-bricolage text-[13px] font-normal text-[#7E7E7E] text-center mt-2.5 leading-normal">
          Upload reference text or PDF documents
        </p>
      )}

      {error && (
        <p className="text-[12px] font-medium text-red-500 mt-2 text-center leading-none tracking-tight">
          {error}
        </p>
      )}
    </div>
  );
}

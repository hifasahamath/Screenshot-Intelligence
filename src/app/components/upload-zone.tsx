"use client";

import React, { useRef, useCallback } from "react";

interface UploadZoneProps {
  onAnalyzeStart: (file: File) => void;
  onAnalyzeSuccess: (data: any) => void;
  onAnalyzeError: (error: string) => void;
  isAnalyzing: boolean;
}

export function UploadZone({ onAnalyzeStart, onAnalyzeSuccess, onAnalyzeError, isAnalyzing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return "Please upload a valid image file (JPG, PNG, WebP).";
    }
    if (file.size > 4 * 1024 * 1024) {
      return "This image is too large. Please upload an image smaller than 4MB.";
    }
    return null;
  };

  const processFile = async (file: File) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError(null);
    onAnalyzeStart(file);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to analyze screenshot");
      }
      
      const data = await res.json();
      onAnalyzeSuccess(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      onAnalyzeError(err.message || "An unexpected error occurred.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) processFile(file);
        break;
      }
    }
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 h-full">
      <div 
        className={`
          relative w-full aspect-video md:aspect-[4/3] flex flex-col items-center justify-center 
          rounded-3xl border-2 border-dashed transition-all duration-200 overflow-hidden group
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
          <div className={`
            w-20 h-20 mb-6 rounded-full flex items-center justify-center
            transition-transform duration-300 ease-out
            ${isDragging ? 'scale-110 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:scale-105'}
          `}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Drop a screenshot here
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">
            or paste from clipboard
          </p>
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="pointer-events-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-white font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
          >
            {isAnalyzing ? "Analyzing..." : "Choose Image"}
          </button>
        </div>

        {error && (
          <div className="absolute bottom-6 left-6 right-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

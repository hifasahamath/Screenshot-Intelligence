"use client";

import React, { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { AnalysisPanel } from "@/components/analysis-panel";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleAnalyzeStart = (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);
    setCurrentFile(file);
  };

  const handleAnalyzeSuccess = (data: any) => {
    setIsAnalyzing(false);
    setAnalysisResult(data);
  };

  const handleAnalyzeError = (err: string) => {
    setIsAnalyzing(false);
    setError(err);
  };
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
              Understand any <span className="text-blue-600 dark:text-blue-500">screenshot.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Upload or paste a screenshot and turn it into useful information and actions.
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Upload / Image Viewer Area */}
          <section className="lg:col-span-5 flex flex-col sticky top-8">
            <UploadZone 
              isAnalyzing={isAnalyzing}
              onAnalyzeStart={handleAnalyzeStart}
              onAnalyzeSuccess={handleAnalyzeSuccess}
              onAnalyzeError={handleAnalyzeError}
            />
          </section>

          {/* Analysis / Action Area */}
          <section className="lg:col-span-7 flex flex-col">
            {isAnalyzing || analysisResult ? (
              <AnalysisPanel analysis={analysisResult} isLoading={isAnalyzing} file={currentFile} />
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 min-h-[500px] flex flex-col justify-center items-center text-center transition-all">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">Waiting for screenshot</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto text-sm leading-relaxed">
                  Drop an image on the left to instantly analyze and extract actionable data.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

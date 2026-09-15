"use client";

import React, { useState } from "react";

interface EntityCardProps {
  type: string;
  value: string;
}

export function EntityCard({ type, value }: EntityCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-3 sm:p-4 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors">
      <div className="text-[10px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1">
        {type}
      </div>
      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate pr-6" title={value}>
        {value}
      </div>
      
      <button 
        onClick={handleCopy}
        className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 outline-none"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

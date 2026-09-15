"use client";

import React from "react";

interface ActionButtonProps {
  action: string;
}

export function ActionButton({ action }: ActionButtonProps) {
  // Map common action strings to human-readable labels and icons
  const getActionDetails = (act: string) => {
    switch (act.toLowerCase()) {
      case "copy":
        return { label: "Copy Text", icon: "clipboard" };
      case "open_url":
      case "open":
        return { label: "Open Link", icon: "external-link" };
      case "explain":
      case "summarize":
        return { label: "Explain", icon: "sparkles" };
      case "suggest_fix":
        return { label: "Suggest Fix", icon: "wrench" };
      case "translate":
        return { label: "Translate", icon: "globe" };
      default:
        return { label: act.replace(/_/g, " "), icon: "play" };
    }
  };

  const { label, icon } = getActionDetails(action);

  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20">
      {icon === "clipboard" && (
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      )}
      {icon === "external-link" && (
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      )}
      {icon === "sparkles" && (
        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
      )}
      {icon === "wrench" && (
        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )}
      {icon === "globe" && (
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
      )}
      {icon === "play" && (
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )}
      <span className="capitalize">{label}</span>
    </button>
  );
}

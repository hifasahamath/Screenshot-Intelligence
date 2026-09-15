"use client";

import React from "react";
import { EntityCard } from "./entity-card";
import { ActionButton } from "./action-button";

type Entity = {
  type: string;
  value: string;
};

type Analysis = {
  category: string;
  summary: string;
  entities: Entity[];
  actions: string[];
};

interface AnalysisPanelProps {
  analysis: Analysis | null;
  isLoading: boolean;
  file: File | null;
}

export function AnalysisPanel({ analysis, isLoading, file }: AnalysisPanelProps) {
  const [question, setQuestion] = React.useState("");
  const [isAsking, setIsAsking] = React.useState(false);
  const [answer, setAnswer] = React.useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim() || !file || !analysis) return;
    
    setIsAsking(true);
    setAnswer(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("question", question);
      formData.append("previous_analysis", JSON.stringify(analysis));
      
      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to get answer");
      
      const data = await res.json();
      setAnswer(data.answer);
      setQuestion("");
    } catch (err) {
      setAnswer("Sorry, I couldn't answer that. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 min-h-[500px] flex flex-col justify-center items-center text-center">
        <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">Analyzing screenshot</h3>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto text-sm">
          Extracting text, identifying patterns, and finding actionable information.
        </p>
      </div>
    );
  }

  if (!analysis) {
    return null; // Handled by parent or empty state
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          {analysis.category.replace('_', ' ')}
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
          {analysis.summary}
        </h2>
      </div>

      {/* Extracted Entities */}
      {analysis.entities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4 uppercase tracking-wider">
            Detected Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.entities.map((entity, idx) => (
              <EntityCard key={idx} type={entity.type} value={entity.value} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {analysis.actions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4 uppercase tracking-wider">
            Suggested Actions
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.actions.map((action, idx) => (
              <ActionButton key={idx} action={action} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1"></div>

      {/* Ask Question Interface */}
      <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
        
        {answer && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {answer}
            </p>
          </div>
        )}

        <div className="relative group">
          <input 
            type="text" 
            placeholder="Ask a question about this screenshot..." 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAsking}
            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleAsk}
            disabled={isAsking || !question.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 text-white rounded-xl transition-colors flex items-center justify-center"
          >
            {isAsking ? (
              <div className="w-4 h-4 border-2 border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
    </div>
  );
}

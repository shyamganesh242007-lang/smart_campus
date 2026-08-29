import React, { useState } from 'react';
import { Play, ChevronRight, Sparkles, CheckCircle2, Compass, Award, Calendar, GraduationCap, AlertOctagon, X } from 'lucide-react';

export default function ContestWalkthrough({ onExecuteStep }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "3D Campus Twin", desc: "Rotate & inspect IFET Main Building, Fountain & Kalam Block", tab: "3d", action: () => onExecuteStep('3d') },
    { title: "Building Info", desc: "Click A.P.J. Abdul Kalam Block (Room 269 & AI Lab)", tab: "3d_select", action: () => onExecuteStep('3d_select') },
    { title: "CampusAI Chat", desc: "Ask CampusAI about attendance & next class", tab: "ai", action: () => onExecuteStep('ai') },
    { title: "Timetable & Attendance", desc: "Check Room 269 schedule & safe miss calculator", tab: "attendance", action: () => onExecuteStep('attendance') },
    { title: "Inter-College Events", desc: "Discover HACK-X-IFET & get Digital QR Pass", tab: "events", action: () => onExecuteStep('events') },
    { title: "Exam Seat Locator", desc: "Search Reg No 421121104001 & seat position", tab: "exam", action: () => onExecuteStep('exam') },
    { title: "3D Route Flyover", desc: "Launch smooth 3D camera navigation to Room 269", tab: "route", action: () => onExecuteStep('route') }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-40 glass-editorial border border-[var(--border-color)] text-[var(--olive-primary)] text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-editorial flex items-center space-x-2 hover:bg-[var(--bg-secondary)] transition-all hover:-translate-y-0.5"
      >
        <Sparkles className="w-4 h-4 text-[var(--olive-primary)]" />
        <span>Contest WOW Flow Tour</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 left-4 z-40 premium-card glow-effect border border-[var(--border-color)] rounded-2xl p-5 max-w-sm shadow-editorial space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[var(--olive-primary)] animate-pulse" />
          <h4 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Contest Presentation WOW Flow</h4>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Info */}
      <div className="glass-editorial border border-[var(--border-color)] rounded-xl p-4 space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-[var(--olive-primary)] font-bold">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-[var(--text-primary)] font-semibold">{steps[currentStep].title}</span>
        </div>
        <div className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{steps[currentStep].desc}</div>
      </div>

      {/* Trigger Step Button */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={() => {
            steps[currentStep].action();
            setCurrentStep((prev) => (prev + 1) % steps.length);
          }}
          className="flex-1 py-2.5 bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)] text-[#FFFFFF] font-extrabold text-xs rounded-xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Step & Next</span>
        </button>

        <button
          onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
          className="px-4 py-2.5 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] text-xs font-bold transition-all"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

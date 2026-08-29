import React, { useState } from 'react';
import { STUDENT_PROFILE } from '../data/mockData';
import { Calculator, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, RefreshCcw, Plus, Minus } from 'lucide-react';

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState(STUDENT_PROFILE.attendedClasses);
  const [total, setTotal] = useState(STUDENT_PROFILE.totalClasses);

  const percentage = total > 0 ? ((attended / total) * 100).toFixed(1) : 0;

  // Safe classes to miss for 75%
  // attended / (total + x) >= 0.75 => attended >= 0.75 * total + 0.75 * x => x <= (attended - 0.75 * total) / 0.75
  const maxMissable = Math.max(0, Math.floor((attended - 0.75 * total) / 0.75));

  // Required classes to reach 85%
  // (attended + y) / (total + y) >= 0.85 => attended + y >= 0.85 * total + 0.85 * y => 0.15 * y >= 0.85 * total - attended
  const neededFor85 = percentage >= 85 ? 0 : Math.max(0, Math.ceil((0.85 * total - attended) / 0.15));

  const isSafe = percentage >= 75;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="premium-card glow-effect border border-[var(--border-color)] rounded-2xl p-5 shadow-editorial flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Attendance Analytics Calculator</h2>
            <p className="text-xs text-[var(--text-secondary)]">Calculate 75% safe miss margin & 85% honor target classes</p>
          </div>
        </div>

        <button
          onClick={() => { setAttended(STUDENT_PROFILE.attendedClasses); setTotal(STUDENT_PROFILE.totalClasses); }}
          className="p-2 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--olive-primary)] rounded-xl transition-all hover:-translate-y-0.5"
          title="Reset to Demo Defaults"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Calculation Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Sliders */}
        <div className="md:col-span-2 premium-card glow-effect border border-[var(--border-color)] rounded-2xl p-6 shadow-editorial space-y-6">
          {/* Attended Classes Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-[var(--text-primary)]">Classes Attended</span>
              <span className="font-mono text-[var(--olive-primary)] font-extrabold text-base">{attended} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max={total}
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              className="w-full h-2.5 bg-[#1D1D1B]/10 rounded-lg appearance-none cursor-pointer accent-[#59624A]"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAttended(Math.max(0, attended - 1))}
                className="px-3 py-1 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs rounded-lg"
              >
                -1 Hr
              </button>
              <button
                onClick={() => setAttended(Math.min(total, attended + 1))}
                className="px-3 py-1 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs rounded-lg"
              >
                +1 Hr
              </button>
            </div>
          </div>

          {/* Total Classes Held Slider */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-[var(--text-primary)]">Total Conducted Hours</span>
              <span className="font-mono text-[var(--olive-primary)] font-extrabold text-base">{total} hrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="300"
              value={total}
              onChange={(e) => {
                const newTotal = Number(e.target.value);
                setTotal(newTotal);
                if (attended > newTotal) setAttended(newTotal);
              }}
              className="w-full h-2.5 bg-[#1D1D1B]/10 rounded-lg appearance-none cursor-pointer accent-[#C49A3A]"
            />
          </div>
        </div>

        {/* Right 1 Col: Dynamic Results Gauge Card */}
        <div className="premium-card glow-effect border border-[var(--border-color)] rounded-2xl p-6 shadow-editorial flex flex-col justify-between space-y-6">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Current Attendance</div>
            <div className={`text-4xl font-extrabold font-mono ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
              {percentage}%
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              isSafe ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm'
            }`}>
              {isSafe ? 'ELIGIBLE FOR EXAMS' : 'SHORTAGE ALERT'}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
            {/* Safe Miss Result */}
            <div className="p-3 bg-[var(--bg-secondary)]/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-[var(--text-primary)] font-semibold">Safe Classes to Miss (75%)</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-600">{maxMissable} hrs</span>
            </div>

            {/* Target 85% Needed */}
            <div className="p-3 bg-[var(--bg-secondary)]/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[var(--olive-primary)]" />
                <span className="text-xs text-[var(--text-primary)] font-semibold">Need for 85% Goal</span>
              </div>
              <span className="font-mono text-sm font-bold text-[var(--olive-primary)]">{neededFor85} hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, User, BookOpen, ChevronRight, Filter } from 'lucide-react';

export default function Timetable({ onTriggerRoute }) {
  const { timetable } = useApp();
  const [selectedDay, setSelectedDay] = useState('Today');
  const days = ['Today', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const currentSlots = timetable[selectedDay] || timetable.Today;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header & Day Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 premium-card glow-effect border border-[var(--border-color)] rounded-2xl p-5 shadow-editorial">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-[var(--olive-primary)]" />
            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Interactive Class Timetable</h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Department of CSE • VI Semester • Classroom: <span className="text-[var(--olive-primary)] font-semibold">Room 269 (Kalam Block)</span>
          </p>
        </div>

        {/* Day Pills Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-[var(--olive-primary)] text-[#FFFFFF] shadow-md -translate-y-0.5'
                  : 'glass-editorial text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable List Grid */}
      <div className="space-y-3">
        {currentSlots.map((slot, index) => {
          const isBreak = slot.type === 'Break';
          const isRoom269 = slot.room === 'Room 269';

          return (
            <div
              key={index}
              className={`p-4 rounded-2xl border transition-all ${
                isBreak
                  ? 'bg-[var(--bg-secondary)]/50 border-transparent opacity-80'
                  : slot.status === 'Ongoing'
                  ? 'bg-[var(--bg-card)] border-[var(--olive-primary)]/40 shadow-md scale-[1.01]'
                  : 'premium-card glow-effect border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center space-x-4">
                  {/* Time Badge */}
                  <div className="min-w-28 text-left">
                    <div className="text-xs font-mono font-bold text-[var(--olive-primary)] flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>{slot.time.split(' - ')[0]}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">{slot.time.split(' - ')[1]}</div>
                  </div>

                  <div className="w-px h-10 bg-[#1D1D1B]/10 hidden sm:block" />

                  {/* Subject Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-[var(--text-primary)]">{slot.subject}</h3>
                      {slot.code !== 'BREAK' && (
                        <span className="px-2 py-0.5 bg-[#1D1D1B]/5 text-[var(--text-secondary)] text-xs font-mono rounded">
                          {slot.code}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        slot.type === 'Lab' ? 'bg-[var(--olive-primary)]/20 text-[var(--olive-primary)] border border-[var(--olive-primary)]/30' :
                        slot.type === 'Lecture' ? 'bg-[#1D1D1B]/10 text-[var(--text-primary)] border border-[#1D1D1B]/20' :
                        'bg-black/5 text-[var(--text-secondary)]'
                      }`}>
                        {slot.type}
                      </span>
                    </div>

                    {!isBreak && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] mt-1">
                        <div className="flex items-center text-[var(--text-primary)]">
                          <User className="w-3.5 h-3.5 text-[var(--olive-primary)] mr-1" />
                          <span>{slot.faculty}</span>
                        </div>
                        <div className="flex items-center text-[var(--text-primary)] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[var(--olive-primary)] mr-1" />
                          <span>{slot.room}</span> ({slot.block})
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3D Route Action Button for Classroom */}
                {!isBreak && (
                  <button
                    onClick={() => onTriggerRoute({
                      buildingId: isRoom269 ? 'kalam_block' : 'main_building',
                      title: `Route to ${slot.room} (${slot.subject})`
                    })}
                    className="self-end sm:self-center px-4 py-2 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--olive-primary)] text-xs font-semibold rounded-xl border border-[var(--border-color)] flex items-center space-x-1.5 transition-all hover:-translate-y-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>3D Route</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

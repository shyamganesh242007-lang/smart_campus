import React, { useState, useEffect } from 'react';
import { STUDENT_PROFILE } from '../data/mockData';
import { GraduationCap, Search, MapPin } from 'lucide-react';

export default function ExamSeatFinder({ onTriggerRoute, userRegNo }) {
  const [searchRegNo, setSearchRegNo] = useState(userRegNo || localStorage.getItem('campusx_regNo') || '42112410683');
  const [activeRegNo, setActiveRegNo] = useState(userRegNo || localStorage.getItem('campusx_regNo') || '42112410683');

  useEffect(() => {
    if (userRegNo) {
      setSearchRegNo(userRegNo);
      setActiveRegNo(userRegNo);
    }
  }, [userRegNo]);

  // Determine student name based on logged in/searched register number
  const studentName = 
    activeRegNo === '42112410683' ? 'Ragul' :
    activeRegNo === STUDENT_PROFILE.regNo ? STUDENT_PROFILE.name :
    'Ragul';

  const studentData = {
    name: studentName,
    regNo: activeRegNo,
    subject: 'CS8591 Computer Networks',
    hall: 'Room 269 (A.P.J. Abdul Kalam Block)',
    buildingId: 'kalam_block',
    benchDesk: 'Row B • Desk #12',
    timeSlot: '10:00 AM - 01:00 PM (Forenoon)'
  };

  const desks = [
    { id: 1, bench: 'Bench 1' },
    { id: 2, bench: 'Bench 1' },
    { id: 3, bench: 'Bench 2' },
    { id: 4, bench: 'Bench 2' },
    { id: 5, bench: 'Bench 3' },
    { id: 6, bench: 'Bench 3' },
    { id: 7, bench: 'Bench 4' },
    { id: 8, bench: 'Bench 4' },
    { id: 9, bench: 'Bench 5' },
    { id: 10, bench: 'Bench 5' },
    { id: 11, bench: 'Bench 6' },
    { id: 12, bench: 'YOUR SEAT', isUserSeat: true },
    { id: 13, bench: 'Bench 7' },
    { id: 14, bench: 'Bench 7' },
    { id: 15, bench: 'Bench 8' },
    { id: 16, bench: 'Bench 8' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchRegNo.trim()) {
      setActiveRegNo(searchRegNo.trim());
    }
  };

  const handleTriggerGuide = () => {
    if (onTriggerRoute) {
      onTriggerRoute({
        buildingId: studentData.buildingId,
        title: `3D Route to Exam Hall Room 269 (Kalam Block) - Desk #12`
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-[#0e1620]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-5 md:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Title & Icon */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--olive-primary)]/20 border border-[var(--olive-primary)]/40 flex items-center justify-center text-[var(--olive-light)] shadow-inner shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Semester Exam Seat Finder &amp; Waypoint
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
              Instant Seating Verification <span className="text-[var(--olive-light)] font-bold">&rarr;</span> Hall Ticket Map <span className="text-[var(--olive-light)] font-bold">&rarr;</span> 3D Route Guidance
            </p>
          </div>
        </div>

        {/* Right Search Input & Button */}
        <form onSubmit={handleSearch} className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchRegNo}
              onChange={(e) => setSearchRegNo(e.target.value)}
              placeholder="Enter Reg No"
              className="w-full bg-[#131d2a] border border-slate-700/60 rounded-full pl-10 pr-4 py-2.5 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[var(--olive-primary)]/70 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Find Seat
          </button>
        </form>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Exam Hall Ticket Card */}
        <div className="lg:col-span-4 bg-[#0e1620]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            {/* Verified Badge */}
            <div className="flex justify-center">
              <span className="px-4 py-1 bg-[var(--olive-primary)]/20 border border-[var(--olive-primary)]/40 text-[var(--olive-light)] text-[10px] font-black rounded-full uppercase tracking-widest shadow-inner">
                EXAM HALL TICKET VERIFIED
              </span>
            </div>

            {/* Student Info */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white tracking-wide">{studentData.name}</h2>
              <p className="text-xs text-[var(--olive-light)] font-bold tracking-wider font-mono">
                Reg: {studentData.regNo}
              </p>
            </div>

            <hr className="border-slate-800" />

            {/* Details Rows */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Subject:</span>
                <span className="text-white font-bold text-right">{studentData.subject}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Exam Hall:</span>
                <span className="text-[var(--olive-light)] font-bold text-right">{studentData.hall}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Bench &amp; Desk:</span>
                <span className="text-amber-400 font-bold text-right">{studentData.benchDesk}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Time Slot:</span>
                <span className="text-white font-bold text-right">{studentData.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Guide 3D Navigation Button */}
          <button
            onClick={handleTriggerGuide}
            className="w-full btn-primary text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <MapPin className="w-4 h-4 text-white" />
            <span>Guide 3D Navigation to Hall</span>
          </button>
        </div>

        {/* Right Column: 2D Grid Layout Card */}
        <div className="lg:col-span-8 bg-[#0e1620]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.4)] space-y-6">
          
          {/* Header & Sub-badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wider">
              EXAM HALL 2D GRID LAYOUT (ROOM 269)
            </h3>
            <span className="px-3 py-1 bg-[#1a2332] border border-slate-700/60 text-slate-300 text-[10px] font-bold rounded-full uppercase tracking-wider self-start sm:self-auto">
              Invigilator Podium <span className="text-[var(--olive-light)]">&rarr;</span> Front
            </span>
          </div>

          {/* Invigilator Podium Table */}
          <div className="w-full py-3 bg-[#131d2a] border border-[var(--olive-primary)]/40 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-xs font-black text-[var(--olive-light)] uppercase tracking-widest">
              PROFESSOR / INVIGILATOR PODIUM TABLE
            </span>
          </div>

          {/* 4x4 Desks Grid - Read-only / Only Your Seat Highlighted */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 select-none">
            {desks.map((desk) => {
              const isUserSeat = desk.isUserSeat;

              return (
                <div
                  key={desk.id}
                  className={`rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-1 transition-all duration-200 cursor-default ${
                    isUserSeat
                      ? 'btn-primary text-white border border-[var(--olive-light)]/50 scale-[1.03] shadow-[0_8px_24px_rgba(76,88,62,0.6)]'
                      : 'bg-[#131d2a]/80 border border-slate-800/80 text-slate-300 shadow-inner opacity-90'
                  }`}
                >
                  <span className={`text-xs font-black uppercase tracking-wider ${isUserSeat ? 'text-white' : 'text-slate-400'}`}>
                    DESK #{desk.id}
                  </span>
                  <span className={`text-xs font-extrabold uppercase ${isUserSeat ? 'text-white' : 'text-slate-300'}`}>
                    {desk.isUserSeat ? 'YOUR SEAT' : desk.bench}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}




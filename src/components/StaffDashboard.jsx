import React, { useState, useMemo } from 'react';
import { 
  Users, CalendarDays, CheckCircle2, Bell, AlertTriangle, Search, Bot, 
  Save, FileText, Sparkles, BookOpen, Clock, ShieldAlert, CalendarCheck, 
  Send, UserCheck, GraduationCap, CheckCircle, ArrowRight, UserX, X,
  Plus, RefreshCw, ChevronDown, Check, AlertOctagon, HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SECTION_STUDENTS_LIST } from '../data/mockData';

export default function StaffDashboard() {
  const { 
    currentUser, 
    attendance, 
    markAttendance, 
    timetable, 
    notices, 
    publishNotice,
    disengagedStudents,
    mentorMeetings,
    scheduleMentorMeeting
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('Hackathon');
  const [selectedSection, setSelectedSection] = useState('CSE-A');
  
  // Roster state per section
  const [sectionRosters, setSectionRosters] = useState(SECTION_STUDENTS_LIST);
  const currentStudents = sectionRosters[selectedSection] || sectionRosters['CSE-A'];
  
  // Absent rolls text input (e.g. "45, 89, 95")
  const [typedAbsentRolls, setTypedAbsentRolls] = useState("45, 89, 95");
  
  // Active absent set derived from state
  const [absentRollsSet, setAbsentRollsSet] = useState(new Set(["42112410645", "42112410689", "42112410695"]));

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [attendanceFeedback, setAttendanceFeedback] = useState(null);
  const [showLowAttendanceModal, setShowLowAttendanceModal] = useState(false);

  // Sync typed rolls with absentRollsSet
  const handleTypedRollsChange = (val) => {
    setTypedAbsentRolls(val);
    const rolls = val.split(/[,\s]+/).map(r => r.trim()).filter(Boolean);
    const newSet = new Set();
    currentStudents.forEach(s => {
      if (rolls.some(r => s.roll === r || s.roll.endsWith(r) || s.regNo.endsWith(r))) {
        newSet.add(s.regNo);
      }
    });
    setAbsentRollsSet(newSet);
  };

  // Toggle individual student chip
  const toggleStudentStatus = (regNo) => {
    setAbsentRollsSet(prev => {
      const next = new Set(prev);
      if (next.has(regNo)) {
        next.delete(regNo);
      } else {
        next.add(regNo);
      }
      // Update text input to reflect
      setTypedAbsentRolls(Array.from(next).join(', '));
      return next;
    });
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    setAbsentRollsSet(new Set());
    setTypedAbsentRolls('');
    markAttendance(selectedSubject, true);
    setAttendanceFeedback(`Marked ALL ${currentStudents.length} students PRESENT for ${selectedSubject} (${selectedSection})!`);
    setTimeout(() => setAttendanceFeedback(null), 4500);
  };

  // Submit Absentee Roll
  const handleSubmitAttendance = () => {
    const absentCount = absentRollsSet.size;
    const presentCount = currentStudents.length - absentCount;
    
    // Update local section roster status
    setSectionRosters(prev => ({
      ...prev,
      [selectedSection]: prev[selectedSection].map(s => ({
        ...s,
        status: absentRollsSet.has(s.regNo) ? 'absent' : 'present'
      }))
    }));

    markAttendance(selectedSubject, absentCount === 0);

    setAttendanceFeedback(
      `Attendance Logged for ${selectedSubject} (${selectedSection}): ${presentCount} Present, ${absentCount} Absent (${Array.from(absentRollsSet).join(', ') || 'None'})`
    );
    setTimeout(() => setAttendanceFeedback(null), 5000);
  };

  // Low Attendance calculation for current section
  const lowAttendanceStudents = useMemo(() => {
    return currentStudents.filter(s => s.attendance < 75);
  }, [currentStudents]);

  const criticalStudents = useMemo(() => {
    return currentStudents.filter(s => s.attendance < 65);
  }, [currentStudents]);

  const warningStudents = useMemo(() => {
    return currentStudents.filter(s => s.attendance >= 65 && s.attendance < 75);
  }, [currentStudents]);

  const safeStudents = useMemo(() => {
    return currentStudents.filter(s => s.attendance >= 75);
  }, [currentStudents]);

  const handlePublishNotice = (e) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    
    publishNotice({
      id: `not-${Date.now()}`,
      title: noticeTitle,
      category: 'Academic',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: currentUser?.name || 'Prof. Kumar',
      summary: noticeContent.substring(0, 60) + '...',
      content: noticeContent
    });
    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleQuickMentorSchedule = (student) => {
    scheduleMentorMeeting({
      studentId: `stu-${student.roll}`,
      studentName: student.name,
      section: selectedSection,
      attendance: student.attendance,
      mentorName: 'Prof. Kumar',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '03:30 PM',
      venue: 'Faculty Advisory Cabin 14 (Kalam Block AKB-02)',
      agenda: `Urgent Attendance Recovery (${student.attendance}%) & Remedial Lab Assignment`
    });
    setAttendanceFeedback(`Scheduled 1-on-1 Mentor Intervention with ${student.name} (${student.attendance}%)!`);
    setTimeout(() => setAttendanceFeedback(null), 4500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 md:px-6 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HIGH-VISIBILITY HERO HEADER CARD */}
      <div className="premium-card glow-effect border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-editorial relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--bg-card)]">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[var(--olive-primary)]/10 border border-[var(--olive-primary)]/20 text-[var(--olive-primary)] text-xs font-extrabold rounded-full tracking-wider uppercase flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              FACULTY COCKPIT
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-semibold">• Department of Computer Science & Engineering</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
            Faculty Portal — <span className="text-[var(--olive-primary)]">{currentUser?.name || 'Prof. Kumar'}</span>
          </h1>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] font-semibold max-w-xl">
            Welcome to your smart teaching console. Log section roll attendance, track low attendance students, and broadcast smart notices.
          </p>
        </div>

        {/* Quick Faculty Badges */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl flex items-center space-x-3 shadow-sm">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            <div>
              <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase">Active Session</p>
              <p className="text-xs font-black text-[var(--text-primary)]">{selectedSubject} • {selectedSection}</p>
            </div>
          </div>
        </div>

        {/* Background Ambient Glow */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-[var(--olive-primary)]/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Attendance Feedback Toast */}
      {attendanceFeedback && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs md:text-sm rounded-2xl shadow-xl flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{attendanceFeedback}</span>
        </div>
      )}

      {/* 2. STATS & LOW ATTENDANCE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Section Students", value: currentStudents.length.toString(), sub: `${selectedSection} Enrolled`, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "Marked Present", value: (currentStudents.length - absentRollsSet.size).toString(), sub: `${(((currentStudents.length - absentRollsSet.size)/currentStudents.length)*100).toFixed(0)}% Turnout`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Absent Rolls", value: absentRollsSet.size.toString(), sub: "Click or Type Rolls", icon: UserX, color: "text-rose-600", bg: "bg-rose-500/10" },
          { label: "Low Attendance (<75%)", value: lowAttendanceStudents.length.toString(), sub: `${criticalStudents.length} Critical, ${warningStudents.length} Warning`, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-500/10" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="premium-card p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between group hover:-translate-y-0.5 transition-all shadow-sm bg-[var(--bg-card)]">
              <div>
                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-black text-[var(--text-primary)] leading-tight mt-0.5">{kpi.value}</p>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] mt-0.5">{kpi.sub}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MAIN ATTENDANCE LOGGER & LOW ATTENDANCE DETAILS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Interactive Roll Absentee Logger */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Class Attendance Logger Card */}
          <div className="premium-card p-6 md:p-8 rounded-3xl border-2 border-[var(--olive-primary)]/30 shadow-editorial space-y-6 bg-[var(--bg-card)]">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-2xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">Class Attendance Management</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-semibold">Type absent roll numbers or click student chips to toggle status</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 uppercase tracking-wider self-start sm:self-auto">
                Live Session
              </span>
            </div>
            
            {/* Subject & Section Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Select Course Subject</label>
                <select 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="CS8591">Computer Networks (CS8591)</option>
                  <option value="AI8301">Artificial Intelligence & Deep Learning (AI8301)</option>
                  <option value="CS8501">Theory of Computation (CS8501)</option>
                  <option value="IT8076">Cloud Computing & DevOps (IT8076)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Class Section</label>
                <select 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  value={selectedSection}
                  onChange={e => {
                    const sec = e.target.value;
                    setSelectedSection(sec);
                    const initAbs = sec === 'CSE-A' ? ['42112410645', '42112410689', '42112410695'] : sec === 'CSE-B' ? ['42112410749'] : ['42112410794'];
                    setAbsentRollsSet(new Set(initAbs));
                    setTypedAbsentRolls(initAbs.join(', '));
                  }}
                >
                  <option value="CSE-A">CSE Section A (64 Students)</option>
                  <option value="CSE-B">CSE Section B (62 Students)</option>
                  <option value="CSE-C">CSE Section C (60 Students)</option>
                  <option value="AI-A">AI & DS Section A (58 Students)</option>
                </select>
              </div>
            </div>

            {/* 🔥 TYPING ABSENTEE ROLLS INPUT FIELD */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-[var(--bg-secondary)] to-amber-500/10 border-2 border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-rose-600" />
                  <span>Type Absentee Roll Numbers (Comma / Space Separated)</span>
                </label>
                <span className="text-[11px] font-extrabold text-rose-600 font-mono">
                  {absentRollsSet.size} Absentees Detected
                </span>
              </div>

              <input 
                type="text"
                value={typedAbsentRolls}
                onChange={e => handleTypedRollsChange(e.target.value)}
                placeholder="e.g. 45, 89, 95, 22"
                className="w-full bg-white border-2 border-rose-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:border-rose-500 shadow-inner placeholder:text-gray-400 placeholder:font-sans"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase">Active Absentees:</span>
                {Array.from(absentRollsSet).length === 0 ? (
                  <span className="text-xs font-bold text-emerald-600">None (100% Present)</span>
                ) : (
                  Array.from(absentRollsSet).map(r => (
                    <span key={r} className="px-2.5 py-1 bg-rose-500 text-white rounded-lg text-xs font-mono font-black flex items-center gap-1 shadow-sm">
                      {r}
                      <button onClick={() => toggleStudentStatus(r)} className="hover:opacity-80">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* STUDENT ROSTER CHIPS (CLICK TO TOGGLE PRESENT / ABSENT) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                  Quick Roll Click Roster ({selectedSection})
                </span>
                <span className="text-[10px] font-bold text-[var(--text-secondary)]">Click any student chip to flip status</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto custom-scrollbar p-1">
                {currentStudents.map(student => {
                  const isAbsent = absentRollsSet.has(student.regNo);
                  const isLow = student.attendance < 75;
                  return (
                    <button
                      key={student.roll}
                      type="button"
                      onClick={() => toggleStudentStatus(student.regNo)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 hover:-translate-y-0.5 ${
                        isAbsent 
                          ? 'bg-rose-500 text-white border-rose-600 shadow-md' 
                          : 'bg-white border-[var(--border-color)] hover:bg-emerald-50 text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-mono text-[9px] font-black px-1.5 py-0.5 rounded truncate ${
                          isAbsent ? 'bg-rose-700 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                        }`}>
                          {student.regNo}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          isAbsent ? 'bg-white text-rose-600' : isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isAbsent ? 'ABSENT' : `${student.attendance}%`}
                        </span>
                      </div>
                      <p className={`text-xs font-bold truncate ${isAbsent ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        {student.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTONS: MARK ALL PRESENT vs SUBMIT ABSENTEE ROLL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]">
              <button 
                onClick={handleMarkAllPresent}
                className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All Present ({currentStudents.length} Students)
              </button>
              <button 
                onClick={handleSubmitAttendance}
                className="py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <AlertTriangle className="w-4 h-4" />
                Submit Absentee Roll ({absentRollsSet.size} Absent)
              </button>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 🚨 DETAILED LOW ATTENDANCE BREAKDOWN PANEL (<75% SHORTAGE) */}
          {/* ========================================================================= */}
          <div className="premium-card p-6 md:p-8 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-amber-500/5 shadow-editorial space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-black rounded-md uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    ACADEMIC RISK MONITOR
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-semibold">• {selectedSection} Roster</span>
                </div>
                <h3 className="text-lg font-black text-[var(--text-primary)] mt-1">
                  Students with Low Attendance Shortage ({lowAttendanceStudents.length})
                </h3>
              </div>

              {/* Status Pills */}
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-600 rounded-lg text-xs font-extrabold border border-rose-200">
                  {criticalStudents.length} Critical (&lt;65%)
                </span>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-xs font-extrabold border border-amber-200">
                  {warningStudents.length} Warning (65-75%)
                </span>
              </div>
            </div>

            {/* Low Attendance Detailed Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                    <th className="py-2.5 px-3">Roll</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Current %</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3">Consecutive Missed</th>
                    <th className="py-2.5 px-3">Recovery Needed</th>
                    <th className="py-2.5 px-3 text-right">Intervention Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-xs font-bold">
                  {lowAttendanceStudents.map((student) => {
                    const isCritical = student.attendance < 65;
                    const recoveryClasses = Math.ceil((0.75 * 200 - (student.attendance * 200 / 100)) / 0.25);
                    return (
                      <tr key={student.roll} className="hover:bg-white/40 transition-colors">
                        {/* Roll */}
                        <td className="py-3 px-3 font-mono font-black text-[var(--text-primary)]">
                          #{student.roll}
                        </td>

                        {/* Name & RegNo */}
                        <td className="py-3 px-3">
                          <p className="font-black text-[var(--text-primary)]">{student.name}</p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{student.regNo}</p>
                        </td>

                        {/* Attendance % */}
                        <td className="py-3 px-3 font-mono font-black text-sm">
                          <span className={isCritical ? 'text-rose-600' : 'text-amber-600'}>
                            {student.attendance}%
                          </span>
                        </td>

                        {/* Risk Level Badge */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            {isCritical ? 'CRITICAL' : 'WARNING'}
                          </span>
                        </td>

                        {/* Consecutive Missed */}
                        <td className="py-3 px-3 font-mono text-rose-600">
                          {student.consecutiveMissed} hrs
                        </td>

                        {/* Recovery classes needed for 75% */}
                        <td className="py-3 px-3 font-semibold text-[var(--text-secondary)]">
                          +{Math.max(1, recoveryClasses)} consecutive hrs
                        </td>

                        {/* Mentor Meeting Action */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleQuickMentorSchedule(student)}
                            className="px-3 py-1.5 bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm hover:-translate-y-0.5 transition-all inline-flex items-center gap-1"
                          >
                            <CalendarCheck className="w-3 h-3" />
                            <span>Schedule Mentor 1-on-1</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Column: AI Faculty Assistant & Notice Publisher & Schedule */}
        <div className="space-y-6">
          
          {/* Today's Teaching Schedule Card */}
          <div className="premium-card p-6 rounded-3xl border border-[var(--border-color)] shadow-editorial space-y-4 bg-[var(--bg-card)]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[var(--olive-primary)]" />
                <span>Today's Schedule</span>
              </h3>
              <span className="text-[10px] font-bold text-[var(--text-secondary)]">Wednesday</span>
            </div>

            <div className="space-y-2.5">
              {[
                { time: "09:00 - 10:30 AM", subject: "Artificial Intelligence & ML", room: "Room 269 (Kalam Block AKB-02)", section: "CSE-A", status: "Upcoming", active: true },
                { time: "10:45 - 12:15 PM", subject: "Cloud Computing & DevOps", room: "Advanced AI Lab (Kalam Block)", section: "CSE-B", status: "Scheduled", active: false },
                { time: "01:30 - 03:00 PM", subject: "Distributed Database Systems", room: "Room 214 (Visvesvaraya Block)", section: "CSE-A", status: "Scheduled", active: false }
              ].map((slot, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                    slot.active 
                      ? 'bg-[var(--bg-secondary)] border-[var(--olive-primary)]/40 shadow-sm' 
                      : 'bg-white/60 border-[var(--border-color)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <p className="text-xs font-black text-[var(--text-primary)]">{slot.subject}</p>
                      <span className="px-1.5 py-0.2 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] text-[9px] font-black rounded">
                        {slot.section}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-[var(--text-secondary)] mt-0.5">{slot.room} • {slot.time}</p>
                  </div>

                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    slot.active ? 'bg-emerald-500 text-white' : 'bg-blue-500/10 text-blue-600'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Faculty Assistant */}
          <div className="premium-card p-6 rounded-3xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] to-[#eef4e8] shadow-editorial space-y-4">
            <h3 className="text-xs font-black text-[var(--olive-primary)] flex items-center gap-2 uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>CampusAI Faculty Assistant</span>
            </h3>
            
            <div className="space-y-3 text-xs font-semibold">
              <div className="p-3.5 bg-white/80 rounded-2xl border border-rose-200 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-rose-600 font-extrabold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Attendance Alert (CSE-A)</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  <strong>Karthik Raja S (58.4%)</strong> has missed 14 consecutive hours. Scheduled 1-on-1 mentor intervention session recommended.
                </p>
              </div>

              <div className="p-3.5 bg-white/80 rounded-2xl border border-blue-200 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                  <Sparkles className="w-4 h-4" />
                  <span>Class Turnout Prediction</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Current logged attendance for {selectedSection} is <strong>{(((currentStudents.length - absentRollsSet.size)/currentStudents.length)*100).toFixed(1)}%</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Notice Publisher */}
          <div className="premium-card p-6 rounded-3xl border border-[var(--border-color)] shadow-editorial space-y-4 bg-[var(--bg-card)]">
            <h3 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--olive-primary)]" />
              <span>Publish Smart Notice</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-semibold">Broadcast immediate circular to student dashboard.</p>

            <form onSubmit={handlePublishNotice} className="space-y-3">
              <div>
                <input 
                  type="text" 
                  placeholder="Notice Title (e.g. Lab Cycle 2 Submission)" 
                  required
                  value={noticeTitle}
                  onChange={e => setNoticeTitle(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                />
              </div>
              <div>
                <textarea 
                  rows={3}
                  placeholder="Detailed Notice Instructions..." 
                  required
                  value={noticeContent}
                  onChange={e => setNoticeContent(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] custom-scrollbar"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full btn-primary py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Student Portal</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}


import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Calendar, Download, Share2, AlertCircle, TrendingUp, TrendingDown, Target, 
  Brain, Activity, ShieldAlert, Sparkles, CheckCircle, Calculator, Info,
  UserX, Clock, MapPin, CheckCircle2, UserCheck, AlertTriangle, Plus, X,
  CalendarCheck, MessageSquare, Send, BellRing, ChevronRight
} from 'lucide-react';

export default function AttendanceAnalytics() {
  const { 
    currentUser, 
    attendance, 
    STUDENT_PROFILE, 
    disengagedStudents, 
    mentorMeetings, 
    scheduleMentorMeeting, 
    cancelMentorMeeting 
  } = useApp();

  const [filter, setFilter] = useState('Semester'); // 'Today' | 'This Week' | 'This Month' | 'Semester' | 'Overall'
  
  // Mentor Scheduling Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStudentForMeeting, setSelectedStudentForMeeting] = useState(null);
  const [mentorMeetingForm, setMentorMeetingForm] = useState({
    studentId: disengagedStudents[0]?.id || 'stu-101',
    studentName: disengagedStudents[0]?.name || 'Karthik Raja S',
    section: disengagedStudents[0]?.section || 'CSE-A',
    attendance: disengagedStudents[0]?.attendance || 58.4,
    mentorName: 'Dr. K. Arulmani (Prof / CSE)',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:30 AM',
    venue: 'CSE HOD Cabin (Main Building MB-01, Floor 2)',
    agenda: 'Attendance Shortage & Academic Remedial Intervention Plan',
    priority: 'Urgent',
    notes: 'Consecutive absenteeism detected. Parents requested to join in-person or via portal.'
  });
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState(null);

  // Get active dataset based on filter
  const currentData = attendance[filter] || attendance.Semester;

  // AI Calculators
  const [goalTarget, setGoalTarget] = useState(85);
  
  const calculateGoal = () => {
    const totalClassesSoFar = currentData.total;
    const attendedSoFar = currentData.attended;
    const target = goalTarget / 100;
    
    if (currentData.percentage >= goalTarget) return "You've already reached this goal!";
    const x = Math.ceil((target * totalClassesSoFar - attendedSoFar) / (1 - target));
    return `Attend the next ${x} consecutive classes to reach ${goalTarget}%.`;
  };

  const handleOpenScheduleModal = (student) => {
    if (student) {
      setSelectedStudentForMeeting(student);
      setMentorMeetingForm(prev => ({
        ...prev,
        studentId: student.id,
        studentName: student.name,
        section: student.section,
        attendance: student.attendance,
        mentorName: student.mentor || 'Dr. K. Arulmani (Prof / CSE)',
        agenda: `Attendance Shortage (${student.attendance}%) & Academic Remedial Recovery`
      }));
    } else {
      // Default to most disengaged student
      const topDisengaged = disengagedStudents[0];
      if (topDisengaged) {
        setSelectedStudentForMeeting(topDisengaged);
        setMentorMeetingForm(prev => ({
          ...prev,
          studentId: topDisengaged.id,
          studentName: topDisengaged.name,
          section: topDisengaged.section,
          attendance: topDisengaged.attendance,
          mentorName: topDisengaged.mentor || 'Dr. K. Arulmani (Prof / CSE)',
          agenda: `Severe Attendance Shortage (${topDisengaged.attendance}%) & Remedial Action Plan`
        }));
      }
    }
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    scheduleMentorMeeting(mentorMeetingForm);
    setShowScheduleModal(false);
    setScheduleSuccessMsg(`Mentor Meeting successfully scheduled for ${mentorMeetingForm.studentName} with ${mentorMeetingForm.mentorName}!`);
    setTimeout(() => {
      setScheduleSuccessMsg(null);
    }, 6000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Subject,Code,Percentage,Attended,Total\n"
      + attendance.subjects.map(e => `${e.name},${e.code},${e.percentage}%,${e.attended},${e.total}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Determine Risk Zone for the gauge
  const riskPercentage = attendance.Overall.percentage;
  let riskZone = "Safe Zone";
  let riskColor = "border-emerald-500";
  let rotation = "rotate-[45deg]"; // safe
  
  if (riskPercentage < 75) {
    riskZone = "Critical Zone";
    riskColor = "border-rose-500";
    rotation = "rotate-[-45deg]"; // critical
  } else if (riskPercentage < 80) {
    riskZone = "Warning Zone";
    riskColor = "border-amber-500";
    rotation = "rotate-[0deg]"; // warning
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar relative z-10 pb-32">
      
      {/* Success Notification Banner */}
      {scheduleSuccessMsg && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-xs md:text-sm font-bold">{scheduleSuccessMsg}</p>
          </div>
          <button onClick={() => setScheduleSuccessMsg(null)} className="p-1 hover:bg-emerald-600 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="premium-card glow-effect p-6 md:p-8 rounded-3xl border border-[var(--border-color)] shadow-editorial flex flex-col xl:flex-row justify-between items-start xl:items-center space-y-6 xl:space-y-0">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <img src={STUDENT_PROFILE.avatar} alt={STUDENT_PROFILE.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-[var(--border-color)]" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-5 h-5 rounded-full border-4 border-[var(--bg-card)]"></div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center space-x-2">
              <span>{currentUser?.name || STUDENT_PROFILE.name}</span>
              <span className="px-2 py-0.5 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] text-[10px] font-extrabold rounded-md uppercase tracking-widest border border-[var(--olive-primary)]/20">
                {currentUser?.id || STUDENT_PROFILE.regNo}
              </span>
            </h1>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1 tracking-wide">
              {STUDENT_PROFILE.department} | {STUDENT_PROFILE.year} | <span className="font-bold text-[var(--text-primary)]">{riskPercentage}% Overall</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Quick Schedule Mentor Action */}
          <button 
            onClick={() => handleOpenScheduleModal(null)}
            className="flex items-center justify-center space-x-2 px-5 py-3 btn-primary rounded-2xl shadow-editorial text-xs font-extrabold uppercase tracking-wider hover:-translate-y-0.5 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Schedule Mentor Meeting</span>
          </button>

          {/* Export Actions */}
          <div className="flex space-x-2">
            <button onClick={handleExportPDF} className="flex items-center space-x-2 px-4 py-3 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl shadow-sm text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5">
              <Download className="w-4 h-4" /> <span>PDF</span>
            </button>
            <button onClick={handleExportCSV} className="flex items-center space-x-2 px-4 py-3 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl shadow-sm text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5">
              <Download className="w-4 h-4" /> <span>CSV</span>
            </button>
          </div>

          {/* Risk Meter */}
          <div className="flex items-center space-x-4 bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] shrink-0">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-8 overflow-hidden flex justify-center items-end">
                <div className={`w-16 h-16 rounded-full border-4 border-b-0 ${riskColor} absolute top-0`}></div>
                <div className={`w-1.5 h-6 bg-[var(--text-primary)] absolute bottom-0 origin-bottom transform ${rotation} rounded-full transition-all duration-1000 ease-out`}></div>
              </div>
              <span className="text-[10px] font-extrabold text-[var(--text-primary)] mt-2 uppercase tracking-widest">{riskZone}</span>
            </div>
            <div className="w-48 text-xs font-semibold text-[var(--text-secondary)] leading-relaxed hidden sm:block">
              <span className="text-[var(--olive-primary)] font-bold">Risk AI: </span>
              Projected to finish at 86%. Missing 2 Cloud Computing classes drops you to Warning.
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚨 FEATURE 1: DISENGAGED STUDENTS & MENTOR INTERVENTION DASHBOARD */}
      {/* ========================================================================= */}
      <div className="premium-card glow-effect p-6 md:p-8 rounded-3xl border-2 border-rose-500/30 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-rose-500/5 shadow-editorial space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-extrabold rounded-full tracking-wider uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                Academic Early Warning System
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-semibold">• Real-Time Attendance Intervention</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] mt-1 flex items-center gap-2">
              <UserX className="w-6 h-6 text-rose-500" />
              Disengaged Students & 1-on-1 Mentor Scheduling
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">
              AI automatically identifies students critically disengaged due to low attendance and triggers mandatory faculty counseling sessions.
            </p>
          </div>

          <button
            onClick={() => handleOpenScheduleModal(disengagedStudents[0])}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Schedule Intervention For Most Disengaged
          </button>
        </div>

        {/* At-Risk Disengaged Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
          {disengagedStudents.map((student) => {
            const isCritical = student.attendance < 65;
            return (
              <div 
                key={student.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCritical 
                    ? 'bg-rose-50/50 border-rose-300 dark:bg-rose-950/20 dark:border-rose-800/50 shadow-sm' 
                    : 'bg-amber-50/50 border-amber-300 dark:bg-amber-950/20 dark:border-amber-800/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-xl object-cover border border-white/60 shadow-sm" />
                      <div>
                        <h4 className="font-extrabold text-sm text-[var(--text-primary)]">{student.name}</h4>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{student.regNo} • {student.section}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {student.riskLevel}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-white/70 rounded-xl border border-white/60 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[var(--text-secondary)]">Attendance Rate:</span>
                      <span className={`font-mono font-black text-sm ${isCritical ? 'text-rose-600' : 'text-amber-600'}`}>
                        {student.attendance}% ({student.attended}/{student.total})
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[var(--text-secondary)]">Consecutive Missed:</span>
                      <span className="font-mono font-extrabold text-rose-600">{student.consecutiveMissed} Classes</span>
                    </div>
                    <p className="text-[11px] font-semibold text-[var(--text-secondary)] line-clamp-2 pt-1 border-t border-black/5">
                      {student.disengagementReason}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[var(--text-secondary)]">Mentor:</span>
                    <span className="font-extrabold text-[var(--olive-primary)] truncate max-w-[140px]">{student.mentor}</span>
                  </div>
                  
                  <button
                    onClick={() => handleOpenScheduleModal(student)}
                    className="w-full py-2.5 bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{student.status === 'Scheduled' ? 'Update Meeting' : 'Schedule 1-on-1 Meeting'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scheduled Mentor Meetings Queue */}
        <div className="pt-4 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-wider text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[var(--olive-primary)]" />
              <span>Upcoming Scheduled Mentor Counseling Sessions ({mentorMeetings.length})</span>
            </h3>
            <span className="text-[11px] font-bold text-[var(--text-secondary)]">Syncs instantly with Smart Notice Board & Faculty Portal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mentorMeetings.map((meeting) => (
              <div 
                key={meeting.id}
                className="p-4 bg-white/60 rounded-2xl border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/90 transition-all shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[var(--text-primary)]">{meeting.studentName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-600 rounded-md">
                      {meeting.attendance}% Attendance
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md">
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-2">
                    <span>Mentor: <strong className="text-[var(--text-primary)]">{meeting.mentorName}</strong></span>
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)] font-semibold">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[var(--olive-primary)]" /> {meeting.date} at {meeting.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[var(--olive-primary)]" /> {meeting.venue}</span>
                  </div>
                </div>

                <button
                  onClick={() => cancelMentorMeeting(meeting.id)}
                  className="p-2 text-[var(--text-secondary)] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs font-bold shrink-0 self-end sm:self-center"
                  title="Cancel meeting"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {['Today', 'This Week', 'This Month', 'Semester', 'Overall'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${filter === f ? 'bg-[var(--olive-primary)] text-white' : 'glass-editorial text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Stats & Trend) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard title="Attended" value={currentData.attended} subtext={`/ ${currentData.total} Classes`} icon={CheckCircle} color="text-emerald-500" />
            <KPICard title="Missed" value={currentData.missed} subtext="In selected period" icon={AlertCircle} color="text-rose-500" />
            <KPICard title={`${filter} %`} value={`${currentData.percentage}%`} subtext={`Target: ${currentData.target}%`} icon={Target} color="text-blue-500" />
            <KPICard title="Streak" value={`${currentData.streak} Days`} subtext={`Best: ${currentData.bestStreak} Days`} icon={TrendingUp} color="text-orange-500" />
          </div>

          {/* Trend Chart & Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Area Chart */}
            <div className="md:col-span-2 premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)] shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-widest text-sm">Attendance Trend (AI Modeled)</h3>
              </div>
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendance.trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--olive-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--olive-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} 
                      itemStyle={{ fontWeight: 'bold' }} 
                    />
                    <Area type="monotone" dataKey="attendance" stroke="var(--olive-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)] shadow-sm flex flex-col">
              <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-widest text-sm mb-2">Distribution</h3>
              <div className="flex-1 min-h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attendance.distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {attendance.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-[var(--text-primary)]">{currentData.percentage}%</span>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Present</span>
                </div>
              </div>
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {attendance.distribution.slice(0,3).map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold text-[var(--text-secondary)]">{item.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-[var(--text-primary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Subject Wise Progress */}
          <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
            <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-widest text-sm mb-6">Subject Breakdown</h3>
            <div className="space-y-5">
              {attendance.subjects.map(subject => (
                <div key={subject.code} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-[var(--text-primary)] group-hover:text-[var(--olive-primary)] transition-colors">{subject.name}</h4>
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{subject.code} • {subject.attended}/{subject.total} Classes</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-[var(--text-primary)]">{subject.percentage}%</span>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${subject.status === 'Critical' ? 'text-rose-500' : subject.status === 'Warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {subject.status}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--bg-secondary)] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${subject.percentage}%`, backgroundColor: subject.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (AI & Insights) */}
        <div className="space-y-6">
          
          {/* Low Attendance Alert */}
          {attendance.subjects.some(s => s.percentage < 75) && (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl flex items-start space-x-3 shadow-sm animate-pulse">
              <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-rose-700 uppercase tracking-wide">Critical Warning</h4>
                <p className="text-xs font-semibold text-rose-600 mt-1 leading-relaxed">
                  Your Cloud Computing attendance is 72%. Attend the next 3 consecutive classes to safely reach 75%.
                </p>
              </div>
            </div>
          )}

          {/* AI Insights Panel */}
          <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--olive-primary)]/30 shadow-md relative overflow-hidden bg-gradient-to-br from-[var(--bg-card)] to-[var(--olive-primary)]/5">
            <div className="absolute -top-4 -right-4 p-4 opacity-10">
              <Brain className="w-32 h-32 text-[var(--olive-primary)]" />
            </div>
            <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-widest text-sm flex items-center space-x-2 mb-4">
              <Sparkles className="w-4 h-4 text-[var(--olive-primary)]" />
              <span>CampusAI Insights</span>
            </h3>
            
            <div className="space-y-3 relative z-10">
              <div className="bg-[#FFFFFF]/50 backdrop-blur-sm p-4 rounded-2xl border border-[var(--border-color)] hover:-translate-y-0.5 transition-transform">
                <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed">
                  "Your Cloud Computing attendance has dropped by 8% this month. Attending the next 4 classes will raise it back to 80%."
                </p>
              </div>
              <div className="bg-[#FFFFFF]/50 backdrop-blur-sm p-4 rounded-2xl border border-[var(--border-color)] hover:-translate-y-0.5 transition-transform">
                <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed">
                  "Perfect attendance on Tuesdays! However, Fridays show a 12% higher absence rate. Try not to miss this Friday."
                </p>
              </div>
              <div className="bg-[#FFFFFF]/50 backdrop-blur-sm p-4 rounded-2xl border border-[var(--border-color)] hover:-translate-y-0.5 transition-transform">
                <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed flex items-center space-x-2">
                  <span className="text-xl">🔥</span> <span>Amazing 12-day attendance streak! Keep it up.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Goal Calculator */}
          <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
            <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-widest text-sm flex items-center space-x-2 mb-4">
              <Calculator className="w-4 h-4 text-[var(--olive-primary)]" />
              <span>Goal Calculator</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Target Attendance %</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="75" max="100" 
                    value={goalTarget} 
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--olive-primary)]"
                  />
                  <span className="text-lg font-extrabold text-[var(--text-primary)] w-12 text-right">{goalTarget}%</span>
                </div>
              </div>
              <div className="p-4 bg-[var(--olive-primary)]/10 rounded-2xl border border-[var(--olive-primary)]/20 text-center">
                <p className="text-xs font-bold text-[var(--olive-primary)]">
                  {calculateGoal()}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Heatmap / Calendar */}
          <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
            <h3 className="font-extrabold text-[var(--text-primary)] uppercase tracking-widest text-sm mb-4">Monthly Heatmap</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {['S','M','T','W','T','F','S'].map(day => (
                <div key={day} className="text-[10px] font-bold text-center text-[var(--text-secondary)] mb-1">{day}</div>
              ))}
              {attendance.calendar.map((day, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square rounded-md transition-all hover:scale-110 cursor-help"
                  style={{ backgroundColor: day.color }}
                  title={`${day.date} August: ${day.status.toUpperCase()}`}
                ></div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#59624A]"></div><span className="text-[10px] font-bold text-[var(--text-secondary)]">Present</span></div>
              <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><span className="text-[10px] font-bold text-[var(--text-secondary)]">Absent</span></div>
              <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]"></div><span className="text-[10px] font-bold text-[var(--text-secondary)]">Holiday</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📅 INTERACTIVE MODAL: SCHEDULE MENTOR INTERVENTION MEETING */}
      {/* ========================================================================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="premium-card p-6 md:p-8 rounded-3xl border border-[var(--border-color)] max-w-xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">Schedule 1-on-1 Mentor Intervention</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-semibold">Academic Attendance & Counseling Protocol</p>
                </div>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              
              {/* Student Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                  Target Disengaged Student
                </label>
                <select
                  value={mentorMeetingForm.studentId}
                  onChange={(e) => {
                    const stu = disengagedStudents.find(s => s.id === e.target.value);
                    if (stu) {
                      setMentorMeetingForm(prev => ({
                        ...prev,
                        studentId: stu.id,
                        studentName: stu.name,
                        section: stu.section,
                        attendance: stu.attendance,
                        mentorName: stu.mentor || prev.mentorName,
                        agenda: `Attendance Shortage (${stu.attendance}%) & Remedial Recovery Plan`
                      }));
                    }
                  }}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                >
                  {disengagedStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.section}) - {s.attendance}% Attendance [{s.riskLevel} Risk]
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned Faculty Mentor */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                  Assigned Faculty Mentor / Counselor
                </label>
                <select
                  value={mentorMeetingForm.mentorName}
                  onChange={(e) => setMentorMeetingForm({...mentorMeetingForm, mentorName: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                >
                  <option value="Dr. K. Arulmani (Prof / CSE)">Dr. K. Arulmani (Prof / Senior Faculty Counselor)</option>
                  <option value="Dr. S. Kanthimathi (HOD / CSE)">Dr. S. Kanthimathi (Head of Department / CSE)</option>
                  <option value="Prof. P. Ramesh (Asst. Prof / CSE)">Prof. P. Ramesh (Academic Class Advisor)</option>
                  <option value="Dr. M. Suresh (Dean Academics)">Dr. M. Suresh (Dean of Student Affairs)</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    required
                    value={mentorMeetingForm.date}
                    onChange={(e) => setMentorMeetingForm({...mentorMeetingForm, date: e.target.value})}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                    Time Slot
                  </label>
                  <select
                    value={mentorMeetingForm.time}
                    onChange={(e) => setMentorMeetingForm({...mentorMeetingForm, time: e.target.value})}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  >
                    <option value="09:30 AM">09:30 AM (Before 1st Lecture)</option>
                    <option value="10:30 AM">10:30 AM (Morning Tea Break)</option>
                    <option value="01:00 PM">01:00 PM (Lunch Break)</option>
                    <option value="03:30 PM">03:30 PM (Evening Advisory Slot)</option>
                    <option value="04:30 PM">04:30 PM (Post-College Hours)</option>
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                  Counseling Venue / Location
                </label>
                <select
                  value={mentorMeetingForm.venue}
                  onChange={(e) => setMentorMeetingForm({...mentorMeetingForm, venue: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                >
                  <option value="CSE HOD Cabin (Main Building MB-01, Floor 2)">CSE HOD Cabin (Main Building MB-01, Floor 2)</option>
                  <option value="Faculty Advisory Cabin 14 (Kalam Block AKB-02)">Faculty Advisory Cabin 14 (Kalam Block AKB-02)</option>
                  <option value="Counseling Bay 3 (Central Library LIB-04)">Counseling Bay 3 (Central Library LIB-04)</option>
                  <option value="Virtual Google Meet Link & Parent Phone Call">Virtual Google Meet Link & Parent Phone Call</option>
                </select>
              </div>

              {/* Agenda / Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                  Counseling Agenda & Intervention Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={mentorMeetingForm.agenda}
                  onChange={(e) => setMentorMeetingForm({...mentorMeetingForm, agenda: e.target.value})}
                  placeholder="Enter specific recovery requirements, lab attendance catchups, etc."
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] custom-scrollbar"
                />
              </div>

              {/* Interconnected Notification Notice */}
              <div className="p-3 bg-[var(--olive-primary)]/10 rounded-xl border border-[var(--olive-primary)]/20 text-xs font-semibold text-[var(--olive-primary)] flex items-center gap-2">
                <BellRing className="w-4 h-4 shrink-0" />
                <span>Automatically alerts Student Portal, Faculty Dashboard, and Smart Notice Board upon confirmation.</span>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 glass-editorial text-[var(--text-secondary)] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 btn-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Schedule Meeting
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    </div>
  );
}

function KPICard({ title, value, subtext, icon: Icon, color }) {
  return (
    <div className="premium-card glow-effect p-5 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-default">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">{title}</h4>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1">{subtext}</div>
      </div>
    </div>
  );
}

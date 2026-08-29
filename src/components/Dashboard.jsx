import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Bot,
  GraduationCap,
  Trophy,
  Zap,
  Flame,
  ShieldCheck,
  Crown,
  Users,
  ChevronRight,
  Info,
  Medal,
  Cpu,
  Layers,
  Star
} from 'lucide-react';

export default function Dashboard({ onNavigateTab, onAskAI }) {
  const { 
    currentUser, 
    QUICK_TILES, 
    attendance, 
    STUDENT_PROFILE, 
    studentXp, 
    leagueData 
  } = useApp();

  const [activeLeague, setActiveLeague] = useState('class'); // 'class' | 'department' | 'campus'
  const [showXpBreakdown, setShowXpBreakdown] = useState(false);

  const currentLeague = leagueData[activeLeague] || leagueData.class;
  const currentLeaderboard = currentLeague.leaderboard;
  const topThree = currentLeaderboard.slice(0, 3);

  // Calculate percentage to next level
  const prevLevelBase = (studentXp.level - 1) * 250;
  const xpProgress = Math.min(100, Math.round((studentXp.totalXp / studentXp.nextLevelXp) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* Top Header Card - Deep Wine-Red / Crimson Morphism Header */}
      <div className="premium-card glow-effect border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-editorial relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[var(--olive-primary)]/10 border border-[var(--olive-primary)]/20 text-[var(--olive-primary)] text-xs font-extrabold rounded-full tracking-wider uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              STUDENT COCKPIT
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-semibold">• IFET CSE Semester VI</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
            Hello, <span className="text-[var(--olive-primary)]">{currentUser?.name || STUDENT_PROFILE.name}!</span> 👋
          </h1>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-xl">
            Welcome to your CAMPUSX AI cockpit. You have 3 classes today, next lecture is at Room 269, and you are currently <strong className="text-[var(--olive-primary)]">Rank #{currentLeague.userRank}</strong> in the {currentLeague.name}!
          </p>
        </div>

        {/* CTA Pill Buttons with Skeuomorphic Depth */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onAskAI("What is my schedule for today and room location?")}
            className="btn-primary rounded-2xl px-5 py-3 text-xs flex items-center space-x-2 font-bold uppercase tracking-wider"
          >
            <Bot className="w-4 h-4 text-[#FFFFFF]" />
            <span>Ask CampusAI</span>
          </button>
          
          <button
            onClick={() => onNavigateTab('attendance')}
            className="btn-secondary rounded-2xl px-5 py-3 text-xs flex items-center space-x-2 font-bold uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--olive-primary)]" />
            <span>Attendance & Mentors</span>
          </button>
        </div>

        {/* Background Decorative Circles */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-[var(--olive-primary)]/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 🚀 FEATURE 2: STUDENT XP POINTS COCKPIT & GAMIFICATION SYSTEM */}
      {/* ========================================================================= */}
      <div className="premium-card glow-effect p-6 md:p-8 rounded-3xl border-2 border-[var(--olive-primary)]/40 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--olive-primary)]/10 shadow-editorial space-y-6">
        
        {/* XP Header & Level Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#59624A] to-[#3a4130] p-1 shadow-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest block text-[#FAF8F3]/80">LEVEL</span>
                  <span className="text-2xl font-black">{studentXp.level}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-[var(--bg-card)]">
                {studentXp.tierBadge}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20">
                  {studentXp.tier} Tier
                </span>
                <span className="text-xs font-bold text-[var(--text-secondary)]">{studentXp.percentile}</span>
              </div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] mt-1">
                {studentXp.levelTitle}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-semibold mt-0.5">
                Earned from Hackathons, Workshops, Academic Activities & Consistent Attendance
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-left sm:text-right">
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Total Experience Points</div>
              <div className="text-3xl font-black text-[var(--olive-primary)] font-mono flex items-center gap-1 sm:justify-end">
                <Zap className="w-6 h-6 fill-current text-amber-500" />
                <span>{studentXp.totalXp.toLocaleString()} XP</span>
              </div>
              <div className="text-[11px] font-bold text-[var(--text-secondary)]">
                {studentXp.nextLevelXp - studentXp.totalXp} XP to Level {studentXp.level + 1}
              </div>
            </div>

            <button
              onClick={() => setShowXpBreakdown(!showXpBreakdown)}
              className="px-4 py-2.5 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--olive-primary)] rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Info className="w-4 h-4" />
              <span>{showXpBreakdown ? 'Hide Breakdown' : 'XP Breakdown'}</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold">
            <span className="text-[var(--text-primary)]">Level {studentXp.level} Progress</span>
            <span className="text-[var(--olive-primary)] font-mono">{studentXp.totalXp} / {studentXp.nextLevelXp} XP ({xpProgress}%)</span>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] h-3 rounded-full overflow-hidden p-0.5 border border-[var(--border-color)]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[var(--olive-primary)] via-amber-500 to-[var(--olive-primary)] transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* 4 Pillars of XP Points (Hackathons, Workshops, Academics, Attendance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Hackathons */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[var(--border-color)] hover:bg-white/95 transition-all shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                +{studentXp.activities.hackathons.xp} XP
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Hackathons</h4>
              <p className="text-[11px] font-bold text-[var(--text-secondary)]">{studentXp.activities.hackathons.count} Inter-College Events</p>
            </div>
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] line-clamp-2 pt-1 border-t border-black/5">
              {studentXp.activities.hackathons.details}
            </p>
          </div>

          {/* Workshops */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[var(--border-color)] hover:bg-white/95 transition-all shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                +{studentXp.activities.workshops.xp} XP
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Workshops & Bootcamps</h4>
              <p className="text-[11px] font-bold text-[var(--text-secondary)]">{studentXp.activities.workshops.count} Certified Sessions</p>
            </div>
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] line-clamp-2 pt-1 border-t border-black/5">
              {studentXp.activities.workshops.details}
            </p>
          </div>

          {/* Academic Contests */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[var(--border-color)] hover:bg-white/95 transition-all shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                +{studentXp.activities.academics.xp} XP
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Academic Activities</h4>
              <p className="text-[11px] font-bold text-[var(--text-secondary)]">{studentXp.activities.academics.count} Quizzes & Contests</p>
            </div>
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] line-clamp-2 pt-1 border-t border-black/5">
              {studentXp.activities.academics.details}
            </p>
          </div>

          {/* Attendance Multiplier */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[var(--border-color)] hover:bg-white/95 transition-all shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +{studentXp.activities.attendance.xp} XP
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Attendance Multiplier</h4>
              <p className="text-[11px] font-bold text-[var(--text-secondary)]">{attendance.Overall.percentage}% Consistency Margin</p>
            </div>
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] line-clamp-2 pt-1 border-t border-black/5">
              {studentXp.activities.attendance.details}
            </p>
          </div>

        </div>

        {/* Earned Badges Showcase */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <Medal className="w-4 h-4 text-[var(--olive-primary)]" />
              Recent Achievement Badges
            </span>
            <span className="text-[11px] font-bold text-[var(--olive-primary)]">4 / 12 Unlocked</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {studentXp.recentBadges.map(badge => (
              <div key={badge.id} className="p-3 bg-[var(--bg-secondary)]/80 rounded-xl border border-[var(--border-color)] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[var(--olive-primary)] text-white shadow-sm">
                  {badge.icon === 'Trophy' && <Trophy className="w-4 h-4" />}
                  {badge.icon === 'Cpu' && <Cpu className="w-4 h-4" />}
                  {badge.icon === 'ShieldCheck' && <ShieldCheck className="w-4 h-4" />}
                  {badge.icon === 'Star' && <Star className="w-4 h-4" />}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-[var(--text-primary)]">{badge.title}</h5>
                  <p className="text-[10px] font-bold text-amber-600">{badge.rarity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🏆 FEATURE 2 (PART B): MULTI-LEVEL LEAGUES LEADERBOARD */}
      {/* ========================================================================= */}
      <div className="premium-card glow-effect p-6 md:p-8 rounded-3xl border border-[var(--border-color)] shadow-editorial space-y-6">
        
        {/* League Navigation Tabs & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-extrabold rounded-full tracking-wider uppercase flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 fill-current" />
                CAMPUS LEADERBOARDS
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-semibold">• Real-Time League Rankings</span>
            </div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mt-1">
              Multi-Level Student Leagues
            </h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-0.5">
              Compete across Class, Department, and University levels powered by your XP points.
            </p>
          </div>

          {/* 3 League Switcher Buttons */}
          <div className="flex p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-x-1.5 self-start md:self-auto">
            {[
              { id: 'class', label: 'Class League', sub: 'CSE-A' },
              { id: 'department', label: 'Department League', sub: 'CSE Dept' },
              { id: 'campus', label: 'Campus Level League', sub: 'All IFET' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLeague(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all ${
                  activeLeague === tab.id
                    ? 'bg-[var(--olive-primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Rank Quick Status Banner */}
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--olive-primary)] text-white flex items-center justify-center font-black text-lg shadow-md">
              #{currentLeague.userRank}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">
                Your Standing in {currentLeague.name}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-semibold">
                Rank <strong className="text-[var(--text-primary)]">#{currentLeague.userRank}</strong> of {currentLeague.totalMembers} Students • Rank Gain: <span className="text-emerald-600 font-extrabold">{currentLeague.rankDelta} this week</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">Perk:</span>
            <span className="px-3 py-1 bg-white rounded-xl text-xs font-bold text-[var(--olive-primary)] border border-[var(--border-color)] shadow-sm">
              {activeLeague === 'class' ? 'Fast-Track Lab Access Pass' : activeLeague === 'department' ? 'Hackathon Travel Sponsorship' : 'Placement Day 1 Priority'}
            </span>
          </div>
        </div>

        {/* Top 3 Podium Visual Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 p-5 rounded-2xl border border-[var(--border-color)] bg-white/60 flex flex-col items-center text-center space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-md absolute top-3 left-3">
                #2
              </div>
              <div className="relative">
                <img src={topThree[1].avatar} alt={topThree[1].name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md" />
                <span className="absolute -bottom-2 -right-2 text-base">🥈</span>
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center justify-center gap-1">
                  <span>{topThree[1].name}</span>
                </h5>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{topThree[1].section || topThree[1].dept || 'CSE-A'}</p>
              </div>
              <div className="px-3 py-1 bg-[var(--bg-secondary)] rounded-full text-xs font-black text-[var(--olive-primary)] font-mono">
                {topThree[1].xp.toLocaleString()} XP
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Elevated) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 p-6 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/10 via-[var(--bg-card)] to-[var(--bg-card)] flex flex-col items-center text-center space-y-3 relative md:-translate-y-2 shadow-lg">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-md absolute top-3 left-3">
                👑 #1
              </div>
              <div className="relative">
                <img src={topThree[0].avatar} alt={topThree[0].name} className="w-20 h-20 rounded-2xl object-cover border-3 border-amber-400 shadow-lg" />
                <span className="absolute -bottom-2 -right-2 text-xl">🥇</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-2 py-0.5 bg-amber-100 rounded-md">LEAGUE CHAMPION</span>
                <h5 className="font-extrabold text-base text-[var(--text-primary)] mt-1">{topThree[0].name}</h5>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{topThree[0].section || topThree[0].dept || 'CSE-A'}</p>
              </div>
              <div className="px-4 py-1.5 bg-amber-500 text-white rounded-full text-sm font-black font-mono shadow-sm">
                {topThree[0].xp.toLocaleString()} XP
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="order-3 p-5 rounded-2xl border border-[var(--border-color)] bg-white/60 flex flex-col items-center text-center space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="w-7 h-7 rounded-full bg-amber-700/60 text-white font-black text-xs flex items-center justify-center shadow-md absolute top-3 left-3">
                #3
              </div>
              <div className="relative">
                <img src={topThree[2].avatar} alt={topThree[2].name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-700/40 shadow-md" />
                <span className="absolute -bottom-2 -right-2 text-base">🥉</span>
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-[var(--text-primary)]">{topThree[2].name}</h5>
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{topThree[2].section || topThree[2].dept || 'CSE-A'}</p>
              </div>
              <div className="px-3 py-1 bg-[var(--bg-secondary)] rounded-full text-xs font-black text-[var(--olive-primary)] font-mono">
                {topThree[2].xp.toLocaleString()} XP
              </div>
            </div>
          )}

        </div>

        {/* Full Leaderboard Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Tier & Level</th>
                <th className="py-3 px-4 text-center">Hackathons</th>
                <th className="py-3 px-4 text-center">Workshops</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-xs font-bold">
              {currentLeaderboard.map((student) => {
                const isYou = student.isCurrent || student.name.includes('You') || student.regNo === STUDENT_PROFILE.regNo;
                return (
                  <tr 
                    key={student.rank}
                    className={`transition-colors ${
                      isYou 
                        ? 'bg-[var(--olive-primary)]/15 border-l-4 border-[var(--olive-primary)] font-extrabold' 
                        : 'hover:bg-white/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          student.rank === 1 ? 'bg-amber-400 text-amber-950' : student.rank === 2 ? 'bg-slate-300 text-slate-800' : student.rank === 3 ? 'bg-amber-700 text-white' : 'text-[var(--text-secondary)]'
                        }`}>
                          {student.rank}
                        </span>
                      </div>
                    </td>

                    {/* Student Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-xl object-cover border border-[var(--border-color)] shadow-sm" />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-sm ${isYou ? 'text-[var(--olive-primary)] font-black' : 'text-[var(--text-primary)]'}`}>
                              {student.name}
                            </span>
                            {isYou && (
                              <span className="px-2 py-0.5 bg-[var(--olive-primary)] text-white text-[9px] font-black rounded-md uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
                            {student.regNo} • {student.section || student.dept || 'CSE-A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tier & Level */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded-md text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                          Lvl {student.level}
                        </span>
                        <span className="text-[10px] font-extrabold text-amber-600">
                          {student.tier}
                        </span>
                      </div>
                    </td>

                    {/* Hackathons */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600">
                      {student.hackathons}
                    </td>

                    {/* Workshops */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600">
                      {student.workshops}
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                      {student.attendance}
                    </td>

                    {/* Total XP */}
                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-[var(--olive-primary)]">
                      {student.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Main Curved Morphism Sheet (`rounded-t-[36px]`) */}
      <div className="space-y-8 rounded-b-3xl">

        {/* Academic Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="premium-card glow-effect p-5 space-y-2 rounded-2xl">
            <div className="flex items-center justify-between text-[var(--olive-primary)]">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[var(--olive-primary)]/10 rounded-md">CGPA</span>
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{STUDENT_PROFILE.cgpa}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Top 5% in CSE Department</div>
          </div>

          <div className="premium-card glow-effect p-5 space-y-2 rounded-2xl">
            <div className="flex items-center justify-between text-[var(--olive-primary)]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[var(--olive-primary)]/10 rounded-md">SAFE</span>
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{attendance.Overall.percentage}%</div>
            <div className="text-[11px] text-[var(--text-secondary)]">Above 75% Mandatory Margin</div>
          </div>

          <div className="premium-card glow-effect p-5 space-y-2 rounded-2xl">
            <div className="flex items-center justify-between text-[var(--olive-primary)]">
              <Award className="w-5 h-5" />
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[var(--olive-primary)]/10 rounded-md">CREDITS</span>
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{STUDENT_PROFILE.credits} <span className="text-sm font-normal text-[var(--text-secondary)]">/ {STUDENT_PROFILE.totalCredits}</span></div>
            <div className="text-[11px] text-[var(--text-secondary)]">Anna University Autonomous</div>
          </div>

          <div className="premium-card glow-effect p-5 space-y-2 rounded-2xl">
            <div className="flex items-center justify-between text-[var(--olive-primary)]">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[var(--olive-primary)]/10 rounded-md">SEMESTER</span>
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">Sem VI</div>
            <div className="text-[11px] text-[var(--text-secondary)]">B.E. Computer Science</div>
          </div>

        </div>

        {/* Quick Action Navigation Grid */}
        <div>
          <div className="inline-flex items-center space-x-2 px-4 py-2 premium-card glow-effect !p-0 !px-4 !py-2 rounded-xl mb-4">
            <Sparkles className="w-4 h-4 text-[var(--olive-primary)]" />
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">
              Campus Services & Modules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_TILES.map((tile) => (
              <div
                key={tile.id}
                onClick={() => onNavigateTab(tile.tab)}
                className="premium-card glow-effect p-5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all cursor-pointer group flex items-start justify-between space-x-4 hover:-translate-y-0.5"
              >
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[var(--text-primary)] group-hover:text-[var(--olive-primary)] transition flex items-center space-x-2">
                    <span>{tile.title}</span>
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">{tile.desc}</p>
                </div>
                <div className="p-2.5 glass-editorial text-[var(--olive-primary)] rounded-xl shadow-sm group-hover:bg-[var(--olive-primary)] group-hover:text-[#FFFFFF] transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule Overview Card */}
        <div className="premium-card glow-effect p-6 space-y-4 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[var(--olive-primary)]" />
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">Today's Class Schedule (Wednesday)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="text-xs font-extrabold text-[var(--olive-primary)] hover:text-[#4a523e] flex items-center space-x-1 transition-colors"
            >
              <span>Full Weekly View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { time: "09:00 - 10:30 AM", subject: "Artificial Intelligence & ML", room: "Room 269 (Kalam Block)", faculty: "Dr. S. Kanthimathi", active: true },
              { time: "10:45 - 12:15 PM", subject: "Cloud Computing & DevOps", room: "AI Lab (Kalam Block)", faculty: "Prof. P. Ramesh", active: false },
              { time: "01:30 - 03:00 PM", subject: "Distributed Database Systems", room: "Room 214 (Visvesvaraya Block)", faculty: "Dr. M. Suresh", active: false }
            ].map((cls, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  cls.active
                    ? 'bg-[var(--bg-card)] border border-[var(--olive-primary)]/30 shadow-md'
                    : 'bg-[var(--bg-secondary)] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${cls.active ? 'bg-[var(--olive-primary)] text-[#FFFFFF] shadow-md' : 'bg-white/50 text-[var(--text-secondary)]'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[var(--text-primary)] flex items-center space-x-2">
                      <span>{cls.subject}</span>
                      {cls.active && (
                        <span className="px-2 py-0.5 bg-[var(--olive-primary)] text-white text-[10px] font-extrabold rounded-md uppercase tracking-wider animate-pulse shadow-sm">
                          Upcoming Next
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center space-x-3">
                      <span className="flex items-center"><MapPin className="w-3 h-3 text-[var(--olive-primary)] mr-1" />{cls.room}</span>
                      <span>Faculty: {cls.faculty}</span>
                    </div>
                  </div>
                </div>

                <div className={`text-xs font-mono font-bold sm:text-right ${cls.active ? 'text-[var(--olive-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {cls.time}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


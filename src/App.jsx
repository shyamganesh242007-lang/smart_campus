import React, { useState, useEffect } from 'react';
import Campus3D from './components/Campus3D';
import CampusAI from './components/CampusAI';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import Timetable from './components/Timetable';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import ExamSeatFinder from './components/ExamSeatFinder';
import EventHub from './components/EventHub';
import NoticeBoard from './components/NoticeBoard';
import EmergencySOS from './components/EmergencySOS';

import ContestWalkthrough from './components/ContestWalkthrough';
import AnimatedBackground from './components/AnimatedBackground';
import Login from './components/Login';
import { useApp } from './context/AppContext';

import {
  Box,
  Bot,
  LayoutDashboard,
  Calendar,
  Calculator,
  GraduationCap,
  Award,
  Bell,
  Home,
  User,
  Sparkles,
  Compass,
  Mail,
  LogOut,
  ChevronDown,
  MapPin,
  CalendarDays,
  BookOpen
} from 'lucide-react';

export default function App() {
  const { currentUser, login, logout, emergencyAlerts, BUILDINGS_DATA, STUDENT_PROFILE } = useApp();
  
  const [activeTab, setActiveTab] = useState('3d');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New event: AI Hackathon 2026', time: '10m ago', unread: true },
    { id: 2, text: 'Your attendance is updated', time: '1h ago', unread: true },
    { id: 3, text: 'New Notice: Holiday tomorrow', time: '2h ago', unread: false }
  ]);

  // If new emergency alerts come in, we can also push a notification or switch tab
  useEffect(() => {
    if (emergencyAlerts && emergencyAlerts.length > 0) {
      setNotifications(prev => [
        { id: Date.now(), text: `EMERGENCY: ${emergencyAlerts[0].message}`, time: 'Just now', unread: true },
        ...prev
      ]);
      setActiveRoute({ buildingId: 'fountain_square', title: 'EVACUATION ROUTE TO SAFE ZONE' });
      setActiveTab('3d');
    } else {
      setActiveRoute(null);
    }
  }, [emergencyAlerts]);

  // Default active tab based on role when they log in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') setActiveTab('admin_dash');
      else if (currentUser.role === 'staff') setActiveTab('staff_dash');
      else setActiveTab('3d');
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };
  
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');

  // Handle 3D Route Launch Trigger from any component
  const handleTriggerRoute = ({ buildingId, title }) => {
    setActiveTab('3d');
    const targetBuilding = BUILDINGS_DATA.find(b => b.id === buildingId) || BUILDINGS_DATA[1];
    setSelectedBuilding(targetBuilding);
    setActiveRoute({ buildingId, title });
  };

  // Handle Ask AI button trigger from 3D or buildings
  const handleAskAI = (promptText) => {
    setAiPrompt(promptText);
    setActiveTab('ai');
  };

  // Contest WOW Flow Automated Step Executor
  const handleExecuteContestStep = (stepKey) => {
    switch (stepKey) {
      case '3d':
        setActiveTab('3d');
        setSelectedBuilding(null);
        setActiveRoute(null);
        break;
      case '3d_select':
        setActiveTab('3d');
        setSelectedBuilding(BUILDINGS_DATA[1]); // Kalam Block
        break;
      case 'ai':
        handleAskAI('What is my CSE attendance percentage and next class room number?');
        break;
      case 'attendance':
        setActiveTab('attendance');
        break;
      case 'events':
        setActiveTab('events');
        break;
      case 'exam':
        setActiveTab('exam');
        break;
      case 'route':
        handleTriggerRoute({ buildingId: 'kalam_block', title: 'Contest Flyover: Route to Room 269 (Kalam Block)' });
        break;
      default:
        setActiveTab('3d');
    }
  };

  // Global Mouse Tracker for Glow Effect
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] font-sans selection:bg-[var(--olive-primary)] selection:text-[#FFFFFF] relative overflow-hidden bg-[var(--bg-main)]">
        <AnimatedBackground />
        <Login onLogin={login} />
      </div>
    );
  }

  // Get Nav items based on role
  const getNavItems = () => {
    if (currentUser.role === 'admin') {
      return [
        { id: 'admin_dash', label: 'Admin Console', icon: LayoutDashboard },
        { id: '3d', label: '3D Campus', icon: Compass },
        { id: 'events', label: 'Events Hub', icon: Award },
        { id: 'notices', label: 'Notices', icon: Bell }
      ];
    } else if (currentUser.role === 'staff') {
      return [
        { id: 'staff_dash', label: 'Faculty Portal', icon: LayoutDashboard },
        { id: '3d', label: '3D Campus', icon: Compass },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'events', label: 'Events Hub', icon: Award },
        { id: 'notices', label: 'Notices', icon: Bell }
      ];
    } else {
      return [
        { id: '3d', label: '3D Campus', icon: Compass },
        { id: 'ai', label: 'CampusAI', icon: Bot, highlight: true },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'attendance', label: 'Attendance Calc', icon: Calculator },
        { id: 'exam', label: 'Exam Seat', icon: GraduationCap },
        { id: 'events', label: 'Events Hub', icon: Award },
        { id: 'notices', label: 'Notices', icon: Bell }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--olive-primary)] selection:text-[#FFFFFF] relative">
      
      {/* Global Animated Background */}
      <AnimatedBackground />

      {/* Contest Presentation Walkthrough Banner */}
      <ContestWalkthrough onExecuteStep={handleExecuteContestStep} />

      {/* Desktop / Laptop Top Navigation Bar */}
      <header className="sticky top-0 z-30 glass-editorial border-b-0 px-4 lg:px-8 py-3 flex items-center justify-between shadow-editorial">
        {/* Brand Logo & College Title */}
        <div
          onClick={() => setActiveTab('3d')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--olive-primary)] flex items-center justify-center text-[#FFFFFF] font-extrabold shadow-editorial group-hover:-translate-y-0.5 transition">
            <Box className="w-6 h-6 text-[#FFFFFF]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">CAMPUS<span className="text-[var(--olive-primary)]">X</span></span>
              <span className="px-2 py-0.5 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] text-[10px] font-extrabold rounded-md border border-[var(--border-color)]">
                AI TWIN
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-medium">IFET College of Engineering Smart Portal</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1.5 p-1.5 rounded-2xl border border-[var(--border-color)] skeuo-inset bg-[#f2eee3]/70 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'btn-primary'
                    : item.highlight
                    ? 'text-[var(--olive-primary)] hover:bg-white/80'
                    : 'text-[var(--text-secondary)] hover:bg-white/60 hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFFFFF]' : item.highlight ? 'text-[var(--olive-primary)]' : 'text-[var(--text-secondary)]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Top Right Actions (Notifications & Profile) */}
        <div className="hidden lg:flex items-center space-x-3">
          
          {/* Notifications Widget */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2.5 glass-editorial rounded-full text-[var(--text-secondary)] hover:text-[var(--olive-primary)] shadow-editorial hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--bg-card)]"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 premium-card glow-effect !p-0 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200 border border-[var(--border-color)]">
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-card)]/50 rounded-t-2xl">
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)] tracking-wide">Notifications</h4>
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}
                    className="text-[10px] font-bold text-[var(--olive-primary)] hover:text-[var(--olive-hover)] transition-colors uppercase tracking-wider"
                  >
                    Mark all read
                  </button>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--bg-secondary)] transition-colors flex gap-3 ${notif.unread ? 'bg-[var(--olive-primary)]/5' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-[var(--olive-primary)]' : 'bg-transparent'}`}></div>
                      <div>
                        <p className={`text-xs ${notif.unread ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'}`}>{notif.text}</p>
                        <p className="text-[10px] font-semibold text-[var(--text-secondary)]/70 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-xs font-bold text-[var(--text-secondary)]">No new notifications</div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 rounded-b-2xl text-center">
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider p-2 w-full"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Widget */}
          <div className="relative">
            <div 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
            className="hidden lg:flex items-center space-x-3 cursor-pointer group p-1.5 bg-[var(--bg-card)]/60 rounded-full border border-[var(--border-color)] shadow-sm backdrop-blur-lg pr-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <img 
              src={STUDENT_PROFILE.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-[var(--olive-primary)]/30 group-hover:border-[var(--olive-primary)] transition"
            />
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-[var(--text-primary)] leading-none mb-0.5">{currentUser.name}</span>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium leading-none">{currentUser.id}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 premium-card glow-effect !p-0 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200 border border-[var(--border-color)]">
              {/* Header */}
              <div className="p-5 border-b border-[var(--border-color)] flex items-center space-x-4">
                <img src={STUDENT_PROFILE.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--olive-primary)]/30" />
                <div>
                  <h4 className="text-base font-extrabold text-[var(--text-primary)]">{currentUser.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{currentUser.department}</p>
                </div>
              </div>
              
              {/* Details List */}
              <div className="p-3 space-y-1">
                <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <User className="w-4 h-4 text-[var(--olive-primary)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">ID</p>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{currentUser.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <CalendarDays className="w-4 h-4 text-[var(--olive-primary)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">Date of Birth</p>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{STUDENT_PROFILE.dob}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <GraduationCap className="w-4 h-4 text-[var(--olive-primary)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">Year & Section</p>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{STUDENT_PROFILE.year} • {STUDENT_PROFILE.section}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <Mail className="w-4 h-4 text-[var(--olive-primary)]" />
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider">Email ID</p>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{STUDENT_PROFILE.email}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-color)] flex items-center justify-between">
                <button 
                  onClick={() => {
                    setActiveTab('dashboard');
                    setIsProfileOpen(false);
                  }}
                  className="text-xs font-bold text-[var(--olive-primary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5"
                >
                  View Full Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center space-x-2 px-3"
                  title="Logout"
                >
                  <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Main View Area — overflow-hidden here (not on root) is safe: it clips decorative BG elements
          but does NOT create a stacking context for fixed children INSIDE Campus3D because Campus3D
          uses position:fixed which escapes ANY ancestor's overflow. */}
      <main className="flex-1 relative z-10 overflow-hidden" style={{ minHeight: 0 }}>
        {activeTab === '3d' && (
          <Campus3D
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            activeRoute={activeRoute}
            isEmergency={emergencyAlerts && emergencyAlerts.length > 0}
            onClearRoute={() => setActiveRoute(null)}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === 'ai' && (
          <div className="py-6">
            <CampusAI
              initialPrompt={aiPrompt}
              onTriggerRoute={handleTriggerRoute}
              onNavigateTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="py-6">
            <Dashboard
              onNavigateTab={setActiveTab}
              onAskAI={handleAskAI}
            />
          </div>
        )}

        {activeTab === 'staff_dash' && (
          <div className="py-6">
            <StaffDashboard />
          </div>
        )}

        {activeTab === 'admin_dash' && (
          <div className="py-6">
            <AdminDashboard onNavigateTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="py-6">
            <Timetable onTriggerRoute={handleTriggerRoute} />
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="py-6">
            <AttendanceAnalytics />
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="py-6">
            <ExamSeatFinder onTriggerRoute={handleTriggerRoute} userRegNo={currentUser?.id} />
          </div>
        )}

        {activeTab === 'events' && (
          <div className="py-6">
            <EventHub onTriggerRoute={handleTriggerRoute} />
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="py-6">
            <NoticeBoard onAskAI={handleAskAI} />
          </div>
        )}
      </main>

      {/* Persistent Emergency SOS Floating Action Button & Modal */}
      <EmergencySOS onTriggerRoute={handleTriggerRoute} />

      {/* Mobile Bottom Navigation Bar (Home | AI | Schedule | Events | Profile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-editorial px-2 py-2 shadow-[0_-10px_40px_rgba(30,30,30,0.08)]">
        <div className="grid grid-cols-4 gap-1">
          {navItems.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                  isActive ? 'text-[var(--olive-primary)] font-extrabold bg-[var(--olive-primary)]/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--olive-primary)]' : 'text-[var(--text-secondary)]'}`} />
                <span className="text-[10px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

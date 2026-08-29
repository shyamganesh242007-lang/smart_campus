import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  STUDENT_PROFILE, 
  AI_PRESET_PROMPTS, 
  QUICK_TILES, 
  BUILDINGS_DATA, 
  TIMETABLE_DATA, 
  EXAM_SEAT_DEMO, 
  INTER_COLLEGE_EVENTS, 
  SMART_NOTICES, 
  EMERGENCY_CONTACTS, 
  MY_DAY_TIMELINE, 
  ATTENDANCE_DATA,
  DISENGAGED_STUDENTS,
  INITIAL_MENTOR_MEETINGS,
  STUDENT_XP_BREAKDOWN,
  LEAGUE_DATA,
  INITIAL_EVENT_REGISTRATIONS
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('campusx_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [attendance, setAttendance] = useState(ATTENDANCE_DATA);
  const [timetable, setTimetable] = useState(TIMETABLE_DATA);
  const [notices, setNotices] = useState(SMART_NOTICES);
  const [events, setEvents] = useState(INTER_COLLEGE_EVENTS);
  const [eventRegistrations, setEventRegistrations] = useState(INITIAL_EVENT_REGISTRATIONS);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  
  // Mentor Intervention & At-Risk Disengaged Students State
  const [disengagedStudents, setDisengagedStudents] = useState(DISENGAGED_STUDENTS);
  const [mentorMeetings, setMentorMeetings] = useState(INITIAL_MENTOR_MEETINGS);
  
  // Gamified XP & Multi-Tier Leagues State
  const [studentXp, setStudentXp] = useState(STUDENT_XP_BREAKDOWN);
  const [leagueData, setLeagueData] = useState(LEAGUE_DATA);
  
  // Campus Command Center Stats
  const [campusStats, setCampusStats] = useState({
    studentsOnCampus: 3450,
    activeClasses: 42,
    attendanceToday: "84.5%",
    eventsRunning: 2,
    aiRiskAlerts: 12,
    emergencyStatus: "Normal"
  });

  // --- DIGITAL TWIN SCENE CONTROLS (shared between AdminDashboard & Campus3D) ---
  const [digitalTwin, setDigitalTwin] = useState({
    showLabels: true,
    showHeatmap: false,
    showRoads: true,
    showTrees: true,
    showPOIs: true,
    showRoutes: true,
    showDecorations: true,
    isFull3DMode: false,
  });

  const setDigitalTwinKey = (key, value) => {
    setDigitalTwin(prev => ({ ...prev, [key]: value }));
  };

  const toggleDigitalTwin = (key) => {
    setDigitalTwin(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Heatmap data: hotspots with position [x, z] and intensity label
  const heatmapSpots = [
    { id: 'library',    pos: [-35, -30], radius: 14, color: '#f97316', label: 'Library',    intensity: 'High',   crowd: 187 },
    { id: 'cafeteria',  pos: [30,  30],  radius: 12, color: '#f97316', label: 'Cafeteria',  intensity: 'High',   crowd: 215 },
    { id: 'main',       pos: [0,  -10],  radius: 20, color: '#84cc16', label: 'Main Block', intensity: 'Medium', crowd: 320 },
    { id: 'auditorium', pos: [-20, 30],  radius: 10, color: '#59624A', label: 'Auditorium', intensity: 'Low',    crowd: 45  },
    { id: 'hostel',     pos: [40, -40],  radius: 8,  color: '#59624A', label: 'Hostel',     intensity: 'Low',    crowd: 62  },
  ];

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campusx_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('campusx_user');
    }
  }, [currentUser]);

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- ACTIONS ---

  const markAttendance = (subjectCode, isPresent) => {
    // A simplified mock update that just tweaks the overall percentage a bit for demonstration
    setAttendance(prev => {
      const newAttended = isPresent ? prev.Overall.attended + 1 : prev.Overall.attended;
      const newTotal = prev.Overall.total + 1;
      const newPercentage = ((newAttended / newTotal) * 100).toFixed(1);
      
      const newSubjects = prev.subjects.map(sub => {
        if (sub.code === subjectCode) {
          const sAttended = isPresent ? sub.attended + 1 : sub.attended;
          const sTotal = sub.total + 1;
          const sPerc = ((sAttended / sTotal) * 100).toFixed(1);
          return { ...sub, attended: sAttended, total: sTotal, percentage: Number(sPerc) };
        }
        return sub;
      });

      setCampusStats(s => ({
        ...s,
        attendanceToday: `${newPercentage}%`
      }));

      return {
        ...prev,
        Overall: { ...prev.Overall, attended: newAttended, total: newTotal, percentage: Number(newPercentage) },
        subjects: newSubjects
      };
    });
  };

  const createNotice = (noticeData) => {
    const newNotice = {
      id: `not-${Date.now()}`,
      date: noticeData.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: noticeData.category || 'General',
      author: noticeData.author || (currentUser?.name ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Principal Office, IFET'),
      title: noticeData.title,
      summary: noticeData.summary || noticeData.content,
      content: noticeData.content,
      ...noticeData
    };
    setNotices(prev => [newNotice, ...prev]);
    return newNotice;
  };

  const updateNotice = (noticeId, updatedData) => {
    setNotices(prev => prev.map(n => 
      n.id === noticeId ? { ...n, ...updatedData } : n
    ));
  };

  const deleteNotice = (noticeId) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  const publishNotice = (newNotice) => {
    setNotices(prev => [newNotice, ...prev]);
  };


  const scheduleMentorMeeting = (meetingData) => {
    const newMeeting = {
      id: `meet-${Date.now()}`,
      ...meetingData,
      status: 'Confirmed'
    };
    
    setMentorMeetings(prev => [newMeeting, ...prev]);

    // Update disengaged students status
    if (meetingData.studentId) {
      setDisengagedStudents(prev => prev.map(s => 
        s.id === meetingData.studentId 
          ? { ...s, status: 'Scheduled' }
          : s
      ));
    }

    // Automatically generate an interconnected high-priority Smart Notice
    publishNotice({
      id: `not-meet-${Date.now()}`,
      title: `Mentor Counseling Session Scheduled: ${meetingData.studentName}`,
      category: 'Counseling',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: meetingData.mentorName || 'Academic Advisory Cell',
      summary: `Academic intervention scheduled for ${meetingData.studentName} on ${meetingData.date} at ${meetingData.time} (${meetingData.venue}).`,
      content: `A formal 1-on-1 academic mentorship meeting has been confirmed for ${meetingData.studentName} (${meetingData.section}) with ${meetingData.mentorName}. Agenda: ${meetingData.agenda}. Venue: ${meetingData.venue}.`
    });

    return newMeeting;
  };

  const cancelMentorMeeting = (meetingId) => {
    setMentorMeetings(prev => prev.filter(m => m.id !== meetingId));
  };

  const triggerEmergency = (alertMsg) => {
    const alert = { id: Date.now(), message: alertMsg, timestamp: new Date().toLocaleTimeString() };
    setEmergencyAlerts(prev => [alert, ...prev]);
    setCampusStats(s => ({ ...s, emergencyStatus: "ACTIVE ALERT" }));
  };

  const clearEmergency = () => {
    setEmergencyAlerts([]);
    setCampusStats(s => ({ ...s, emergencyStatus: "Normal" }));
  };

  // --- EVENT ACTIONS ---
  const createEvent = (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      hostCollege: eventData.hostCollege || "IFET College of Engineering, Villupuram",
      isIFETEvent: true,
      category: eventData.category || "Technical",
      date: eventData.date,
      venue: eventData.venue || "Main Auditorium, IFET",
      prize: eventData.prize || "₹25,000 Cash Prizes",
      teamSize: eventData.teamSize || "1 - 3 Members",
      deadline: eventData.deadline || "Registration Open",
      fee: eventData.fee || "Free Entry",
      matchPercentage: 94,
      description: eventData.description,
      banner: eventData.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
      ...eventData
    };

    setEvents(prev => [newEvent, ...prev]);
    setCampusStats(s => ({ ...s, eventsRunning: s.eventsRunning + 1 }));

    // Generate smart notice for new event
    publishNotice({
      id: `not-evt-${Date.now()}`,
      title: `New Event Announced: ${newEvent.title}`,
      category: 'Events',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'IFET Event Coordination Cell',
      summary: `Registrations are now open for ${newEvent.title}. Venue: ${newEvent.venue}. Prize: ${newEvent.prize}.`,
      content: `${newEvent.description} Target Date: ${newEvent.date}. Register on the Event Hub.`
    });

    return newEvent;
  };

  const updateEvent = (eventId, updatedData) => {
    setEvents(prev => prev.map(ev => 
      ev.id === eventId ? { ...ev, ...updatedData } : ev
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
    setCampusStats(s => ({ ...s, eventsRunning: Math.max(0, s.eventsRunning - 1) }));
  };

  const registerForEvent = (regData) => {
    const newReg = {
      id: `reg-${Date.now()}`,
      registeredAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      passId: `IFET-QR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
      ...regData
    };
    setEventRegistrations(prev => [newReg, ...prev]);
    return newReg;
  };

  const approveEvent = (eventId) => {
    // In this mock, just an action to show we can change something
  };

  const value = {
    currentUser,
    login,
    logout,
    attendance,
    markAttendance,
    timetable,
    setTimetable,
    notices,
    publishNotice,
    createNotice,
    updateNotice,
    deleteNotice,
    events,
    setEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    eventRegistrations,
    setEventRegistrations,
    registerForEvent,
    approveEvent,
    emergencyAlerts,
    triggerEmergency,
    clearEmergency,
    campusStats,
    setCampusStats,
    // Mentor Intervention State & Actions
    disengagedStudents,
    setDisengagedStudents,
    mentorMeetings,
    scheduleMentorMeeting,
    cancelMentorMeeting,
    // Gamified XP & Leagues State
    studentXp,
    setStudentXp,
    leagueData,
    setLeagueData,
    // Digital Twin Scene Controls
    digitalTwin,
    setDigitalTwinKey,
    toggleDigitalTwin,
    heatmapSpots,
    // Static data that doesn't change often
    BUILDINGS_DATA,
    AI_PRESET_PROMPTS,
    QUICK_TILES,
    EXAM_SEAT_DEMO,
    EMERGENCY_CONTACTS,
    MY_DAY_TIMELINE,
    STUDENT_PROFILE
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}



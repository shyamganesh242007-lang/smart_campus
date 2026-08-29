import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, Calendar, MapPin, Sparkles, Filter, CheckCircle2, QrCode, Download, 
  X, ExternalLink, Flame, Plus, Edit3, Trash2, Users, Search, Trophy, ShieldCheck, Map
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EventHub({ onTriggerRoute }) {
  const { 
    events, 
    currentUser, 
    STUDENT_PROFILE, 
    registerForEvent, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    eventRegistrations 
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState(['evt-01']);
  const [passModalEvent, setPassModalEvent] = useState(null);

  // Admin Event Modal State (Create / Edit)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    hostCollege: 'IFET College of Engineering, Villupuram',
    category: 'Hackathon',
    date: '',
    venue: '',
    prize: '',
    teamSize: '2 - 4 Members',
    fee: 'Free Entry',
    description: ''
  });

  // Admin Registered Attendees Modal State
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const categories = ['All', 'Technical', 'Non-Technical', 'Workshop', 'Hackathon'];

  const filteredEvents = events.filter(ev =>
    selectedCategory === 'All' || ev.category === selectedCategory
  );

  // Student Registration Handler
  const handleRegister = (event) => {
    if (!registeredEvents.includes(event.id)) {
      setRegisteredEvents(prev => [...prev, event.id]);
      registerForEvent({
        eventId: event.id,
        eventTitle: event.title,
        studentName: currentUser?.name || STUDENT_PROFILE.name,
        regNo: STUDENT_PROFILE.regNo,
        dept: 'B.E CSE (CSE-A)',
        email: currentUser?.email || 'ragul.cse@ifet.ac.in',
        teamName: 'Team NeuralByte',
        teamRole: 'Team Lead'
      });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#59624A', '#879471', '#C49A3A']
      });
    }
    setPassModalEvent(event);
  };

  // Open Create Event Modal (Admin)
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setEventFormData({
      title: '',
      hostCollege: 'IFET College of Engineering, Villupuram',
      category: 'Hackathon',
      date: 'September 15, 2026',
      venue: 'Dr. APJ Abdul Kalam Auditorium, IFET',
      prize: '₹50,000 Cash + Certificates',
      teamSize: '2 - 4 Members',
      fee: 'Free Entry',
      description: 'National-level campus hackathon focused on AI innovation, Autonomous systems, and Web3.'
    });
    setIsEventModalOpen(true);
  };

  // Open Edit Event Modal (Admin)
  const handleOpenEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventFormData({
      title: event.title || '',
      hostCollege: event.hostCollege || event.college || 'IFET College of Engineering',
      category: event.category || 'Technical',
      date: event.date || '',
      venue: event.venue || event.location || '',
      prize: event.prize || event.prizes || '',
      teamSize: event.teamSize || '1 - 3 Members',
      fee: event.fee || 'Free',
      description: event.description || ''
    });
    setIsEventModalOpen(true);
  };

  // Save Event (Create or Edit)
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventFormData.title) return;

    if (editingEventId) {
      updateEvent(editingEventId, eventFormData);
      showToast(`Updated event: "${eventFormData.title}" successfully!`);
    } else {
      createEvent(eventFormData);
      showToast(`Created and published new event: "${eventFormData.title}"!`);
    }
    setIsEventModalOpen(false);
  };

  // Delete Event (Admin)
  const handleDeleteEvent = (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEvent(eventId);
      showToast(`Event "${eventTitle}" removed.`);
    }
  };

  // Filtered Attendees for Modal
  const filteredAttendees = useMemo(() => {
    let list = eventRegistrations;
    if (selectedEventForAttendees) {
      list = list.filter(r => r.eventId === selectedEventForAttendees.id);
    }
    if (attendeeSearchQuery.trim()) {
      const q = attendeeSearchQuery.toLowerCase();
      list = list.filter(r => 
        r.studentName.toLowerCase().includes(q) ||
        r.regNo.toLowerCase().includes(q) ||
        (r.teamName && r.teamName.toLowerCase().includes(q)) ||
        r.dept.toLowerCase().includes(q)
      );
    }
    return list;
  }, [eventRegistrations, selectedEventForAttendees, attendeeSearchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white font-bold text-xs md:text-sm rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Editorial Card */}
      <div className="premium-card glow-effect border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)]">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-2xl border border-[var(--olive-primary)]/20">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isAdmin ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-[var(--olive-primary)]/10 text-[var(--olive-primary)]'
              }`}>
                {isAdmin ? 'ADMINISTRATOR VIEW • EVENT CONTROLS' : 'STUDENT EVENT HUB'}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-semibold">• IFET Campus Portal</span>
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] mt-1">
              Inter-College Event Hub & Pass Generator
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-semibold">
              {isAdmin 
                ? 'Manage and edit all campus hackathons, technical symposia, and view student registration rosters.'
                : 'Discover Symposia, Hackathons & Conferences Across Tamil Nadu & generate your digital entry pass.'}
            </p>
          </div>
        </div>

        {/* Action Buttons for Admin or Category Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => {
                setSelectedEventForAttendees(null);
                setAttendeeSearchQuery('');
                setIsAttendeesModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>All Registered ({eventRegistrations.length})</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleOpenCreateEvent}
              className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        
        {/* Category Pills & Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[var(--olive-primary)] text-[#FFFFFF] shadow-md -translate-y-0.5'
                    : 'glass-editorial border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs font-extrabold text-[var(--text-secondary)] flex items-center gap-2">
            <span>Showing: <strong className="text-[var(--text-primary)]">{filteredEvents.length} Events</strong></span>
            {selectedCategory !== 'All' && (
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Events Grid / Empty State */}
        {filteredEvents.length === 0 ? (
          <div key={`empty-${selectedCategory}`} className="premium-card glow-effect p-8 text-center rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm font-bold text-[var(--text-secondary)]">No {selectedCategory} events available right now.</p>
          </div>
        ) : (
          <div key={`grid-${selectedCategory}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {filteredEvents.map((event) => {
            const isRegistered = registeredEvents.includes(event.id);
            const hostCollege = event.hostCollege || event.college || 'IFET College of Engineering';
            const venue = event.venue || event.location || 'Campus Auditorium';
            const prize = event.prize || event.prizes || 'Cash Prizes & Certificates';
            const matchPercentage = event.matchPercentage || event.aiMatch || 94;
            const regsForThisEvent = eventRegistrations.filter(r => r.eventId === event.id);

            return (
              <div
                key={event.id}
                className="premium-card glow-effect border border-[var(--border-color)] hover:border-[var(--olive-primary)]/40 hover:-translate-y-0.5 transition-all rounded-3xl p-6 space-y-4 relative flex flex-col justify-between bg-[var(--bg-card)] shadow-editorial"
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] border border-[var(--olive-primary)]/20 text-[10px] font-black rounded-full uppercase">
                      {event.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-full">
                        {regsForThisEvent.length} Registered
                      </span>
                      <div className="flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] text-amber-700 font-extrabold">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{matchPercentage}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h3 className="font-black text-base text-[var(--text-primary)] leading-tight">{event.title}</h3>
                    <div className="text-xs text-[var(--olive-primary)] font-semibold flex items-center mt-1.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                      <span>{hostCollege} • {venue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] font-normal leading-relaxed">{event.description}</p>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)]">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 text-[var(--olive-primary)] mr-1.5" />
                      <span className="font-semibold">{event.date}</span>
                    </div>
                    <div className="font-bold text-[#C49A3A]">
                      Prize Pool: {prize}
                    </div>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* ROLE-BASED ACTIONS: ADMIN vs STUDENT */}
                {/* ============================================================ */}
                <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
                  
                  {/* ADMIN VIEW: Edit Event, View Registered Attendees, Delete */}
                  {isAdmin ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedEventForAttendees(event);
                          setAttendeeSearchQuery('');
                          setIsAttendeesModalOpen(true);
                        }}
                        className="w-full py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--olive-primary)] hover:text-white text-[var(--text-primary)] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Registered Students ({regsForThisEvent.length})</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenEditEvent(event)}
                          className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Event</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STUDENT VIEW: 3D Venue & Register for Digital Pass */
                    <div className="flex items-center justify-between gap-2">
                      {(event.targetBuildingId || event.buildingId) && (
                        <button
                          onClick={() => onTriggerRoute({
                            buildingId: event.targetBuildingId || event.buildingId,
                            title: `3D Location for ${event.title}`
                          })}
                          className="px-3 py-2.5 glass-editorial hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--olive-primary)] rounded-xl text-xs font-bold flex items-center space-x-1 transition-all hover:-translate-y-0.5"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>3D Venue</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleRegister(event)}
                        className={`flex-1 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5 shadow-sm ${
                          isRegistered ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)] text-[#FFFFFF]'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Registered • View QR Pass</span>
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4" />
                            <span>Register & Get Digital Pass</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 📝 CREATE / EDIT EVENT MODAL (ADMIN ONLY) */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D1D1B]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="premium-card glow-effect rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 bg-[var(--bg-card)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-2xl">
                  {editingEventId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--text-primary)]">
                    {editingEventId ? 'Edit Event Details' : 'Create New Campus Event'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-semibold">
                    {editingEventId ? 'Modify event title, dates, prizes, and venue location' : 'Publish a new inter-college symposium or hackathon to students'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-X-CELERATOR 2026 Hackathon"
                  value={eventFormData.title}
                  onChange={e => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                />
              </div>

              {/* Host College & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Host College / Department</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.hostCollege}
                    onChange={e => setEventFormData({ ...eventFormData, hostCollege: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Category</label>
                  <select
                    value={eventFormData.category}
                    onChange={e => setEventFormData({ ...eventFormData, category: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical">Technical Symposium</option>
                    <option value="Non-Technical">Non-Technical Event</option>
                    <option value="Workshop">Workshop / Bootcamp</option>
                  </select>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Event Date(s)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. September 15 - 16, 2026"
                    value={eventFormData.date}
                    onChange={e => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Venue / Campus Hall</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. APJ Abdul Kalam Auditorium"
                    value={eventFormData.venue}
                    onChange={e => setEventFormData({ ...eventFormData, venue: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>
              </div>

              {/* Prize Pool & Team Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Prize Pool & Awards</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹50,000 Cash + Certificates"
                    value={eventFormData.prize}
                    onChange={e => setEventFormData({ ...eventFormData, prize: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Team Size</label>
                  <input
                    type="text"
                    value={eventFormData.teamSize}
                    onChange={e => setEventFormData({ ...eventFormData, teamSize: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Description & Tracks</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe event rules, problem tracks, and guidelines..."
                  value={eventFormData.description}
                  onChange={e => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] custom-scrollbar"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {editingEventId ? 'Save & Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👥 REGISTERED ATTENDEES MODAL (ADMIN ONLY) */}
      {/* ========================================================================= */}
      {isAttendeesModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D1D1B]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="premium-card glow-effect rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 bg-[var(--bg-card)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-black rounded-md uppercase tracking-wider flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    DIGITAL PASS AUDIT
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-semibold">
                    • {selectedEventForAttendees ? selectedEventForAttendees.title : 'All Campus Events'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mt-1">
                  Registered Students Directory ({filteredAttendees.length})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {selectedEventForAttendees && (
                  <button
                    onClick={() => setSelectedEventForAttendees(null)}
                    className="px-3 py-1.5 bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                  >
                    Clear Filter
                  </button>
                )}

                {/* Search Box */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, regNo, team..."
                    value={attendeeSearchQuery}
                    onChange={e => setAttendeeSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] w-56"
                  />
                </div>

                <button
                  onClick={() => setIsAttendeesModalOpen(false)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Register No</th>
                    <th className="py-3 px-3">Event Registered</th>
                    <th className="py-3 px-3">Team & Role</th>
                    <th className="py-3 px-3">Registered Time</th>
                    <th className="py-3 px-3">Digital QR Pass ID</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-xs font-bold">
                  {filteredAttendees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[var(--text-secondary)] font-semibold">
                        No attendee registrations found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendees.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/40 transition-colors">
                        {/* Name & Email */}
                        <td className="py-3 px-3">
                          <p className="font-black text-[var(--text-primary)]">{reg.studentName}</p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{reg.email}</p>
                        </td>

                        {/* Reg No & Dept */}
                        <td className="py-3 px-3 font-mono">
                          <p className="text-[var(--text-primary)]">{reg.regNo}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] font-sans">{reg.dept}</p>
                        </td>

                        {/* Event Title */}
                        <td className="py-3 px-3 max-w-xs truncate">
                          <span className="px-2 py-0.5 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded font-extrabold text-[11px]">
                            {reg.eventTitle || 'HACK-X-IFET 2026'}
                          </span>
                        </td>

                        {/* Team & Role */}
                        <td className="py-3 px-3">
                          <p className="text-[var(--text-primary)]">{reg.teamName || 'Individual Entry'}</p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{reg.teamRole || 'Participant'}</p>
                        </td>

                        {/* Registered Time */}
                        <td className="py-3 px-3 text-[var(--text-secondary)] font-mono text-[11px]">
                          {reg.registeredAt}
                        </td>

                        {/* Pass ID */}
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 bg-white border border-[var(--border-color)] text-[var(--olive-primary)] rounded-lg font-mono font-black text-xs shadow-sm">
                            {reg.passId}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-right">
                          <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">
                            {reg.status || 'CONFIRMED'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Official IFET QR Digital Entry Pass Modal (STUDENTS ONLY) */}
      {passModalEvent && (
        <div className="fixed inset-0 z-50 bg-[#1D1D1B]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="premium-card glow-effect rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 bg-[var(--bg-card)]">
            
            <button
              onClick={() => setPassModalEvent(null)}
              className="absolute top-4 right-4 p-2 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-extrabold rounded-full uppercase shadow-sm">
                OFFICIAL ENTRY PASS ISSUED
              </span>
              <h3 className="text-xl font-black text-[var(--text-primary)] pt-3">{passModalEvent.title}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{passModalEvent.hostCollege || passModalEvent.college}</p>
            </div>

            {/* Simulated Digital Pass Frame */}
            <div className="bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-2xl p-6 text-center space-y-4 shadow-sm">
              <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center relative border border-[var(--border-color)]">
                <QrCode className="w-32 h-32 text-[var(--text-primary)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none rounded-2xl" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[var(--olive-primary)] font-bold">Pass ID: IFET-PASS-2026-25219</div>
                <div className="font-extrabold text-base text-[var(--text-primary)]">{currentUser?.name || STUDENT_PROFILE.name}</div>
                <div className="text-xs text-[var(--text-secondary)]">{currentUser?.id || STUDENT_PROFILE.regNo} • {STUDENT_PROFILE.section}</div>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] space-y-0.5">
                <div>Venue: <strong className="text-[var(--text-primary)]">{passModalEvent.venue || 'Campus Auditorium'}</strong></div>
                <div>Date: <strong className="text-[var(--text-primary)]">{passModalEvent.date}</strong></div>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Digital Pass saved to student wallet!");
                setPassModalEvent(null);
              }}
              className="w-full bg-[var(--olive-primary)] text-[#FFFFFF] py-4 rounded-full text-xs flex items-center justify-center space-x-2 font-bold uppercase tracking-wider hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital Pass</span>
            </button>

          </div>
        </div>
      )}


    </div>
  );
}

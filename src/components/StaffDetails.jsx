import React, { useState } from 'react';
import { Search, UserCircle, Mail, Phone, BookOpen, MapPin, Building2, ShieldCheck, Calendar, Plus, Trash2, X } from 'lucide-react';

const MOCK_STAFF = [
  { id: 'STF-001', name: 'Prof. Kumar', department: 'Computer Science & Engineering', role: 'Senior Counselor', email: 'kumar.cse@ifet.ac.in', phone: '+91 94432 18001', room: 'Cabin 14 (Kalam Block)', subjects: ['Hackathon', 'Computer Networks'], status: 'Available', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { id: 'STF-002', name: 'Dr. P. Kausalya', department: 'Computer Science & Engineering', role: 'Professor', email: 'kausalya.p@ifet.ac.in', phone: '+91 94432 18002', room: 'Room 269', subjects: ['Computer Networks', 'Networks Lab'], status: 'In Class', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'STF-003', name: 'Prof. R. Vignesh', department: 'Artificial Intelligence & DS', role: 'Asst. Professor', email: 'vignesh.r@ifet.ac.in', phone: '+91 94432 18003', room: 'AI Lab', subjects: ['Deep Learning', 'AI Systems'], status: 'Available', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { id: 'STF-004', name: 'Dr. S. Manikandan', department: 'Information Technology', role: 'HOD', email: 'manikandan.s@ifet.ac.in', phone: '+91 94432 18004', room: 'HOD Cabin (Kalam Block)', subjects: ['Theory of Computation'], status: 'Meeting', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' },
  { id: 'STF-005', name: 'Prof. M. Selvi', department: 'Information Technology', role: 'Asst. Professor', email: 'selvi.m@ifet.ac.in', phone: '+91 94432 18005', room: 'Room 214', subjects: ['Software Testing & QA'], status: 'Available', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 'STF-006', name: 'Dr. G. Suresh', department: 'Science & Humanities', role: 'Professor', email: 'suresh.g@ifet.ac.in', phone: '+91 94432 18006', room: 'Main Building (Floor 1)', subjects: ['Algebra & Number Theory'], status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
];

export default function StaffDetails() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '', department: '', role: '', email: '', phone: '', room: '', subjects: '', status: 'Available'
  });

  const handleRemoveStaff = (id) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    const id = `STF-${String(Date.now()).slice(-5)}`;
    const staffEntry = {
      ...newStaff,
      id,
      subjects: newStaff.subjects.split(',').map(s => s.trim()).filter(Boolean),
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(newStaff.name) + '&background=random'
    };
    setStaffList([staffEntry, ...staffList]);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', department: '', role: '', email: '', phone: '', room: '', subjects: '', status: 'Available' });
  };

  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.subjects.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in duration-500 pb-24">
      
      {/* Header */}
      <div className="premium-card p-6 md:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-editorial relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] text-xs font-extrabold rounded-full tracking-wider uppercase border border-[var(--olive-primary)]/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Access Only
            </span>
          </div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Staff Directory & Operations
          </h2>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1 max-w-2xl">
            Monitor and manage faculty profiles, current availability, and assigned schedules.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 z-10">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[var(--text-secondary)]" />
          </div>
          <input
            type="text"
            placeholder="Search by name, dept or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all"
          />
        </div>
        
        {/* Add Button */}
        <div className="relative z-10 md:self-end">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all w-full md:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Staff
          </button>
        </div>

        <div className="absolute right-[-20px] top-[-40px] w-48 h-48 bg-[var(--olive-primary)]/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: staffList.length, icon: UserCircle, color: "text-[var(--olive-primary)]", bg: "bg-[var(--olive-primary)]/10" },
          { label: "Currently Available", value: staffList.filter(s => s.status === 'Available').length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "In Class / Meeting", value: staffList.filter(s => ['In Class', 'Meeting'].includes(s.status)).length, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "On Leave", value: staffList.filter(s => s.status === 'On Leave').length, icon: Building2, color: "text-rose-500", bg: "bg-rose-500/10" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="premium-card p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between group cursor-default bg-[var(--bg-card)]">
              <div>
                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length > 0 ? filteredStaff.map(staff => (
          <div key={staff.id} className="premium-card rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col group hover:-translate-y-1 transition-all shadow-sm">
            
            <div className="p-5 flex items-start gap-4">
              <img src={staff.avatar} alt={staff.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--bg-secondary)] shadow-sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] truncate">{staff.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
                    staff.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' :
                    staff.status === 'In Class' ? 'bg-amber-500/10 text-amber-600 border border-amber-200 animate-pulse' :
                    staff.status === 'Meeting' ? 'bg-blue-500/10 text-blue-600 border border-blue-200' :
                    'bg-rose-500/10 text-rose-600 border border-rose-200'
                  }`}>
                    {staff.status}
                  </span>
                  
                  <button 
                    onClick={() => handleRemoveStaff(staff.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove Staff"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-[var(--olive-primary)] uppercase tracking-wider mt-0.5">{staff.role}</p>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mt-1 truncate">{staff.department}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[var(--bg-secondary)]/50 border-y border-[var(--border-color)] grid grid-cols-2 gap-3 text-xs font-semibold text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--olive-primary)]" />
                <span className="truncate">{staff.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[var(--olive-primary)]" />
                <span className="truncate">{staff.phone}</span>
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  Handling Subjects
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {staff.subjects.map((sub, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[10px] font-bold rounded-md border border-[var(--border-color)]">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl border-2 border-[var(--olive-primary)] text-[var(--olive-primary)] text-xs font-extrabold uppercase tracking-wider hover:bg-[var(--olive-primary)] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Staff
              </button>
            </div>

          </div>
        )) : (
          <div className="col-span-full py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--text-secondary)] mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[var(--text-primary)]">No staff members found</h3>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="premium-card bg-[var(--bg-card)] rounded-3xl w-full max-w-lg shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Add New Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-rose-500 transition-colors rounded-full hover:bg-rose-500/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Full Name</label>
                  <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="e.g. Dr. A. Smith" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Department</label>
                  <input required type="text" value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="e.g. CSE" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Role</label>
                  <input required type="text" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="e.g. Professor" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Email</label>
                  <input required type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="staff@ifet.ac.in" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Phone</label>
                  <input required type="text" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="+91 XXXXX XXXXX" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Room / Location</label>
                  <input required type="text" value={newStaff.room} onChange={e => setNewStaff({...newStaff, room: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="e.g. Cabin 14" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Status</label>
                  <select value={newStaff.status} onChange={e => setNewStaff({...newStaff, status: e.target.value})} className="w-full px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all">
                    <option value="Available">Available</option>
                    <option value="In Class">In Class</option>
                    <option value="Meeting">Meeting</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Subjects (Comma separated)</label>
                  <input required type="text" value={newStaff.subjects} onChange={e => setNewStaff({...newStaff, subjects: e.target.value})} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-all" placeholder="e.g. AI, Deep Learning, Networks" />
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all">
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

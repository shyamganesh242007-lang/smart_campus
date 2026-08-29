import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, Sparkles, Filter, Calendar, User, ChevronRight, 
  Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, FileText, Send
} from 'lucide-react';

export default function NoticeBoard({ onAskAI }) {
  const { notices, currentUser, createNotice, updateNotice, deleteNotice } = useApp();
  
  const isAdmin = currentUser?.role === 'admin';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAISummary, setShowAISummary] = useState(false);

  // Admin Modal States
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    category: 'Urgent',
    author: 'Principal Office, IFET',
    date: '',
    content: ''
  });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const categories = ['All', 'Urgent', 'Important', 'Events', 'General'];

  const filteredNotices = notices.filter(n =>
    selectedCategory === 'All' || n.category === selectedCategory
  );

  // Open Create Notice Modal
  const handleOpenCreateNotice = () => {
    setEditingNoticeId(null);
    setNoticeFormData({
      title: '',
      category: 'Important',
      author: currentUser?.name ? `${currentUser.name} (Admin)` : 'Principal Office, IFET',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: ''
    });
    setIsNoticeModalOpen(true);
  };

  // Open Edit Notice Modal
  const handleOpenEditNotice = (notice) => {
    setEditingNoticeId(notice.id);
    setNoticeFormData({
      title: notice.title || '',
      category: notice.category || 'General',
      author: notice.author || 'Administrative Office',
      date: notice.date || '',
      content: notice.content || notice.summary || ''
    });
    setIsNoticeModalOpen(true);
  };

  // Save Notice (Create or Update)
  const handleSaveNotice = (e) => {
    e.preventDefault();
    if (!noticeFormData.title.trim() || !noticeFormData.content.trim()) return;

    if (editingNoticeId) {
      updateNotice(editingNoticeId, {
        title: noticeFormData.title,
        category: noticeFormData.category,
        author: noticeFormData.author,
        date: noticeFormData.date,
        content: noticeFormData.content,
        summary: noticeFormData.content
      });
      showToast(`Circular "${noticeFormData.title}" updated successfully!`);
    } else {
      createNotice({
        title: noticeFormData.title,
        category: noticeFormData.category,
        author: noticeFormData.author,
        date: noticeFormData.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        content: noticeFormData.content,
        summary: noticeFormData.content
      });
      showToast(`New circular published: "${noticeFormData.title}"!`);
    }
    setIsNoticeModalOpen(false);
  };

  // Delete Notice
  const handleDeleteNotice = (noticeId, noticeTitle) => {
    if (window.confirm(`Are you sure you want to delete the notice: "${noticeTitle}"?`)) {
      deleteNotice(noticeId);
      showToast(`Notice "${noticeTitle}" deleted.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white font-bold text-xs md:text-sm rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="premium-card glow-effect border border-[var(--border-color)] rounded-3xl p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)]">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-2xl border border-[var(--olive-primary)]/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isAdmin ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-[var(--olive-primary)]/10 text-[var(--olive-primary)]'
              }`}>
                {isAdmin ? 'ADMINISTRATOR BULLETIN DISPATCH' : 'CAMPUS CIRCULARS'}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-semibold">• Official IFET Feed</span>
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)] mt-1">Smart Notice Board</h2>
            <p className="text-xs text-[var(--text-secondary)] font-semibold">
              {isAdmin 
                ? 'Issue, edit, and manage urgent campus notices, exam notifications, and official circulars.'
                : 'Official Circulars, Exam Schedules & Department Bulletins.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={handleOpenCreateNotice}
              className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Notice</span>
            </button>
          )}

          {/* AI Auto-Summarizer Toggle */}
          <button
            onClick={() => setShowAISummary(!showAISummary)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              showAISummary
                ? 'bg-[var(--olive-primary)] text-[#FFFFFF] shadow-md -translate-y-0.5'
                : 'glass-editorial text-[var(--olive-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{showAISummary ? 'Hide Digest' : 'CampusAI Digest'}</span>
          </button>
        </div>
      </div>

      {/* AI Summary Banner Overlay */}
      {showAISummary && (
        <div className="premium-card glow-effect border border-[var(--olive-primary)]/30 rounded-2xl p-5 shadow-md space-y-3 animate-in fade-in duration-300 bg-[var(--bg-card)]">
          <div className="flex items-center space-x-2 text-[var(--olive-primary)] font-extrabold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>CampusAI 3-Point Circular Digest</span>
          </div>
          <ul className="text-xs text-[var(--text-primary)] space-y-2 list-disc pl-5 font-semibold">
            <li><strong className="text-[var(--olive-primary)]">CAT-2 Exams:</strong> Scheduled from Aug 22. Hall tickets accessible via Exam Seat Finder. 75% attendance mandatory.</li>
            <li><strong className="text-[var(--olive-primary)]">HACK-X-IFET 2026:</strong> 24-hr AI hackathon registration open on Event Hub (₹50k cash prizes).</li>
            <li><strong className="text-[var(--olive-primary)]">AWS Guest Lecture:</strong> Aug 18, 10:30 AM at APJ Abdul Kalam Auditorium.</li>
          </ul>
        </div>
      )}

      {/* Category Filter Pills & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

        <div className="text-xs font-bold text-[var(--text-secondary)]">
          Showing <strong className="text-[var(--text-primary)]">{filteredNotices.length}</strong> Notices
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="premium-card p-8 text-center rounded-3xl bg-[var(--bg-card)]">
            <p className="text-xs font-bold text-[var(--text-secondary)]">No notices found in {selectedCategory} category.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const accentColor = 
              notice.category === 'Urgent' ? 'border-l-rose-500' : 
              notice.category === 'Important' ? 'border-l-amber-500' : 
              notice.category === 'Events' ? 'border-l-[var(--olive-primary)]' : 
              'border-l-slate-400';

            return (
              <div
                key={notice.id}
                className={`premium-card glow-effect border-l-4 ${accentColor} border-t border-r border-b border-[var(--border-color)] rounded-2xl !p-5 shadow-sm hover:bg-[var(--bg-secondary)]/50 transition-all hover:-translate-y-0.5 space-y-3 bg-[var(--bg-card)]`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md shadow-sm ${
                      notice.category === 'Urgent' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                      notice.category === 'Important' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      notice.category === 'Events' ? 'bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] border border-[var(--olive-primary)]/20' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {notice.category.toUpperCase()}
                    </span>
                    <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-snug">{notice.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[var(--text-secondary)]">{notice.date}</span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-normal leading-relaxed">{notice.content}</p>

                {/* Footer with Author & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--olive-primary)]" />
                    <span>Issued by: <strong className="text-[var(--text-primary)] font-semibold">{notice.author}</strong></span>
                  </div>

                  {/* ADMIN ACTIONS: Edit & Delete vs STUDENT ACTION: Ask AI */}
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditNotice(notice)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id, notice.title)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAskAI(`Summarize notice: "${notice.title}" and explain required actions.`)}
                        className="text-[var(--olive-primary)] hover:text-[var(--text-primary)] font-semibold flex items-center space-x-1 transition"
                      >
                        <span>Ask AI</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📝 CREATE / EDIT NOTICE MODAL (ADMIN ONLY) */}
      {/* ========================================================================= */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D1D1B]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="premium-card glow-effect rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 bg-[var(--bg-card)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-2xl">
                  {editingNoticeId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--text-primary)]">
                    {editingNoticeId ? 'Edit Official Circular' : 'Post New Campus Notice'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-semibold">
                    {editingNoticeId ? 'Update notice text and urgency category' : 'Publish official circular across all student and faculty dashboards'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              {/* Notice Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Timetable Released"
                  value={noticeFormData.title}
                  onChange={e => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Priority / Category</label>
                  <select
                    value={noticeFormData.category}
                    onChange={e => setNoticeFormData({ ...noticeFormData, category: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Important">Important</option>
                    <option value="Events">Events</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Issuing Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 29 Aug 2026"
                    value={noticeFormData.date}
                    onChange={e => setNoticeFormData({ ...noticeFormData, date: e.target.value })}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                  />
                </div>
              </div>

              {/* Issuing Authority / Author */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Issuing Authority / Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Controller of Examinations / Principal Office"
                  value={noticeFormData.author}
                  onChange={e => setNoticeFormData({ ...noticeFormData, author: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)]"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Notice Content & Instructions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the detailed circular information for students and staff..."
                  value={noticeFormData.content}
                  onChange={e => setNoticeFormData({ ...noticeFormData, content: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] custom-scrollbar"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {editingNoticeId ? 'Save & Update Circular' : 'Publish Circular'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { AI_PRESET_PROMPTS } from '../data/mockData';
import { Bot, Send, Sparkles, User, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CampusAI({ initialPrompt = '', onTriggerRoute, onNavigateTab }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Ragul! I am CampusAI, your IFET College assistant. Ask me about your CSE timetable, 75% attendance margin, exam seat numbers, or inter-college event passes!",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "I found relevant campus details for your query.";
      let actionRoute = null;

      const lower = query.toLowerCase();
      if (lower.includes('attendance')) {
        aiResponseText = "Your overall attendance is **84.5%** across 6 subjects. You can safely miss up to **7 more classes** before reaching the 75% mandatory threshold. Would you like to open the Attendance Calculator?";
      } else if (lower.includes('exam') || lower.includes('seat')) {
        aiResponseText = "Your End-Sem Exam seat for **CS8591 (Artificial Intelligence)** is at **A.P.J. Abdul Kalam Block, 2nd Floor, Room 269, Bench #14, Seat B**. Click below to start 3D Route navigation.";
        actionRoute = { buildingId: 'kalam_block', title: '3D Route to Exam Hall Room 269' };
      } else if (lower.includes('next class') || lower.includes('schedule') || lower.includes('timetable')) {
        aiResponseText = "Your next class is **Artificial Intelligence & ML** at **09:00 AM** in **Room 269, Kalam Block** with Dr. S. Kanthimathi.";
        actionRoute = { buildingId: 'kalam_block', title: '3D Route to Room 269' };
      } else if (lower.includes('event') || lower.includes('hackathon')) {
        aiResponseText = "The 24-Hour AI Hackathon **HACK-X-IFET 2026** is scheduled for Aug 28-29 at Dr. APJ Abdul Kalam Auditorium. You have a **96% AI Interest Match**!";
      } else {
        aiResponseText = `I have logged your query regarding "${query}". You can check your student dashboard or launch the 3D campus twin view anytime.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        actionRoute: actionRoute,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4">
      {/* Header Banner - Editorial Card */}
      <div className="premium-card glow-effect border border-[var(--border-color)] rounded-3xl p-5 md:p-6 shadow-editorial flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-2xl border border-[var(--olive-primary)]/20 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] flex items-center space-x-2">
              <span>CampusAI Assistant</span>
              <span className="px-2 py-0.5 bg-[var(--olive-primary)] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-sm">
                ONLINE
              </span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Powered by IFET Smart Campus Knowledge Twin</p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="hidden sm:flex items-center space-x-1.5 px-4 py-2 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full text-xs font-bold transition shadow-sm"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="p-5 md:p-6 rounded-b-3xl space-y-5 flex flex-col h-[560px]">
        
        {/* Preset Prompt Pills matching design aesthetic */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
          <span className="text-xs font-bold text-[var(--olive-primary)] whitespace-nowrap flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Quick AI Ask:
          </span>
          {AI_PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt.text)}
              className="px-3.5 py-1.5 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold rounded-full whitespace-nowrap transition shadow-sm"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-2xl premium-card glow-effect flex items-center justify-center text-[var(--olive-primary)] font-bold text-xs shadow-sm shrink-0">
                  AI
                </div>
              )}

              <div
                className={`max-w-md p-4 rounded-3xl space-y-2 text-xs md:text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[var(--olive-primary)] rounded-tr-none text-[#FFFFFF] shadow-md'
                    : 'premium-card glow-effect text-[var(--text-primary)] rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {/* Optional Action Button for 3D Route */}
                {msg.actionRoute && (
                  <div className="pt-3 mt-2 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => onTriggerRoute(msg.actionRoute)}
                      className="w-full py-2.5 glass-editorial hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all hover:-translate-y-0.5"
                    >
                      <MapPin className="w-4 h-4 text-[var(--olive-primary)]" />
                      <span>Launch 3D Route Navigation</span>
                    </button>
                  </div>
                )}

                <div className={`text-[10px] font-medium ${msg.sender === 'user' ? 'text-[#FFFFFF]/70 text-right' : 'text-[var(--text-secondary)]'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-2xl bg-[var(--olive-primary)] flex items-center justify-center text-[#FFFFFF] text-xs font-bold shrink-0 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-2xl premium-card glow-effect flex items-center justify-center text-[var(--olive-primary)] text-xs font-bold shrink-0 shadow-sm">
                AI
              </div>
              <div className="premium-card glow-effect p-4 rounded-2xl rounded-tl-none text-xs text-[var(--text-secondary)] flex items-center space-x-3 shadow-sm">
                <span className="w-2 h-2 bg-[var(--olive-primary)] rounded-full animate-ping" />
                <span className="font-medium">CampusAI is searching IFET knowledge graph...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar with Validation Checkmark Aesthetic */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask CampusAI about attendance, exam seat, timetable..."
            className="w-full premium-card glow-effect pl-6 pr-28 py-4 rounded-full text-xs text-[var(--text-primary)] placeholder-[#5E5A53] focus:outline-none focus:shadow-md transition-shadow"
          />

          {inputQuery.trim() && (
            <CheckCircle2 className="w-4 h-4 text-[var(--olive-primary)] absolute right-24 pointer-events-none" />
          )}

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="absolute right-2 bg-[var(--olive-primary)] hover:bg-[var(--olive-hover)] text-[#FFFFFF] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 disabled:opacity-50 transition-all shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}

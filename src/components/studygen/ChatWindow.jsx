import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import ChatBubble from './ChatBubble';
import LoadingSpinner from './LoadingSpinner';
import { studygenApi } from '../../services/studygenApi';

export default function ChatWindow({ hasUploadedFiles }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Upload your study material and I can answer any questions based on it.",
      isAI: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !hasUploadedFiles) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: userMessage, isAI: false }]);
    setIsLoading(true);

    try {
      const response = await studygenApi.askQuestion(userMessage);
      if (!isMounted.current) return;
      
      if (response && response.success === false) {
        throw new Error(response.error || "Backend error");
      }
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: response.answer || "No response received.", isAI: true, source: response.source, fileType: response.fileType }]);
    } catch (error) {
      if (!isMounted.current) return;
      setMessages(prev => [...prev, { 
        id: Date.now() + Math.random(), 
        text: "Sorry, I encountered an error while trying to answer your question. Please ensure the backend is running.", 
        isAI: true 
      }]);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="premium-card glow-effect rounded-3xl border border-[var(--border-color)] flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/30 flex items-center justify-between rounded-t-3xl">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-[var(--olive-primary)]" />
          StudyGen Chat
        </h3>
        {!hasUploadedFiles ? (
          <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            Supported Formats Required
          </span>
        ) : (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            Ready to Chat
          </span>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isAI={msg.isAI} source={msg.source} fileType={msg.fileType} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-[var(--olive-primary)] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl rounded-tl-none p-3 shadow-sm">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 rounded-b-3xl">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!hasUploadedFiles || isLoading}
            placeholder={hasUploadedFiles ? "Ask anything about your uploaded study material..." : "Upload a file first to ask questions"}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 pl-4 pr-12 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || !hasUploadedFiles || isLoading}
            className="absolute right-2 p-2 bg-[var(--olive-primary)] text-[#FFFFFF] rounded-xl hover:bg-[var(--olive-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

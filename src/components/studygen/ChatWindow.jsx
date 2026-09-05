import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import ChatBubble from './ChatBubble';
import LoadingSpinner from './LoadingSpinner';
import { studygenApi } from '../../services/studygenApi';

export default function ChatWindow({ hasUploadedFiles }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Upload your study material and I will answer directly from your documents. If the answer isn't in your files, I'll answer using Gemini AI.",
      isAI: true,
      source: "ai",
      sourceDoc: "Gemini AI"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Searching documents...');
  const [pendingReplyToId, setPendingReplyToId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, loadingStep]);

  /**
   * Primary unified Send flow for:
   * - Normal questions sent from the bottom input
   * - Edited questions resent from an inline message bubble
   * - Retried questions
   */
  const sendQuestion = async (userQuestion, targetUserMsgId = null) => {
    if (!userQuestion || !userQuestion.trim()) return;
    const cleanQuestion = userQuestion.trim();

    // 1. Reset loading and clear previous pending target state
    setIsLoading(true);
    setLoadingStep(hasUploadedFiles ? 'Searching documents...' : 'Consulting Gemini AI...');
    setPendingReplyToId(targetUserMsgId || null);

    try {
      // 2. Create a completely fresh request payload
      const response = await studygenApi.askQuestion(cleanQuestion);

      if (!response) {
        throw new Error("No response received from the backend.");
      }

      // If backend explicitly returned an unhandled failure
      if (response.success === false && !response.answer && response.error) {
        throw new Error(response.error);
      }

      const freshAiMsg = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        replyToId: targetUserMsgId || null,
        text: response.answer || "No response received.",
        fileAnswer: response.fileAnswer || null,
        aiAnswer: response.aiAnswer || null,
        source: response.source || "ai",
        sourceDoc: response.sourceDoc || (response.source === "document" ? "Uploaded Document" : "Gemini AI"),
        fileType: response.fileType || null,
        marks: response.marks || null,
        intent: response.intent || null,
        isAI: true,
        isError: false
      };

      // 3. Place response in conversation:
      // If targetUserMsgId exists (edit or retry): insert right after targetUserMsgId
      // If new question: append to bottom
      setMessages(prev => {
        if (targetUserMsgId) {
          // Remove any stray response/error previously linked to this user message
          const cleaned = prev.filter(m => m.replyToId !== targetUserMsgId);
          const userIndex = cleaned.findIndex(m => m.id === targetUserMsgId);
          if (userIndex === -1) {
            return [...cleaned, freshAiMsg];
          }
          const next = [...cleaned];
          next.splice(userIndex + 1, 0, freshAiMsg);
          return next;
        } else {
          return [...prev, freshAiMsg];
        }
      });
    } catch (error) {
      console.error("Chat request failed:", error);

      // Only display connection error for genuine network failures
      const isGenuineNetworkFailure = 
        error?.code === 'ERR_NETWORK' || 
        error?.message?.includes('Network Error') || 
        error?.message?.includes('not reachable');

      const errorMessageText = isGenuineNetworkFailure
        ? "Connection error: Unable to reach the backend service. Please verify your connection and retry."
        : (error?.message || "Failed to generate response. Please retry.");

      const errAiMsg = {
        id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        replyToId: targetUserMsgId || null,
        text: errorMessageText,
        isAI: true,
        isError: true,
        isNetworkError: isGenuineNetworkFailure,
        failedQuestion: cleanQuestion
      };

      setMessages(prev => {
        if (targetUserMsgId) {
          const cleaned = prev.filter(m => m.replyToId !== targetUserMsgId);
          const userIndex = cleaned.findIndex(m => m.id === targetUserMsgId);
          if (userIndex === -1) return [...cleaned, errAiMsg];
          const next = [...cleaned];
          next.splice(userIndex + 1, 0, errAiMsg);
          return next;
        } else {
          return [...prev, errAiMsg];
        }
      });
    } finally {
      setIsLoading(false);
      setPendingReplyToId(null);
    }
  };

  // Normal Send Button Handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const userMsgId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Append brand-new user message
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        text: userMessage,
        isAI: false
      }
    ]);

    // Send immediately via the unified pipeline
    await sendQuestion(userMessage, userMsgId);
  };

  // ChatGPT-Style Edit & Resend Question: directly reuses normal Send flow
  const handleEditQuestion = async (userMsgId, newQuestionText) => {
    if (!newQuestionText || !newQuestionText.trim() || isLoading) return;
    const cleanQuestion = newQuestionText.trim();

    // 1. Replace the original question text in-place & remove only its old assistant answer
    setMessages(prev => {
      const userIndex = prev.findIndex(m => m.id === userMsgId);
      if (userIndex === -1) return prev;

      const nextMsg = prev[userIndex + 1];
      const nextIsLinkedAI = nextMsg && nextMsg.isAI && (nextMsg.replyToId === userMsgId || !nextMsg.replyToId);

      return prev
        .filter(m => {
          if (m.replyToId === userMsgId) return false;
          if (nextIsLinkedAI && m.id === nextMsg.id) return false;
          return true;
        })
        .map(m => m.id === userMsgId ? { ...m, text: cleanQuestion } : m);
    });

    // 2. Reuse the exact same normal send pipeline with targetUserMsgId
    await sendQuestion(cleanQuestion, userMsgId);
  };

  const handleRetry = async (failedQuestion, errorMsgId, replyToId) => {
    if (isLoading) return;

    // Clear previous error state before sending
    if (errorMsgId) {
      setMessages(prev => prev.filter(m => m.id !== errorMsgId));
    }

    // Reuse the exact same normal send pipeline
    await sendQuestion(failedQuestion, replyToId || null);
  };

  return (
    <div className="premium-card glow-effect rounded-3xl border border-[var(--border-color)] flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/30 flex items-center justify-between rounded-t-3xl">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-[var(--olive-primary)]" />
          StudyGen Chat
        </h3>
        {hasUploadedFiles ? (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            Document Active
          </span>
        ) : (
          <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            AI Mode
          </span>
        )}
      </div>

      {/* Chat Area - Preserves history until page refresh */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            <ChatBubble 
              id={msg.id}
              message={msg.text} 
              fileAnswer={msg.fileAnswer}
              aiAnswer={msg.aiAnswer}
              marks={msg.marks}
              intent={msg.intent}
              isAI={msg.isAI} 
              source={msg.source} 
              sourceDoc={msg.sourceDoc} 
              fileType={msg.fileType}
              isError={msg.isError}
              onRetry={msg.failedQuestion ? () => handleRetry(msg.failedQuestion, msg.id, msg.replyToId) : undefined}
              onEdit={!msg.isAI ? (newText) => handleEditQuestion(msg.id, newText) : undefined}
              isEditingDisabled={isLoading}
            />

            {/* Inline Loading Spinner directly underneath the question currently being edited */}
            {isLoading && pendingReplyToId === msg.id && (
              <div className="flex items-start space-x-3 animate-in fade-in duration-150">
                <div className="w-8 h-8 rounded-full bg-[var(--olive-primary)] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-2.5">
                  <LoadingSpinner />
                  <span className="text-xs font-medium text-[var(--text-secondary)] animate-pulse">
                    {loadingStep}
                  </span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Loading Indicator at the bottom for new questions */}
        {isLoading && !pendingReplyToId && (
          <div className="flex items-start space-x-3 animate-in fade-in duration-150">
            <div className="w-8 h-8 rounded-full bg-[var(--olive-primary)] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-2.5">
              <LoadingSpinner />
              <span className="text-xs font-medium text-[var(--text-secondary)] animate-pulse">
                {loadingStep}
              </span>
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
            disabled={isLoading}
            placeholder={hasUploadedFiles ? "Ask anything about your uploaded study material..." : "Ask any question (upload files for document-based search)..."}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 pl-4 pr-12 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-[var(--olive-primary)] text-[#FFFFFF] rounded-xl hover:bg-[var(--olive-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

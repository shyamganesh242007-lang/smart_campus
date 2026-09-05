import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Bot, User, RotateCcw, FileText, Sparkles, ChevronDown, Edit3, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { normalizeMathAndFormulas } from '../../utils/mathNormalizer';

export { normalizeMathAndFormulas };

function FormattedMessage({ content }) {
  if (!content) return null;

  const normalizedContent = useMemo(() => normalizeMathAndFormulas(content), [content]);

  return (
    <div className="space-y-2 text-xs leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          h1: ({ node, ...props }) => (
            <h2 className="text-sm font-black text-[var(--text-primary)] mt-3 mb-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] mt-3 mb-1 border-b border-[var(--border-color)]/30 pb-0.5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h4 className="text-xs font-bold text-[var(--olive-primary)] tracking-wide mt-2 mb-1" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h5 className="text-xs font-bold text-[var(--olive-primary)] tracking-wide mt-1.5 mb-0.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-relaxed mb-2 last:mb-0 whitespace-pre-line" {...props} />
          ),
          ul: ({ node, className, ...props }) => (
            <ul className={`list-disc pl-4 space-y-1 my-1.5 marker:text-[var(--olive-primary)] marker:font-bold ${className || ''}`} {...props} />
          ),
          ol: ({ node, className, ...props }) => (
            <ol className={`list-decimal pl-4 space-y-1 my-1.5 marker:text-[var(--olive-primary)] marker:font-bold marker:text-[11px] ${className || ''}`} {...props} />
          ),
          li: ({ node, className, ...props }) => (
            <li className={`leading-relaxed pl-0.5 ${className || ''}`} {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-[var(--text-primary)]" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          del: ({ node, ...props }) => (
            <del className="line-through opacity-70 text-[var(--text-secondary)]" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-3 border-[var(--border-color)] opacity-60" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-[var(--olive-primary)] pl-3 py-1 my-2 italic text-[var(--text-secondary)] bg-[var(--olive-primary)]/5 rounded-r" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            return !inline ? (
              <pre className="my-2 p-2.5 rounded-lg bg-black/80 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-white/10 custom-scrollbar">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="px-1.5 py-0.5 rounded bg-black/10 text-[var(--olive-primary)] font-mono text-[11px] font-semibold" {...props}>
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="markdown-table-wrapper custom-scrollbar">
              <table className="markdown-table" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} />
          ),
          th: ({ node, ...props }) => (
            <th {...props} />
          ),
          td: ({ node, ...props }) => (
            <td {...props} />
          ),
          input: ({ node, ...props }) => {
            if (props.type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  disabled
                  className="mr-1.5 h-3.5 w-3.5 rounded border-[var(--border-color)] text-[var(--olive-primary)] accent-[var(--olive-primary)] align-middle cursor-default"
                  {...props}
                />
              );
            }
            return <input {...props} />;
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

export default function ChatBubble({ 
  id,
  message, 
  fileAnswer, 
  aiAnswer, 
  marks, 
  intent, 
  isAI, 
  source, 
  sourceDoc, 
  fileType, 
  isError, 
  onRetry,
  onEdit,
  isEditingDisabled = false
}) {
  const isDoc = source === 'document' || source === 'file';
  const displayDocName = isDoc ? (sourceDoc || 'Uploaded Document') : 'Gemini AI';
  const formattedFileType = fileType 
    ? fileType.toUpperCase().replace('.', '') 
    : (isDoc && displayDocName.includes('.') ? displayDocName.split('.').pop().toUpperCase() : null);

  // Determine if dual cards should be presented
  const hasDualAnswers = Boolean(isAI && !isError && fileAnswer && aiAnswer);
  
  // Independent Accordion states:
  // File Based starts open (true), AI Enhanced starts collapsed (false)
  const [isFileOpen, setIsFileOpen] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Inline editing state for user questions
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message || '');
  const textareaRef = useRef(null);

  // Sync editText if message prop changes
  useEffect(() => {
    setEditText(message || '');
  }, [message]);

  // Auto-focus and place cursor at end when edit mode opens
  useEffect(() => {
    if (isEditing) {
      setEditText(message || '');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            textareaRef.current.value.length,
            textareaRef.current.value.length
          );
        }
      }, 50);
    }
  }, [isEditing, message]);

  const handleSaveEdit = () => {
    if (!editText.trim() || isEditingDisabled) return;
    setIsEditing(false);
    if (onEdit) {
      onEdit(editText.trim());
    }
  };

  const handleCancelEdit = () => {
    setEditText(message || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
        isAI 
          ? (isError ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-[var(--olive-primary)] text-[#FFFFFF]') 
          : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]'
      }`}>
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble / Container */}
      <div className={`max-w-[90%] md:max-w-[85%] w-full ${isAI ? '' : (isEditing ? 'w-full max-w-xl' : 'w-auto')}`}>
        {hasDualAnswers ? (
          /* Feature 2 & 3: Dual Independent Accordion Cards */
          <div className="space-y-2.5 w-full">
            {/* Card 1: File Based (Primary) */}
            <div 
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isFileOpen
                  ? 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-sm'
                  : 'bg-[var(--bg-card)]/50 border-[var(--border-color)]/60 hover:bg-[var(--bg-card)]/80 cursor-pointer'
              }`}
            >
              {/* Card 1 Header */}
              <div 
                onClick={() => setIsFileOpen(prev => !prev)}
                className={`px-3.5 py-2.5 flex items-center justify-between select-none cursor-pointer transition-colors ${
                  isFileOpen 
                    ? 'border-b border-[var(--border-color)]/40 bg-[var(--bg-secondary)]/30' 
                    : ''
                }`}
                title={isFileOpen ? 'Click to collapse document answer' : 'Click to expand document answer'}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <FileText className="w-3 h-3 mr-1" />
                    File Based
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)] truncate max-w-[200px] sm:max-w-xs">
                    Source: {displayDocName}
                  </span>
                  {formattedFileType && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] border border-[var(--olive-primary)]/20">
                      {formattedFileType}
                    </span>
                  )}
                  {marks && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      {marks} Marks
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-medium text-[var(--text-secondary)] shrink-0 ml-2">
                  {!isFileOpen && <span className="hidden sm:inline opacity-70">View Document Answer</span>}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFileOpen ? 'rotate-180 text-[var(--olive-primary)]' : 'rotate-0 text-[var(--text-secondary)]'}`} />
                </div>
              </div>

              {/* Card 1 Content with smooth 250-300ms height animation */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isFileOpen 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-3.5 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <FormattedMessage content={fileAnswer} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: AI Enhanced (Enriched) */}
            <div 
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isAiOpen
                  ? 'bg-[var(--bg-card)] border-indigo-500/30 shadow-sm'
                  : 'bg-indigo-500/[0.03] border-indigo-500/20 hover:bg-indigo-500/[0.07] cursor-pointer'
              }`}
            >
              {/* Card 2 Header */}
              <div 
                onClick={() => setIsAiOpen(prev => !prev)}
                className={`px-3.5 py-2.5 flex items-center justify-between select-none cursor-pointer transition-colors ${
                  isAiOpen 
                    ? 'border-b border-indigo-500/20 bg-indigo-500/[0.06]' 
                    : ''
                }`}
                title={isAiOpen ? 'Click to collapse AI answer' : 'Click to expand AI answer'}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </span>
                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                    Enriched with Gemini AI
                  </span>
                  {marks && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      {marks} Marks
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-medium text-indigo-600 shrink-0 ml-2">
                  {!isAiOpen && <span className="hidden sm:inline opacity-80">Compare Enhanced</span>}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isAiOpen ? 'rotate-180 text-indigo-600' : 'rotate-0 text-[var(--text-secondary)]'}`} />
                </div>
              </div>

              {/* Card 2 Content with smooth 250-300ms height animation */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isAiOpen 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-3.5 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <FormattedMessage content={aiAnswer} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isAI ? (
          /* Single Card: Assistant message, Error, Greeting, or AI Fallback */
          <div className={`rounded-2xl p-3.5 text-xs shadow-sm ${
            isError 
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-tl-none' 
              : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none'
          }`}>
            {/* Scrollable message content */}
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              <FormattedMessage content={aiAnswer || message} />
            </div>
            
            {/* Source Badge & Details for Single AI Card */}
            {!isError && (aiAnswer || isDoc) && (
              <div className="mt-2.5 pt-2 border-t border-[var(--border-color)]/50 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Enhanced
                </span>
                <span className="text-[10px] font-medium text-[var(--text-secondary)] flex items-center">
                  Source: Gemini AI
                </span>
                {marks && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    {marks} Marks
                  </span>
                )}
              </div>
            )}

            {/* Retry Button for errors */}
            {isError && onRetry && (
              <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center">
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retry
                </button>
              </div>
            )}
          </div>
        ) : (
          /* User Message: Normal Bubble with Edit Icon OR Inline Textarea */
          isEditing ? (
            <div className="w-full min-w-[280px] sm:min-w-[380px] md:min-w-[440px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-3 shadow-lg animate-in fade-in zoom-in-95 duration-150">
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={Math.min(6, Math.max(2, (editText.match(/\n/g) || []).length + 1))}
                disabled={isEditingDisabled}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)]/70 rounded-xl p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--olive-primary)] resize-none transition-colors custom-scrollbar placeholder:text-[var(--text-secondary)]/50"
                placeholder="Edit your question..."
              />
              <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]/40">
                <span className="text-[10px] text-[var(--text-secondary)] hidden sm:inline">
                  <kbd className="px-1 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-[9px]">Enter</kbd> to save, <kbd className="px-1 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-[9px]">Esc</kbd> to cancel
                </span>
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isEditingDisabled}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={!editText.trim() || isEditingDisabled}
                    className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[var(--olive-primary)] text-[#FFFFFF] hover:bg-[var(--olive-hover)] transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative flex items-center gap-1.5 flex-row-reverse">
              <div className="rounded-2xl p-3.5 text-xs shadow-sm bg-[var(--olive-primary)] text-[#FFFFFF] rounded-tr-none">
                <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
              </div>

              {/* Edit (✏️) Button: smooth hover / accessible tap */}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isEditingDisabled}
                  title="Edit question"
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--olive-primary)] hover:bg-[var(--bg-secondary)] opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 shrink-0 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Edit question"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}


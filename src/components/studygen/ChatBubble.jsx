import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message, isAI, source, fileType }) {
  return (
    <div className={`flex items-start space-x-3 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
        isAI 
          ? 'bg-[var(--olive-primary)] text-[#FFFFFF]' 
          : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]'
      }`}>
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-sm ${
        isAI 
          ? 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none' 
          : 'bg-[var(--olive-primary)] text-[#FFFFFF] rounded-tr-none'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
        
        {/* Source Badge */}
        {isAI && source && (
          <div className="mt-2 flex">
            {source === 'file' ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                📄 File Based {fileType && `• ${fileType.toUpperCase()}`}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                ❌ Source Not Available
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

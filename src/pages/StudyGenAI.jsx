import React, { useState } from 'react';
import UploadCard from '../components/studygen/UploadCard';
import ChatWindow from '../components/studygen/ChatWindow';
import { BookOpen } from 'lucide-react';
import { studygenApi } from '../services/studygenApi';

export default function StudyGenAI() {
  const [hasUploadedFiles, setHasUploadedFiles] = useState(false);

  const handleUploadComplete = async (file) => {
    try {
      const response = await studygenApi.uploadPdf(file);
      if (response && response.success === false) {
        return { success: false, error: response.error };
      }
      return { success: true, fileType: response.fileType };
    } catch (error) {
      return { success: false, error: error.message || "Network Error" };
    }
  };

  return (
    <div className="h-full flex flex-col px-4 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--olive-primary)]/10 border border-[var(--olive-primary)]/30 flex items-center justify-center text-[var(--olive-primary)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">StudyGen AI</h2>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Upload. Learn. Ask.</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Area */}
        <div className="lg:col-span-1 space-y-6">
          <UploadCard 
            onUploadComplete={handleUploadComplete} 
            onReadyStateChange={(isReady) => setHasUploadedFiles(isReady)}
          />
          
          <div className="p-5 premium-card glow-effect rounded-3xl border border-[var(--border-color)]">
            <h4 className="text-sm font-extrabold text-[var(--text-primary)] mb-3">How it works</h4>
            <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-medium">
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] flex items-center justify-center font-bold mr-2 shrink-0 text-[10px]">1</span>
                Upload your study material in any supported format.
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] flex items-center justify-center font-bold mr-2 shrink-0 text-[10px]">2</span>
                Our AI processes and understands the documents.
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] flex items-center justify-center font-bold mr-2 shrink-0 text-[10px]">3</span>
                Ask any question, and get answers based strictly on the uploaded material.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Chat Window */}
        <div className="lg:col-span-2">
          <ChatWindow hasUploadedFiles={hasUploadedFiles} />
        </div>
      </div>
    </div>
  );
}

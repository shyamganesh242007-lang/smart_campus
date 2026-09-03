import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';

const SUPPORTED_EXTENSIONS = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp'
];

export default function UploadCard({ onUploadComplete, onReadyStateChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndAddFiles = async (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => 
      SUPPORTED_EXTENSIONS.includes(f.type) || 
      f.name.endsWith('.pdf') ||
      f.name.endsWith('.docx') ||
      f.name.endsWith('.pptx') ||
      f.name.endsWith('.txt') ||
      f.name.endsWith('.png') ||
      f.name.endsWith('.jpg') ||
      f.name.endsWith('.jpeg') ||
      f.name.endsWith('.webp')
    );

    if (validFiles.length > 0) {
      for (const file of validFiles) {
        const fileId = Date.now() + Math.random();
        setFiles(prev => [...prev, { id: fileId, file: file, status: 'processing' }]);
        
        if (onUploadComplete) {
          const result = await onUploadComplete(file);
          if (result && result.success) {
            setFiles(prev => {
              const updated = prev.map(f => f.id === fileId ? { ...f, status: 'ready', fileType: result.fileType } : f);
              if (onReadyStateChange) onReadyStateChange(updated.some(f => f.status === 'ready'));
              return updated;
            });
          } else {
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'failed', error: result?.error || 'Unknown error' } : f));
          }
        }
      }
    } else {
      alert('Please upload a supported file format.');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  }, [onUploadComplete, onReadyStateChange]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    e.target.value = null;
  };

  const removeFile = (idToRemove) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== idToRemove);
      if (onReadyStateChange) onReadyStateChange(updated.some(f => f.status === 'ready'));
      return updated;
    });
  };

  return (
    <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)]">
      <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-[var(--olive-primary)]" />
        Upload Study Material
      </h3>
      
      <div
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all mb-4 ${
          isDragging 
            ? 'border-[var(--olive-primary)] bg-[var(--olive-primary)]/10' 
            : 'border-[var(--border-color)] hover:border-[var(--olive-primary)]/50 bg-[var(--bg-secondary)]/50'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--olive-primary)]/20 flex items-center justify-center mb-4 text-[var(--olive-primary)]">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Drag & Drop your files here</p>
        <p className="text-[10px] text-[var(--text-secondary)] mb-4 text-center max-w-[200px]">
          Supports PDF, DOCX, PPTX, TXT, PNG, JPG, JPEG and WEBP
        </p>
        
        <label className="cursor-pointer">
          <span className="btn-primary text-xs px-6 py-2.5 rounded-xl shadow-editorial inline-block">
            Browse Files
          </span>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg,.webp" 
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-4 max-h-[150px] overflow-y-auto custom-scrollbar">
          {files.map((f) => (
            <div key={f.id} className="bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[var(--olive-primary)]/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[var(--olive-primary)]" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{f.file.name}</p>
                  
                  {f.status === 'processing' && (
                    <p className="text-[9px] text-blue-500 font-medium flex items-center mt-0.5 animate-pulse">
                      Processing...
                    </p>
                  )}
                  {f.status === 'ready' && (
                    <p className="text-[9px] text-[var(--text-secondary)] font-medium flex items-center mt-0.5">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500 mr-1" />
                      Ready
                    </p>
                  )}
                  {f.status === 'failed' && (
                    <p className="text-[9px] text-rose-500 font-medium flex items-center mt-0.5 truncate max-w-[200px]" title={f.error}>
                      Failed: {f.error}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => removeFile(f.id)}
                className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors shrink-0"
                title="Remove File"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

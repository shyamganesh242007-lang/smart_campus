import React, { useCallback, useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, X, AlertCircle, RotateCcw } from 'lucide-react';
import { studygenApi } from '../../services/studygenApi';

const SUPPORTED_EXTENSIONS = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'image/webp'
];

export default function UploadCard({ onUploadComplete, onReadyStateChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const uploadingIdsRef = useRef(new Set());
  const deletedFileNamesRef = useRef(new Set());
  const onUploadCompleteRef = useRef(onUploadComplete);
  const onReadyStateChangeRef = useRef(onReadyStateChange);

  useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete;
  }, [onUploadComplete]);

  useEffect(() => {
    onReadyStateChangeRef.current = onReadyStateChange;
  }, [onReadyStateChange]);

  const uploadSingleFile = useCallback(async (fileItem) => {
    if (!onUploadCompleteRef.current) return;
    if (uploadingIdsRef.current.has(fileItem.id)) return;
    uploadingIdsRef.current.add(fileItem.id);

    // Clear error immediately and set status to processing on this card
    setFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: 'processing', error: null } : f));

    try {
      const result = await onUploadCompleteRef.current(fileItem.file);
      if (result && result.success) {
        setFiles(prev => {
          const updated = prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, status: 'ready', error: null, fileType: result.fileType || fileItem.name.split('.').pop().toLowerCase() } 
              : f
          );
          if (onReadyStateChangeRef.current) {
            onReadyStateChangeRef.current(updated.some(item => item.status === 'ready'));
          }
          return updated;
        });
      } else {
        setFiles(prev => {
          const updated = prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, status: 'failed', error: result?.error || 'Processing failed' } 
              : f
          );
          if (onReadyStateChangeRef.current) {
            onReadyStateChangeRef.current(updated.some(item => item.status === 'ready'));
          }
          return updated;
        });
      }
    } catch (err) {
      setFiles(prev => {
        const updated = prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'failed', error: err.message || 'Upload error' } 
            : f
        );
        if (onReadyStateChangeRef.current) {
          onReadyStateChangeRef.current(updated.some(item => item.status === 'ready'));
        }
        return updated;
      });
    } finally {
      uploadingIdsRef.current.delete(fileItem.id);
    }
  }, []);

  /**
   * Reconcile frontend upload state with backend active documents.
   * Clears stale upload errors, restores Ready status if file is active on backend,
   * and auto-retries failed uploads if backend is reachable again.
   */
  const syncBackendFiles = useCallback(async () => {
    try {
      const res = await studygenApi.getActiveFiles();
      if (!res || !res.success || !Array.isArray(res.files)) {
        // Backend unreachable or returned error; keep error state & retry button normally
        return;
      }

      const activeBackendFiles = res.files;

      setFiles(prev => {
        let hasChanges = false;
        const autoRetryQueue = [];

        const updated = prev.map(fileItem => {
          const fileName = (fileItem.name || fileItem.file?.name || '').trim().toLowerCase();

          // Check if this file is active in backend session
          const activeMatch = activeBackendFiles.find(af => {
            const afName = (af.name || af.filename || '').trim().toLowerCase();
            return afName === fileName;
          });

          if (activeMatch) {
            // Restore ready status and clear old error
            if (fileItem.status !== 'ready' || fileItem.error !== null) {
              hasChanges = true;
              return {
                ...fileItem,
                status: 'ready',
                error: null,
                fileType: activeMatch.fileType || fileItem.fileType || (fileItem.name ? fileItem.name.split('.').pop().toLowerCase() : '')
              };
            }
            return fileItem;
          }

          // If backend is reachable, but this file was marked failed due to server not reachable:
          const isServerUnreachableError = fileItem.error && (
            fileItem.error.toLowerCase().includes('not reachable') ||
            fileItem.error.toLowerCase().includes('network') ||
            fileItem.error.toLowerCase().includes('failed to fetch')
          );

          if (fileItem.status === 'failed' && isServerUnreachableError) {
            // Automatically clear the old upload error since backend is now healthy
            if (fileItem.file && (fileItem.file instanceof Blob || fileItem.file instanceof File)) {
              hasChanges = true;
              autoRetryQueue.push(fileItem);
              return {
                ...fileItem,
                status: 'processing',
                error: null
              };
            }
          }

          return fileItem;
        });

        // Add any active files from backend session that are not in frontend list
        for (const af of activeBackendFiles) {
          const afName = (af.name || af.filename || '').trim().toLowerCase();
          if (deletedFileNamesRef.current.has(afName)) continue;

          const exists = updated.some(f => (f.name || f.file?.name || '').trim().toLowerCase() === afName);
          if (!exists) {
            hasChanges = true;
            updated.push({
              id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${af.name || af.filename}`,
              name: af.name || af.filename,
              file: { name: af.name || af.filename },
              status: 'ready',
              error: null,
              fileType: af.fileType || (af.name ? af.name.split('.').pop().toLowerCase() : '')
            });
          }
        }

        if (hasChanges) {
          if (onReadyStateChangeRef.current) {
            onReadyStateChangeRef.current(updated.some(item => item.status === 'ready'));
          }
          // Launch queued retries after state update
          if (autoRetryQueue.length > 0) {
            setTimeout(() => {
              autoRetryQueue.forEach(item => uploadSingleFile(item));
            }, 100);
          }
          return updated;
        }

        return prev;
      });
    } catch (err) {
      console.warn("Backend sync check failed:", err);
    }
  }, [uploadSingleFile]);

  // Initial load and periodic polling every 4s + on window focus/online
  useEffect(() => {
    syncBackendFiles();

    const intervalId = setInterval(() => {
      syncBackendFiles();
    }, 4000);

    const handleFocus = () => {
      syncBackendFiles();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
  }, [syncBackendFiles]);

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

  const isSupportedFile = (file) => {
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
    return (
      SUPPORTED_EXTENSIONS.includes(file.type) ||
      ['pdf', 'docx', 'pptx', 'ppt', 'txt', 'md', 'markdown', 'png', 'jpg', 'jpeg', 'webp'].includes(ext)
    );
  };

  const validateAndAddFiles = async (newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(isSupportedFile);

    if (validFiles.length === 0) {
      alert('Please upload supported file formats: PDF, DOCX, PPTX, TXT, or MD.');
      return;
    }

    const duplicates = [];
    const filesToUpload = [];
    const filesToRetry = [];

    for (const file of validFiles) {
      const fileNameLower = file.name.trim().toLowerCase();
      // Remove from deleted set if re-uploaded
      deletedFileNamesRef.current.delete(fileNameLower);

      const existing = files.find(
        f => (f.name || f.file?.name || '').trim().toLowerCase() === fileNameLower
      );

      if (existing) {
        if (existing.status === 'ready' || existing.status === 'processing') {
          duplicates.push(file.name);
        } else {
          // File was failed: update the same card with fresh File object and retry
          filesToRetry.push({ ...existing, file: file, error: null, status: 'processing' });
        }
      } else {
        const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newFileItem = {
          id: fileId,
          name: file.name,
          file: file,
          status: 'processing',
          error: null,
          fileType: file.name.split('.').pop().toLowerCase()
        };
        filesToUpload.push(newFileItem);
      }
    }

    if (duplicates.length > 0) {
      setDuplicateWarning(`Skipped duplicate file${duplicates.length > 1 ? 's' : ''}: ${duplicates.join(', ')}`);
      setTimeout(() => setDuplicateWarning(null), 4000);
    }

    if (filesToRetry.length > 0) {
      setFiles(prev => prev.map(f => {
        const retryItem = filesToRetry.find(r => r.id === f.id);
        return retryItem ? { ...f, file: retryItem.file, status: 'processing', error: null } : f;
      }));
      for (const item of filesToRetry) {
        uploadSingleFile(item);
      }
    }

    if (filesToUpload.length > 0) {
      setFiles(prev => [...prev, ...filesToUpload]);
      for (const item of filesToUpload) {
        uploadSingleFile(item);
      }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  }, [files, uploadSingleFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    e.target.value = null;
  };

  const removeFile = async (idToRemove) => {
    const targetFile = files.find(f => f.id === idToRemove);
    if (targetFile) {
      const fileName = targetFile.name || targetFile.file?.name;
      if (fileName) {
        deletedFileNamesRef.current.add(fileName.trim().toLowerCase());
      }
      if (fileName && targetFile.status === 'ready') {
        try {
          await studygenApi.deleteFile(fileName);
        } catch (err) {
          console.error("Failed to delete file from backend session:", err);
        }
      }
    }
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== idToRemove);
      if (onReadyStateChangeRef.current) {
        onReadyStateChangeRef.current(updated.some(f => f.status === 'ready'));
      }
      return updated;
    });
  };

  const retryUpload = async (fileItem) => {
    if (uploadingIdsRef.current.has(fileItem.id)) return;

    // 1. Immediately reset error state and switch to processing on the SAME file card
    setFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: 'processing', error: null } : f));

    // 2. Check if backend session already contains this file
    try {
      const activeRes = await studygenApi.getActiveFiles();
      if (activeRes && activeRes.success && Array.isArray(activeRes.files)) {
        const found = activeRes.files.find(af => {
          const afName = (af.name || af.filename || '').trim().toLowerCase();
          return afName === fileItem.name.trim().toLowerCase();
        });
        if (found) {
          // File is already indexed on backend! Restore to ready immediately
          setFiles(prev => {
            const updated = prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'ready', error: null, fileType: found.fileType || f.fileType } 
                : f
            );
            if (onReadyStateChangeRef.current) {
              onReadyStateChangeRef.current(updated.some(item => item.status === 'ready'));
            }
            return updated;
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Backend check during retry:", err);
    }

    // 3. Resend upload only for this failed card
    if (fileItem.file && (fileItem.file instanceof Blob || fileItem.file instanceof File)) {
      await uploadSingleFile(fileItem);
    } else {
      setFiles(prev => {
        const updated = prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'failed', error: 'File data not in memory. Please browse file again.' } 
            : f
        );
        if (onReadyStateChangeRef.current) {
          onReadyStateChangeRef.current(updated.some(item => item.status === 'ready'));
        }
        return updated;
      });
    }
  };

  return (
    <div className="premium-card glow-effect p-6 rounded-3xl border border-[var(--border-color)]">
      <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-[var(--olive-primary)]" />
        Upload Study Material
      </h3>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center">
          <AlertCircle className="w-3.5 h-3.5 mr-2 shrink-0" />
          <span className="truncate">{duplicateWarning}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
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
        <p className="text-[10px] text-[var(--text-secondary)] mb-4 text-center max-w-[220px]">
          Supports unlimited PDF, DOCX, PPTX, TXT, MD
        </p>

        <label className="cursor-pointer">
          <span className="btn-primary text-xs px-6 py-2.5 rounded-xl shadow-editorial inline-block">
            Browse Files
          </span>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.pptx,.ppt,.txt,.md,.markdown,.png,.jpg,.jpeg,.webp" 
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2 mt-4 max-h-[190px] overflow-y-auto custom-scrollbar">
          {files.map((f) => {
            const displayName = f.name || f.file?.name || "Uploaded File";
            const extBadge = (f.fileType || displayName.split('.').pop() || '').toUpperCase();

            return (
              <div 
                key={f.id} 
                className={`bg-[var(--bg-secondary)]/50 border rounded-xl p-3 flex items-center justify-between transition-colors ${
                  f.status === 'failed' 
                    ? 'border-rose-500/30' 
                    : f.status === 'ready' 
                    ? 'border-emerald-500/20' 
                    : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    f.status === 'failed'
                      ? 'bg-rose-500/10 text-rose-500'
                      : f.status === 'ready'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-[var(--olive-primary)]/20 text-[var(--olive-primary)]'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="truncate min-w-0">
                    <div className="flex items-center space-x-1.5 truncate">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate" title={displayName}>
                        {displayName}
                      </p>
                      {extBadge && (
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-semibold shrink-0 ${
                          f.status === 'ready'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : f.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-[var(--olive-primary)]/10 text-[var(--olive-primary)]'
                        }`}>
                          {extBadge}
                        </span>
                      )}
                    </div>

                    {/* Status Display: Processing, Ready, or Failed */}
                    {f.status === 'processing' && (
                      <p className="text-[9px] text-blue-500 font-medium flex items-center mt-0.5 animate-pulse">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-ping"></span>
                        Processing...
                      </p>
                    )}

                    {f.status === 'ready' && (
                      <p className="text-[9px] text-emerald-500 font-medium flex items-center mt-0.5">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-500 mr-1 shrink-0" />
                        Ready
                      </p>
                    )}

                    {f.status === 'failed' && (
                      <p className="text-[9px] text-rose-500 font-medium flex items-center mt-0.5 truncate max-w-[200px]" title={f.error}>
                        <AlertCircle className="w-2.5 h-2.5 text-rose-500 mr-1 shrink-0" />
                        Failed: {f.error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  {/* Retry button for failed files */}
                  {f.status === 'failed' && (
                    <button
                      onClick={() => retryUpload(f)}
                      className="p-1.5 hover:bg-[var(--olive-primary)]/10 text-[var(--olive-primary)] rounded-lg transition-colors"
                      title="Retry Upload"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Remove file button */}
                  <button 
                    onClick={() => removeFile(f.id)}
                    className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"
                    title="Remove File"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

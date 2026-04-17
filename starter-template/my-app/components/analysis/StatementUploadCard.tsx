'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatementUploadCardProps {
  uploadedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

const acceptedTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
];

export default function StatementUploadCard({
  uploadedFile,
  onFileSelect,
  onFileRemove,
  disabled
}: StatementUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      return 'Invalid file type. Please upload a PDF, Excel, CSV, or image.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File too large. Maximum size is 10MB.';
    }
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      const err = validateFile(file);
      if (err) {
        setError(err);
      } else {
        setError(null);
        onFileSelect(file);
      }
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const err = validateFile(file);
      if (err) {
        setError(err);
      } else {
        setError(null);
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Upload size={20} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Statement Upload</h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center group",
          isDragging ? "border-indigo-500 bg-indigo-500/5" : "border-slate-700 hover:border-slate-600 bg-slate-900/20",
          uploadedFile ? "border-emerald-500/50 bg-emerald-500/5" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileInput}
          disabled={disabled}
          accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp"
        />

        <AnimatePresence mode="wait">
          {uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/30">
                <CheckCircle size={32} />
              </div>
              <p className="text-white font-semibold text-lg">{uploadedFile.name}</p>
              <p className="text-slate-400 text-sm mt-1">
                {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for analysis
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
                className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
              >
                <X size={14} /> Remove File
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-slate-700 group-hover:text-indigo-400 transition-all duration-300",
                isDragging && "bg-indigo-500/20 text-indigo-400"
              )}>
                <FileText size={32} />
              </div>
              <p className="text-white font-semibold text-lg">Drag & drop your statement</p>
              <p className="text-slate-400 mt-2">
                or <span className="text-indigo-400 font-medium">browse your files</span>
              </p>
              <p className="text-slate-500 text-xs mt-4">
                Supports PDF, Excel, CSV and Bill Images (Max 10MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-sm"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}
    </div>
  );
}

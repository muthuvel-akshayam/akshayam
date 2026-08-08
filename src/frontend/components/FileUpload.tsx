'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { uploadFile } from '@/backend/actions/upload';
import { useLanguage } from '@/frontend/context/LanguageContext';

interface FileUploadProps {
  label: string;
  subLabel: string;
  bucket: string;
  onUploadSuccess: (url: string) => void;
  initialUrl?: string;
}

export function FileUpload({ label, subLabel, bucket, onUploadSuccess, initialUrl }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(!!initialUrl);
  const [fileName, setFileName] = useState<string | undefined>(
    initialUrl ? (initialUrl.split('/').pop() || 'Existing File') : undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      
      // Generate a unique path for the file
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      formData.append('path', path);

      const result = await uploadFile(formData);

      if (result.success && result.url) {
        onUploadSuccess(result.url);
        setSuccess(true);
      } else if (result.success && result.path) {
        // If it's a private bucket, we might just store the path and use it for signed URLs later
        onUploadSuccess(result.path);
        setSuccess(true);
      } else {
        alert((language === 'TA' ? 'பதிவேற்றம் தோல்வியடைந்தது: ' : 'Upload failed: ') + result.error);
        setFileName(undefined);
      }
    } catch (err: any) {
      alert((language === 'TA' ? 'பதிவேற்றம் தோல்வியடைந்தது: ' : 'Upload failed: ') + err.message);
      setFileName(undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReupload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      onClick={() => {
        if (!isUploading && !success && fileInputRef.current) {
          fileInputRef.current.click();
        }
      }}
      className={`relative border-2 border-dashed p-5 rounded-2xl text-center transition-all ${
        success 
          ? 'border-green-400 bg-green-50/40 hover:bg-green-50/70' 
          : isUploading
          ? 'border-indigo-400 bg-indigo-50/30'
          : 'border-gray-300 hover:border-primary hover:bg-background/50 cursor-pointer'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {isUploading ? (
        <div className="py-2">
          <Loader2 className="w-8 h-8 mx-auto text-primary mb-2 animate-spin" />
          <p className="text-xs font-bold text-primary animate-pulse">
            {language === 'TA' ? 'பதிவேற்றப்படுகிறது...' : 'Uploading file...'}
          </p>
          {fileName && <p className="text-[10px] text-gray-500 mt-1 truncate max-w-[180px] mx-auto">{fileName}</p>}
        </div>
      ) : success ? (
        <div className="py-1 animate-in zoom-in-95 duration-200">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-xs font-extrabold text-green-700">
            {language === 'TA' ? 'வெற்றிகரமாக பதிவேற்றப்பட்டது' : 'Uploaded Successfully'}
          </p>
          {fileName && (
            <p className="text-[10px] font-medium text-gray-600 mt-1.5 truncate max-w-[200px] mx-auto bg-white/90 px-2.5 py-0.5 rounded-full border border-green-200 inline-block shadow-2xs">
              📄 {fileName}
            </p>
          )}

          <div className="mt-3 pt-3 border-t border-green-200/60">
            <button
              type="button"
              onClick={handleReupload}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-green-100/80 text-green-700 border border-green-400 font-bold text-xs shadow-sm hover:shadow active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-green-600" />
              <span>{language === 'TA' ? 'மீண்டும் பதிவேற்ற' : 'Reupload File'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-2">
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-background text-gray-400 group-hover:text-primary rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-700">{label}</p>
          <p className="text-[10px] text-gray-400 font-medium mt-1">{subLabel}</p>
        </div>
      )}
    </div>
  );
}

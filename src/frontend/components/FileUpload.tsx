'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { supabase } from '@/backend/supabase';

interface FileUploadProps {
  label: string;
  subLabel: string;
  bucket: string;
  onUploadSuccess: (url: string) => void;
  onFileSelect?: (file: File) => void;
  initialUrl?: string;
  required?: boolean;
}

const addWatermark = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }
      
      ctx.drawImage(img, 0, 0);
      
      const patternWidth = Math.max(300, img.width / 4);
      const patternHeight = Math.max(250, img.height / 4);
      const fontSize = Math.max(32, patternWidth / 6);
      
      ctx.font = `900 ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      canvas.style.letterSpacing = '4px';
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-35 * Math.PI / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      for (let x = -canvas.width; x < canvas.width * 2; x += patternWidth) {
        for (let y = -canvas.height; y < canvas.height * 2; y += patternHeight) {
          ctx.fillText('AKSHAYAM', x, y);
          ctx.strokeText('AKSHAYAM', x, y);
        }
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: file.type }));
        } else {
          resolve(file);
        }
      }, file.type, 0.9);
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
};

export function FileUpload({ label, subLabel, bucket, onUploadSuccess, onFileSelect, initialUrl, required }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(!!initialUrl);
  const [fileName, setFileName] = useState<string | undefined>(
    initialUrl ? (initialUrl.split('/').pop() || 'Existing File') : undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'TA' ? 'கோப்பு அளவு 10MB-க்கு மேல் இருக்கக்கூடாது.' : 'File size must be less than 10MB.');
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }

    setFileName(file.name);
    setIsUploading(true);
    setSuccess(false);

    try {
      if (file.type.startsWith('image/') && bucket === 'profile-photos') {
        file = await addWatermark(file);
      }

      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type,
      });

      if (error) {
        throw error;
      }

      if (bucket === 'profile-photos') {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
        onUploadSuccess(publicUrlData.publicUrl);
      } else {
        onUploadSuccess(path);
      }
      
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
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
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={bucket === 'jathagam' ? "image/*,application/pdf" : "image/*"}
      />

      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <>
            <div className="p-3 bg-white/50 rounded-full animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-primary">
                {language === 'TA' ? 'பதிவேற்றப்படுகிறது...' : 'Uploading...'}
              </p>
              <p className="text-sm text-gray-500 truncate max-w-[200px]">{fileName}</p>
            </div>
          </>
        ) : success ? (
          <>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-green-700">
                {language === 'TA' ? 'வெற்றிகரமாக பதிவேற்றப்பட்டது' : 'Successfully Uploaded'}
              </p>
              <p className="text-sm text-green-600/70 truncate max-w-[200px]">{fileName}</p>
            </div>
            
            <button
              onClick={handleReupload}
              className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {language === 'TA' ? 'மாற்று' : 'Change File'}
            </button>
          </>
        ) : (
          <>
            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </p>
              <p className="text-sm text-gray-500">{subLabel}</p>
            </div>
            
            <button className="mt-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
              {language === 'TA' ? 'கோப்பை தேர்ந்தெடுக்கவும்' : 'Select File'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

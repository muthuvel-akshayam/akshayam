'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onSuccess: () => void;
  language?: 'TA' | 'EN';
}

export function OtpVerificationModal({ isOpen, onClose, phone, onSuccess, language = 'TA' }: OtpVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(''));
      setError('');
      setTimer(30);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && isOpen) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isOpen]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextFocus = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError(language === 'TA' ? '6-இலக்க OTP ஐ உள்ளிடவும்' : 'Please enter 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpValue })
      });
      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || (language === 'TA' ? 'தவறான OTP' : 'Invalid OTP'));
      }
    } catch (err) {
      setError(language === 'TA' ? 'சரிபார்ப்பதில் பிழை' : 'Verification error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      
      if (data.success) {
        setTimer(30);
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || (language === 'TA' ? 'மீண்டும் அனுப்புவதில் பிழை' : 'Failed to resend'));
      }
    } catch (err) {
      setError(language === 'TA' ? 'பிணைய பிழை' : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'TA' ? 'OTP சரிபார்ப்பு' : 'OTP Verification'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6 text-center">
            {language === 'TA' ? 'OTP குறியீடு அனுப்பப்பட்டது:' : 'OTP sent to:'}<br/>
            <span className="font-bold text-gray-900">+91 {phone}</span>
          </p>

          <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-red-600 outline-none transition-all"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium mb-4">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join('').length < 6}
            className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-600/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'TA' ? 'சரிபார்க்கவும்' : 'Verify')}
          </button>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={timer > 0 || isLoading}
              className="text-sm font-medium text-red-600 hover:text-red-600/80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {timer > 0 
                ? (language === 'TA' ? `மீண்டும் அனுப்பவும் (${timer}வி)` : `Resend OTP in ${timer}s`)
                : (language === 'TA' ? 'மீண்டும் அனுப்பவும்' : 'Resend OTP')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

interface PhoneOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
  language?: 'TA' | 'EN';
  initialPhone?: string;
}

export default function PhoneOtpModal({ isOpen, onClose, onSuccess, language = 'TA', initialPhone = "" }: PhoneOtpModalProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone);
      setStep("phone");
      setOtp("");
      setError("");
    }
    if (typeof window !== "undefined" && !window.recaptchaVerifier && isOpen) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, [isOpen, initialPhone]);

  const handleSendOtp = async () => {
    setError("");
    const cleaned = phone.replace(/\D/g, "").slice(-10);
    if (cleaned.length !== 10) {
      setError(language === 'TA' ? "சரியான 10 இலக்க எண்ணை உள்ளிடவும்" : "Please enter a valid 10-digit number");
      return;
    }

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = `+91${cleaned}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || (language === 'TA' ? "OTP அனுப்புவதில் பிழை" : "Error sending OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult || otp.length !== 6) {
      setError(language === 'TA' ? "6 இலக்க OTP ஐ உள்ளிடவும்" : "Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(otp);
      onSuccess(phone.replace(/\D/g, "").slice(-10));
      onClose();
    } catch (err) {
      setError(language === 'TA' ? "தவறான OTP குறியீடு" : "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <div id="recaptcha-container"></div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">
          {step === "phone" 
            ? (language === 'TA' ? "தொலைபேசி எண் சரிபார்ப்பு" : "Phone Verification") 
            : (language === 'TA' ? "OTP உள்ளிடவும்" : "Enter OTP")}
        </h3>

        {error && <p className="text-xs text-red-600 mb-3 text-center">{error}</p>}

        {step === "phone" ? (
          <div className="space-y-4">
            <div className="flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-600">
              <span className="bg-slate-100 px-3 py-2 text-slate-600 font-semibold text-sm border-r">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading 
                ? (language === 'TA' ? "அனுப்பப்படுகிறது..." : "Sending...") 
                : (language === 'TA' ? "OTP பெறுக" : "Get OTP")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              maxLength={6}
              placeholder={language === 'TA' ? "6-இலக்க OTP" : "6-digit OTP"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-bold border rounded-lg py-2 focus:ring-2 focus:ring-red-600 outline-none"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading 
                ? (language === 'TA' ? "சரிபார்க்கிறது..." : "Verifying...") 
                : (language === 'TA' ? "சரிபார்க்கவும்" : "Verify")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

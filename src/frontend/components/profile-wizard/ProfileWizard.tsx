'use client'

import { useState } from 'react';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2FamilyDetails } from './Step2FamilyDetails';
import { Step3Expectations } from './Step3Expectations';
import { Step4Payment } from './Step4Payment';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { formTranslations } from '@/frontend/utils/formTranslations';

export default function ProfileWizard({ language: propLang, hideHeader = false, initialData }: { language?: 'TA' | 'EN'; hideHeader?: boolean; initialData?: any }) {
  const { language: contextLang, toggleLanguage } = useLanguage();
  const language = propLang || contextLang || 'TA';
  const t = formTranslations[language];
  const [currentStep, setCurrentStep] = useState(0);

  const steps = language === 'TA' 
    ? ['அடிப்படை விவரங்கள்', 'குடும்பம் & ஜாதகம்', 'எதிர்பார்ப்புகள்', 'பணம் செலுத்துதல்'] 
    : ['Basic Details', 'Family & Astrology', 'Partner Preferences', 'Payment'];

  const [gender, setGender] = useState(initialData?.profile?.gender || 'MALE');

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-primary/20">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-primary/15 overflow-hidden relative">
        
        {/* Top Decorative Border */}
        <div className="h-3 w-full bg-gradient-to-r from-[var(--color-primary)] via-[#D4AF37] to-[var(--color-primary)]"></div>

        <div className="p-8 md:p-10">
          {!hideHeader && (
            <div className="flex justify-between items-center mb-6">
              <a href="/dashboard" className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all">
                ← {language === 'TA' ? 'என் சுயவிவரம்' : 'My Dashboard'}
              </a>
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleLanguage} title="Translate English/Tamil">
  <span className={`text-xs font-bold ${language !== 'TA' ? 'text-primary' : 'text-gray-400'}`}>English</span>
  <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-primary transition-colors shadow-inner">
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${language === 'TA' ? 'translate-x-[20px]' : 'translate-x-1'}`}></span>
  </div>
  <span className={`text-xs font-bold ${language === 'TA' ? 'text-primary' : 'text-gray-400'}`}>தமிழ்</span>
</div>
            </div>
          )}

          <div className="mb-10 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <img src="/akshayam_logo.png" alt="Akshayam Logo" className="h-16 md:h-20 object-contain" />
              <span className="text-[10px] sm:text-xs font-bold text-primary mt-1 whitespace-nowrap">ஜாதகம் முதல் பந்தி வரை</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 font-serif">
              {language === 'TA' ? 'சுயவிவரப் பதிவு / Create Your Profile' : 'Create Your Profile'}
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-medium">
              {language === 'TA' ? 'எங்கள் நம்பிக்கையான சமூகத்தில் இணைந்து உங்கள் சிறந்த வாழ்க்கைத்துணையை கண்டறியுங்கள்' : 'Join our trusted community to find your perfect life partner'}
            </p>
          </div>
          
          {/* Progress Tracker */}
          <div className="flex gap-2 md:gap-4 mb-10 relative z-10">
            {steps.map((step, idx) => (
              <div key={step} className="flex-1 flex flex-col gap-2">
                <div className={`h-2.5 rounded-full transition-all duration-500 shadow-sm ${idx <= currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                <span className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${idx === currentStep ? 'text-primary' : (idx < currentStep ? 'text-primary/60' : 'text-gray-400')}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          {/* Trust Indicator */}
          <div className="bg-background border border-[#D4AF37]/40 p-4 rounded-xl mb-8 flex items-start shadow-sm">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-primary">
                {language === 'TA' ? '100% தனியுரிமை பாதுகாப்பு / Privacy Protected' : '100% Privacy Protected'}
              </p>
              <p className="text-xs text-gray-700 mt-0.5 font-medium">
                {language === 'TA' ? 'உங்கள் தொடர்பு எண்கள் மற்றும் முகவரி இயல்பாகவே மறைக்கப்படும். நீங்கள் விருப்பம் தெரிவித்தால் மட்டுமே பகிரப்படும்.' : 'Your contact numbers and address are hidden by default and only shared upon your mutual approval.'}
              </p>
            </div>
          </div>

          <div className="mt-8 relative">
            <div className={`transition-opacity duration-300 ${currentStep === 0 ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <Step1PersonalInfo onNext={nextStep} language={language} initialData={initialData} onGenderChange={setGender} />
            </div>
            <div className={`transition-opacity duration-300 ${currentStep === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <Step2FamilyDetails onNext={nextStep} onPrev={prevStep} language={language} initialData={initialData} gender={gender} />
            </div>
            <div className={`transition-opacity duration-300 ${currentStep === 2 ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <Step3Expectations onNext={nextStep} onPrev={prevStep} language={language} initialData={initialData} gender={gender} />
            </div>
            <div className={`transition-opacity duration-300 ${currentStep === 3 ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <Step4Payment onNext={() => window.location.href = '/dashboard'} language={language} initialData={initialData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

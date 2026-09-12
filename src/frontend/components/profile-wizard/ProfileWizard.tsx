'use client'

import { useState } from 'react';
import { Phone } from 'lucide-react';
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

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-wider font-serif">ஜாதகம் முதல் பந்தி வரை</h1>
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
          <div className="bg-background border border-[#D4AF37]/40 p-4 rounded-xl mb-6 flex items-start shadow-sm">
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

          {/* Required Documents Alert */}
          {currentStep === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-8 shadow-sm">
              <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {language === 'TA' ? 'பதிவு செய்ய தேவையானவை / Required Details' : 'Required Details'}
              </h4>
              <ul className="text-xs md:text-sm text-emerald-700 space-y-1.5 ml-1 list-disc list-inside font-medium">
                <li>{language === 'TA' ? 'புகைப்படம் / Photo' : 'Photo'}</li>
                <li>{language === 'TA' ? 'ஜாதகம் / Jathakam' : 'Jathakam'}</li>
                <li>{language === 'TA' ? 'சாதி சான்றிதழ் / Community Certificate' : 'Community Certificate'}</li>
                <li>{language === 'TA' ? 'வீட்டின் கூகுள் இருப்பிட இணைப்பு (விருப்பமிருந்தால்) / House Google Location Link (Optional)' : 'House Google Location Link (Optional)'}</li>
                <li>{language === 'TA' ? 'அலுவலகத்தின் கூகுள் இருப்பிட இணைப்பு (விருப்பமிருந்தால்) / Office or Work Location Link (Optional)' : 'Office or Work Location Link (Optional)'}</li>
              </ul>
            </div>
          )}

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

      {/* FOOTER FOR BRANDING & CONTACT */}
      <footer className="mt-16 border-t border-primary/10 py-10 max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-primary font-serif mb-3">
              {language === 'TA' ? 'அக்‌ஷயம் திருமணத் தகவல் மையம்' : 'Akshayam Matrimony'}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {language === 'TA' 
                ? 'ஜாதகம் முதல் பந்தி வரை - உங்கள் திருமணத் தேவைகள் அனைத்திற்கும் ஒரு சிறந்த இடம்.' 
                : 'From Horoscopes to Wedding Feast - The perfect place for all your wedding needs.'}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-900 mb-3">{language === 'TA' ? 'தொடர்புக்கு' : 'Contact Us'}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 justify-center md:justify-start bg-white px-4 py-2 rounded-full shadow-sm w-fit border border-gray-100 mx-auto md:mx-0">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-[#004d40] text-base tracking-wide">96776 13716</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start bg-white px-4 py-2 rounded-full shadow-sm w-fit border border-gray-100 mx-auto md:mx-0">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-[#004d40] text-base tracking-wide">93452 89217</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-900 mb-3">{language === 'TA' ? 'முகவரி' : 'Address'}</h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {language === 'TA' ? (
                <>அருள்மிகு குழந்தை வேலாயுதசுவாமி திருக்கோயில்,<br />மலைக்கோயில், மங்கலம் ரோடு,<br />திருப்பூர் - 641 663</>
              ) : (
                <>Arulmigu Kuzhandhai Velayudhaswamy Thirukovil,<br />Malaikovil, Mangalam Road,<br />Tiruppur - 641 663</>
              )}
            </p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-200/60 text-center text-sm text-gray-600 space-y-3 bg-gray-50/50 p-6 rounded-2xl">
          <p className="font-bold text-gray-800">
            {language === 'TA' ? (
              <>
                <span className="text-red-600">குறிப்பு:</span> இரு வீட்டாரும் ஜாதகப் பொருத்தம் பார்த்த பின்பு நன்கு விசாரித்து சுபம் பேசி முடிக்கவும்.
              </>
            ) : (
              <>
                <span className="text-red-600">Note:</span> Both families should verify the horoscopes and thoroughly inquire before finalizing the marriage.
              </>
            )}
          </p>
          <p>
            {language === 'TA' 
              ? 'எங்கள் சேவைகள் ஜாதகம் முதல் பந்தி வரை நீங்கள் பயன்படுத்தலாம்.' 
              : 'You can use our services from horoscope matching to the wedding feast.'}
          </p>
          <p className="font-bold text-primary">
            {language === 'TA' 
              ? 'உங்கள் திருமண பத்திரிகையில் அக்‌ஷயம் திருமண தகவல் மையம் என்று சேர்க்க கேட்டு கொள்கிறோம்.' 
              : 'We kindly request you to include "Akshayam Matrimony" in your wedding invitation.'}
          </p>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          © 2026 Akshayam Matrimony. {language === 'TA' ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}
        </div>
      </footer>
    </div>
  );
}

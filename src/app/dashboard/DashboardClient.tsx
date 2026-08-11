'use client';

import { 
  User, MapPin, Briefcase, GraduationCap, Heart, 
  Calendar, Activity, Users, MessageCircle, Star, ShieldCheck, Download, Lock, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { translateRasi, translateNakshatra } from '@/frontend/utils/astrology';
import { logoutUser } from '@/backend/actions/auth';

export default function DashboardClient({ user, matches = [] }: { user: any; matches?: any[] }) {
  const { language, toggleLanguage } = useLanguage();

  if (!user || !user.profile) {
    return (
      <div className="min-h-screen bg-background text-gray-900 flex flex-col items-center justify-center p-4 font-sans">
        <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/15 py-3 px-4 sm:px-6 shadow-sm flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/akshayam_logo.png" alt="Akshayam Logo" className="h-8 sm:h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleLanguage} title="Translate English/Tamil">
  <span className={`text-xs font-bold ${language !== 'TA' ? 'text-primary' : 'text-gray-400'}`}>English</span>
  <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-primary transition-colors shadow-inner">
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${language === 'TA' ? 'translate-x-[20px]' : 'translate-x-1'}`}></span>
  </div>
  <span className={`text-xs font-bold ${language === 'TA' ? 'text-primary' : 'text-gray-400'}`}>தமிழ்</span>
</div>
        </header>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full mt-16">
          <div className="w-16 h-16 bg-red-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{language === 'TA' ? 'சுயவிவரம் இல்லை' : 'No Profile Found'}</h2>
          <p className="text-gray-600 mb-8">{language === 'TA' ? 'நீங்கள் இன்னும் உங்கள் சுயவிவர பதிவை முடிக்கவில்லை.' : "You haven't completed your profile registration yet."}</p>
          <Link href="/profile" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-light transition-all shadow-md inline-block w-full">
            {language === 'TA' ? 'பதிவை முடிக்கவும்' : 'Complete Registration'}
          </Link>
        </div>
      </div>
    );
  }

  const { profile, family, expectations } = user;

  const calculateAge = (dob: Date | string | null | undefined) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 'N/A';
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  };
  const age = calculateAge(profile.dob);

  const calculateYears = (dob: Date | string | null | undefined) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 'N/A';
    const today = new Date();
    let y = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      y--;
    }
    return y;
  };

  const isApproved = String(profile.status) === 'APPROVED';
  const isRejected = String(profile.status) === 'REJECTED';

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-background text-gray-900 pb-12 font-sans selection:bg-rose-200 flex flex-col justify-between">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/15 py-3 px-4 sm:px-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-primary-light transition-all shadow">
              ← {language === 'TA' ? 'முகப்பு' : 'Home'}
            </Link>
            <div className="text-center font-bold text-primary text-base md:text-lg">
              {language === 'TA' ? 'என் சுயவிவரம் / My Profile' : 'My Profile Dashboard'}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={async () => {
                  await logoutUser();
                  window.location.href = '/';
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'TA' ? 'வெளியேறு' : 'Logout'}</span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleLanguage} title="Translate English/Tamil">
  <span className={`text-xs font-bold ${language !== 'TA' ? 'text-primary' : 'text-gray-400'}`}>English</span>
  <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-primary transition-colors shadow-inner">
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${language === 'TA' ? 'translate-x-[20px]' : 'translate-x-1'}`}></span>
  </div>
  <span className={`text-xs font-bold ${language === 'TA' ? 'text-primary' : 'text-gray-400'}`}>தமிழ்</span>
</div>
            </div>
          </div>
        </header>

        {/* CONTENT CARD */}
        <main className="max-w-3xl mx-auto w-full px-4 py-12 flex-grow flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl border border-primary/15 overflow-hidden w-full text-center">
            {/* Top Banner Gradient */}
            <div className={`h-28 w-full relative ${isRejected ? 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-700' : 'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]'}`}>
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
            </div>

            {/* Avatar & Badge */}
            <div className="relative px-6 pb-8 pt-0 -mt-14">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 shadow-lg mx-auto flex items-center justify-center text-3xl font-bold text-primary">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className={`absolute bottom-0 right-0 p-1.5 rounded-full text-white shadow-md border-2 border-white ${isRejected ? 'bg-rose-600' : 'bg-amber-500 animate-pulse'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mt-3">{profile.name}</h2>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-mono font-bold mt-1">
                AKSHAYAM ID: {profile.id?.slice(0, 8).toUpperCase() || 'NEW'}
              </span>

              {/* Status Box */}
              <div className={`mt-8 p-6 rounded-2xl border text-left max-w-xl mx-auto ${isRejected ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-amber-50/70 border-amber-200/80 text-amber-950'}`}>
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl text-white shadow-sm shrink-0 ${isRejected ? 'bg-rose-600' : 'bg-amber-500'}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight">
                      {isRejected
                        ? (language === 'TA' ? 'பதிவில் மாற்றம் தேவை / Action Required' : 'Profile Action Required')
                        : (language === 'TA' ? 'நிர்வாக ஒப்புதலுக்காக காத்திருக்கிறது / Under Review' : 'Waiting for Admin Approval')}
                    </h3>
                    <p className="text-xs md:text-sm mt-1.5 leading-relaxed text-gray-700">
                      {isRejected
                        ? (profile.rejectedReason || (language === 'TA' ? 'உங்கள் சுயவிவரத்தில் சில தகவல்களை சரிசெய்ய வேண்டியுள்ளது.' : 'Our moderation team reviewed your biodata and requested a few changes before approval.'))
                        : (language === 'TA'
                            ? 'உங்கள் பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! எங்கள் நிர்வாகக் குழு உங்கள் தகவல்கள் மற்றும் ஜாதகத்தை சரிபார்த்து விரைவில் ஒப்புதல் அளிக்கும். ஒப்புதல் கிடைத்த பின்னரே உங்கள் சுயவிவரம் வரன் தேடலுக்கு நேரலையாக காண்பிக்கப்படும்.'
                            : 'Your matrimonial biodata has been successfully submitted! Our moderation team is currently verifying your details and horoscope. Once approved, your profile will automatically go live for partner search.')}
                    </p>
                  </div>
                </div>

                {!isRejected && (
                  <div className="mt-6 pt-5 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-100 shadow-2xs">
                      <div className="text-[11px] font-bold text-emerald-700">✓ STEP 1</div>
                      <div className="text-xs font-semibold text-gray-800 mt-0.5">{language === 'TA' ? 'பதிவு முடிந்தது' : 'Registration Completed'}</div>
                    </div>
                    <div className="bg-amber-100/90 p-3 rounded-xl border border-amber-300 shadow-2xs">
                      <div className="text-[11px] font-bold text-amber-800 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                        STEP 2 (CURRENT)
                      </div>
                      <div className="text-xs font-bold text-amber-950 mt-0.5">{language === 'TA' ? 'நிர்வாக சரிபார்ப்பு' : 'Admin Verification'}</div>
                    </div>
                    <div className="bg-white/50 p-3 rounded-xl border border-gray-200 opacity-60">
                      <div className="text-[11px] font-bold text-gray-500">🔒 STEP 3</div>
                      <div className="text-xs font-semibold text-gray-600 mt-0.5">{language === 'TA' ? 'வரன் தேடல் நேரலை' : 'Live for Search'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/profile"
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-light text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <span>{language === 'TA' ? 'சுயவிவரத்தை திருத்து / பார்வையிட' : 'View / Edit My Profile'}</span>
                  <span>→</span>
                </Link>
                <button
                  onClick={async () => {
                    await logoutUser();
                    window.location.href = '/';
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-all text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'TA' ? 'வெளியேறு' : 'Logout'}</span>
                </button>
              </div>

              <div className="mt-6 text-[11px] text-gray-400">
                {language === 'TA' ? 'உதவிக்கு எங்களை தொடர்பு கொள்ளவும்: support@akshayam.com' : 'Need help or expedited verification? Contact support@akshayam.com'}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-900 pb-12 font-sans selection:bg-rose-200">
      
      {/* GLOBAL NAVBAR WITH LANGUAGE TOGGLE */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/15 py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-primary-light transition-all shadow">
            ← {language === 'TA' ? 'முகப்பு' : 'Home'}
          </Link>
          <div className="text-center font-bold text-primary text-base md:text-lg">
            {language === 'TA' ? 'என் சுயவிவரம் / My Profile' : 'My Profile Dashboard'}
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {profile.status === 'APPROVED' && (
              <Link href="/profiles" className="text-xs font-bold text-primary hover:underline hidden sm:inline-block">
                {language === 'TA' ? 'வரன்களைப் பார்வையிட' : 'Browse Matches'}
              </Link>
            )}
            <button
              onClick={async () => {
                await logoutUser();
                window.location.href = '/';
              }}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'TA' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={toggleLanguage} title="Translate English/Tamil">
  <span className={`text-xs font-bold ${language !== 'TA' ? 'text-primary' : 'text-gray-400'}`}>English</span>
  <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-primary transition-colors shadow-inner">
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${language === 'TA' ? 'translate-x-[20px]' : 'translate-x-1'}`}></span>
  </div>
  <span className={`text-xs font-bold ${language === 'TA' ? 'text-primary' : 'text-gray-400'}`}>தமிழ்</span>
</div>
          </div>
        </div>
      </header>

      {/* 1. HERO HEADER REDESIGN */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Cover Photo Area */}
          <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
          </div>
          
          {/* Avatar and Basic Header */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 relative">
            <div className="flex flex-col items-center -mt-20 md:-mt-24 mb-6">
              
              {/* Elevated Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-1 rounded-full shadow-lg relative z-20 border-4 border-white mb-4">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover rounded-full bg-gray-100" />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {/* Verified Badge */}
                <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Profile Verified">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Name and ID */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                {profile.name} 
              </h1>
              <span className="text-sm text-primary font-bold mt-1 uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                AKSHAYAM ID: AKSH{profile.userId ? profile.userId.slice(0, 6).toUpperCase() : 'NEW'}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100 max-w-2xl mx-auto">
              <Link href="/profile" className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white px-8 py-2.5 rounded-full font-bold flex items-center justify-center transition-all shadow-md active:scale-95 text-sm">
                {language === 'TA' ? 'சுயவிவரத்தைத் திருத்த' : 'Edit Profile'}
              </Link>
              {profile.status === 'APPROVED' && (
                <Link href="/profiles" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-2.5 rounded-full font-bold flex items-center justify-center transition-all shadow-sm hover:shadow active:scale-95 text-sm">
                  <Star className="w-4 h-4 mr-2 text-accent" /> {language === 'TA' ? 'பொருத்தமான வரன்கள்' : 'Browse Matches'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* PENDING APPROVAL BANNER */}
        {profile.status !== 'APPROVED' && (
          <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-4 mb-8 flex items-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                <strong className="text-amber-600 font-bold">{language === 'TA' ? 'நிர்வாகியின் ஒப்புதலுக்காகக் காத்திருக்கிறது:' : 'Pending Admin Approval:'}</strong> {language === 'TA' ? 'உங்கள் சுயவிவரம் நிர்வாகியின் ஒப்புதலுக்குப் பிறகு நேரலைக்கு வரும். அதன் பிறகு உங்களால் வரன்களைப் பார்வையிட முடியும்.' : 'Your profile will go live after admin approval. Once approved, you can browse matches.'}
              </p>
            </div>
          </div>
        )}

        {/* PRIVACY GUARD BANNER */}
        {(profile.hideHouseAddress || profile.hideHouseLocation || profile.hideMobileNo || profile.hidePhoto) && (
          <div className="bg-gray-800 text-gray-50 border border-gray-700 rounded-xl p-4 mb-8 flex items-center shadow-md">
            <Lock className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                <strong className="text-amber-400 font-bold">{language === 'TA' ? 'தனியுரிமை பாதுகாப்பு:' : 'Privacy Protected:'}</strong> {language === 'TA' ? 'சில தொடர்பு விவரங்கள், இருப்பிடங்கள் மற்றும் புகைப்படம் மறைக்கப்பட்டுள்ளன.' : 'Some contact details, locations and your photo are hidden from public view.'}
              </p>
            </div>
          </div>
        )}

        {/* RECOMMENDED PROFILES SECTION (VASANTHAM MATRIMONY STYLE) */}
        {matches && matches.length > 0 && (
          <div className="mb-10 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200/80">
            {/* Center Header with Golden Dashes */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
              <div className="h-1.5 w-8 sm:w-16 bg-amber-400 rounded-full"></div>
              <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 text-center tracking-tight font-serif">
                {language === 'TA' ? 'உங்கள் கனவுகளுக்கு ஏற்ற உரியவர்களை தேடுங்கள்!' : 'Search for the right partners who match your dreams!'}
              </h2>
              <div className="h-1.5 w-8 sm:w-16 bg-amber-400 rounded-full"></div>
            </div>

            {/* Subheader: Brides/Grooms on Left, View All Button on Right */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {profile.gender === 'FEMALE' 
                  ? (language === 'TA' ? 'மணமகன்கள்' : 'Grooms') 
                  : profile.gender === 'MALE' 
                    ? (language === 'TA' ? 'மணமகள்கள்' : 'Brides') 
                    : (language === 'TA' ? 'பொருத்தமான வரன்கள்' : 'Recommended Matches')}
              </h3>
              <Link 
                href="/profiles" 
                className="border border-rose-500 text-rose-600 hover:bg-rose-50 px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5"
              >
                {language === 'TA' ? 'அனைத்தையும் பார்வையிட' : 'View All'} →
              </Link>
            </div>

            {/* Horizontal Profile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.slice(0, 6).map((match) => {
                const p = match.profile;
                if (!p) return null;
                const matchAge = calculateYears(p.dob);

                const maritalDisplay = p.maritalStatus === 'NEVER_MARRIED' || p.maritalStatus === 'UNMARRIED'
                  ? (language === 'TA' ? 'முதல் மணம்' : 'Unmarried')
                  : p.maritalStatus === 'DIVORCED'
                    ? (language === 'TA' ? 'விவாகரத்தானவர்' : 'Divorced')
                    : p.maritalStatus === 'WIDOWED'
                      ? (language === 'TA' ? 'விதவை / விதவர்' : 'Widowed')
                      : p.maritalStatus?.replace('_', ' ') || (language === 'TA' ? 'முதல் மணம்' : 'Unmarried');

                return (
                  <Link 
                    key={match.id} 
                    href="/profiles"
                    className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex overflow-hidden h-36 sm:h-40 group"
                  >
                    {/* Left Photo Container */}
                    <div className="w-28 sm:w-36 h-full relative bg-gray-100 flex-shrink-0 overflow-hidden">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User className="w-12 h-12 text-gray-400 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {p.city || p.district || 'Kongu'}
                      </div>
                    </div>

                    {/* Right Details Container */}
                    <div className="p-3 sm:p-4 flex flex-col justify-center flex-1 min-w-0 bg-white">
                      <div className="flex items-center mb-2.5">
                        <span className="text-xs text-gray-500 font-medium w-16 sm:w-20 flex-shrink-0">{language === 'TA' ? 'பெயர்' : 'Name'}</span>
                        <span className="text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{p.name}</span>
                      </div>
                      <div className="flex items-center mb-2.5">
                        <span className="text-xs text-gray-500 font-medium w-16 sm:w-20 flex-shrink-0">{language === 'TA' ? 'வயது' : 'Age'}</span>
                        <span className="text-sm font-bold text-gray-800">{matchAge !== 'N/A' ? matchAge : 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 font-medium w-16 sm:w-20 flex-shrink-0">{language === 'TA' ? 'திருமண' : 'Marital'}</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-800 truncate">{maritalDisplay}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* STRUCTURED GRID FOR QUICK OVERVIEW */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                {language === 'TA' ? 'சுருக்கமான விவரம்' : 'Quick Overview'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age & Height */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <div className="bg-red-50 text-rose-600 p-2 rounded-lg mb-2">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{language === 'TA' ? 'வயது & உயரம்' : 'Age & Height'}</p>
                  <p className="text-xs font-bold text-gray-900">{age !== 'N/A' ? `${age.years}Y ${age.months}M ${age.days}D` : 'N/A'}</p>
                  <p className="text-xs font-semibold text-gray-600">{profile.height} cm</p>
                </div>

                {/* Religion & Caste */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <div className="bg-yellow-50 text-red-600 p-2 rounded-lg mb-2">
                    <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{language === 'TA' ? 'சமூகம்' : 'Community'}</p>
                  <p className="text-xs font-bold text-gray-900 line-clamp-1" title={profile.caste}>{profile.caste || 'N/A'}</p>
                  <p className="text-xs font-semibold text-gray-600 line-clamp-1">{profile.religion || 'N/A'}</p>
                </div>

                {/* Education */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg mb-2">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{language === 'TA' ? 'கல்வி' : 'Education'}</p>
                  <p className="text-xs font-bold text-gray-900 line-clamp-2">
                    {profile.educations && profile.educations.length > 0 ? profile.educations[0].degreeName : 'N/A'}
                  </p>
                </div>

                {/* Profession */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg mb-2">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{language === 'TA' ? 'தொழில்' : 'Profession'}</p>
                  <p className="text-xs font-bold text-gray-900 line-clamp-2">{family?.designation || (language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not specified')}</p>
                </div>
                
                {/* Location */}
                <div className="col-span-1 sm:col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
                  <div className="bg-yellow-50 text-yellow-500 p-2 rounded-lg mb-2">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{language === 'TA' ? 'தற்போதைய இருப்பிடம்' : 'Current Location'}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {profile.hideHouseLocation ? (
                      <span className="flex items-center justify-center text-gray-500"><Lock className="w-3 h-3 mr-1" /> {language === 'TA' ? 'பாதுகாக்கப்பட்ட இருப்பிடம்' : 'Protected Location'}</span>
                    ) : (
                      `${profile.city}, ${profile.state}, ${profile.livingCountry}`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* PERSONAL & PHYSICAL ATTRIBUTES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{language === 'TA' ? 'தனிப்பட்ட விவரங்கள்' : 'Personal Details'}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'பிறந்த தேதி' : 'Date of Birth'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'உடல் அமைப்பு' : 'Physical Condition'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.physicalCondition || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'எடை' : 'Weight'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.weight ? `${profile.weight} kg` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'நிறம்' : 'Complexion'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.skinColour || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'உட்பிரிவு' : 'Sub Caste'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.subCaste || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* LIFESTYLE & HABITS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{language === 'TA' ? 'பழக்கவழக்கங்கள்' : 'Lifestyle'}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'உணவு பழக்கம்' : 'Food Habits'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.foodHabits || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'மதுப் பழக்கம்' : 'Drinking Habits'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.drinkingHabits || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'புகைப்பிடிக்கும் பழக்கம்' : 'Smoking Habits'}</span>
                  <span className="text-sm font-bold text-gray-900">{profile.smokingHabits || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Contact Information (If Approved) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{language === 'TA' ? 'தொடர்பு விவரங்கள்' : 'Contact Details'}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'அலைபேசி எண்' : 'Mobile No.'}</span>
                  <span className="text-sm font-bold text-gray-900 flex items-center">
                    {profile.hideMobileNo && <span title="Hidden from public" className="inline-flex items-center mr-1.5"><Lock className="w-3 h-3 text-amber-500" /></span>}
                    {user.mobile_no || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-gray-500">{language === 'TA' ? 'பெற்றோர் அலைபேசி' : 'Parents Mobile'}</span>
                  <span className="text-sm font-bold text-gray-900 flex items-center">
                    {profile.hideMobileNo && <span title="Hidden from public" className="inline-flex items-center mr-1.5"><Lock className="w-3 h-3 text-amber-500" /></span>}
                    {family?.fatherMobile || family?.motherMobile || 'N/A'}
                  </span>
                </div>
                <div className="py-2">
                  <span className="text-sm font-semibold text-gray-500 block mb-1">{language === 'TA' ? 'வீட்டு முகவரி' : 'House Address'}</span>
                  <p className="text-sm font-bold text-gray-900 flex items-start">
                    {profile.hideHouseAddress && <span title="Hidden from public" className="inline-flex items-center mt-1 mr-1.5 flex-shrink-0"><Lock className="w-3 h-3 text-amber-500" /></span>}
                    <span>{profile.houseAddress || (language === 'TA' ? 'முகவரி வழங்கப்படவில்லை' : 'Address not provided')}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* ABOUT ME HIGHLIGHT BOX */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/80">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-primary" /> {language === 'TA' ? `${profile.name} பற்றி` : `About ${profile.name}`}
              </h2>
              <div className="bg-gray-50/70 border-l-4 border-primary p-5 rounded-r-xl">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base font-medium italic">
                  "I am {profile.name}, currently residing in {profile.city}, {profile.state}. I have completed my {profile.educations && profile.educations.length > 0 ? profile.educations[0].degreeName : 'education'} and am working as a {family?.designation || 'professional'}."
                </p>
              </div>
            </div>

            {/* EDUCATION & CAREER */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center border-b border-gray-100 pb-3">
                <GraduationCap className="w-6 h-6 mr-2 text-blue-500" /> {language === 'TA' ? 'கல்வி மற்றும் தொழில்' : 'Education & Career'}
              </h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'கல்வி விவரங்கள்' : 'Education Details'}</h4>
                  {profile.educations && profile.educations.length > 0 ? (
                    <div className="space-y-3">
                      {profile.educations.map((edu: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{edu.degreeName}</p>
                            <p className="text-xs font-semibold text-gray-500">{edu.institution}</p>
                          </div>
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 w-fit">{edu.level}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">{language === 'TA' ? 'கல்வி விவரங்கள் இல்லை' : 'No education details provided.'}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'தொழில் விவரங்கள்' : 'Career Details'}</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-1">{language === 'TA' ? 'பணி நிலை' : 'Work Nature'}</p>
                      <p className="text-sm font-bold text-gray-900">{family?.workNature || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-1">{language === 'TA' ? 'பதவி' : 'Designation'}</p>
                      <p className="text-sm font-bold text-gray-900">{family?.designation || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-1">{language === 'TA' ? 'நிறுவனம்' : 'Organization'}</p>
                      <p className="text-sm font-bold text-gray-900">{family?.organisation || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-1">{language === 'TA' ? 'மாத வருமானம்' : 'Monthly Salary'}</p>
                      <p className="text-sm font-bold text-gray-900">{family?.salary || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 sm:col-span-2">
                      <p className="text-xs text-gray-500 font-semibold mb-1">{language === 'TA' ? 'பணிபுரியும் இடம்' : 'Working Location'}</p>
                      <p className="text-sm font-bold text-gray-900">{family?.workingAddress || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ASTROLOGY DETAILS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 border-b border-gray-100 pb-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" /> {language === 'TA' ? 'ஜாதக விவரங்கள்' : 'Astrological Details'}
                </h2>
                {profile.jathakamUrl && (
                  <a href={profile.jathakamUrl} target="_blank" rel="noreferrer" className="mt-3 sm:mt-0 bg-yellow-50 text-primary hover:bg-amber-100 px-4 py-2 rounded-lg font-bold text-xs flex items-center transition-colors">
                    <Download className="w-4 h-4 mr-1.5" /> {language === 'TA' ? 'ஜாதக PDF பார்க்க' : 'View Jathakam PDF'}
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'ராசி' : 'Rasi (Moon Sign)'}</p>
                  <p className="text-sm font-bold text-gray-900">{translateRasi(profile.rasi, language)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'நட்சத்திரம்' : 'Nakshatra (Star)'}</p>
                  <p className="text-sm font-bold text-gray-900">{translateNakshatra(profile.nakshatra, language)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'தோஷம்' : 'Dosham'}</p>
                  <p className="text-sm font-bold text-gray-900">{profile.dosham === 'None' ? (language === 'TA' ? 'தோஷம் இல்லை' : 'No Dosham') : (profile.dosham || (language === 'TA' ? 'தோஷம் இல்லை' : 'No Dosham'))}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'கூட்டம்' : 'Koottam'}</p>
                  <p className="text-sm font-bold text-gray-900">{profile.koottam || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'பிறந்த நேரம்' : 'Time of Birth'}</p>
                  <p className="text-sm font-bold text-gray-900">{profile.tob || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'பிறந்த இடம்' : 'Place of Birth'}</p>
                  <p className="text-sm font-bold text-gray-900">{profile.lob || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 sm:col-span-2">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'தசா இருப்பு' : 'Dasa Balance'}</p>
                  <p className="text-sm font-bold text-gray-900">{profile.dasaBalance || 'N/A'}</p>
                </div>
                {profile.poruthaNakshatram && profile.poruthaNakshatram.length > 0 && (
                  <div className="col-span-2 md:col-span-4 bg-background p-3.5 rounded-xl border border-primary/20 mt-1">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1.5">
                      ✨ {language === 'TA' ? 'பொருத்தமான நட்சத்திரங்கள்' : 'Matching Nakshatras'} ({profile.poruthaNakshatram.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.poruthaNakshatram.map((n: string) => (
                        <span key={n} className="bg-primary text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs">
                          {translateNakshatra(n, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAMILY & FINANCIALS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center border-b border-gray-100 pb-3">
                <Users className="w-6 h-6 mr-2 text-yellow-500" /> {language === 'TA' ? 'குடும்பம் மற்றும் சொத்துக்கள்' : 'Family & Financials'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'பெற்றோர் விவரங்கள்' : 'Parents Details'}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">{language === 'TA' ? 'தந்தை' : 'Father'}</p>
                        <p className="text-sm font-bold text-gray-900">{family?.fatherName || (language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not Specified')}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border shadow-sm">{family?.fatherStatus || (family?.fatherLivingStatus === 'ALIVE' ? (language === 'TA' ? 'உயிருடன்' : 'Alive') : (language === 'TA' ? 'காலமானார்' : 'Late'))}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">{language === 'TA' ? 'தாய்' : 'Mother'}</p>
                        <p className="text-sm font-bold text-gray-900">{family?.motherName || (language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not Specified')}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border shadow-sm">{family?.motherStatus || (family?.motherLivingStatus === 'ALIVE' ? (language === 'TA' ? 'உயிருடன்' : 'Alive') : (language === 'TA' ? 'காலமானார்' : 'Late'))}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'உடன்பிறந்தவர்கள்' : 'Siblings'}</h4>
                  {family?.siblings && family.siblings.length > 0 ? (
                    <div className="space-y-2">
                      {family.siblings.map((sib: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-900">{sib.name} <span className="text-xs text-gray-500 font-normal">({sib.relation})</span></span>
                          <span className="text-[10px] bg-white border px-2 py-0.5 rounded font-bold text-gray-600">{sib.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-full flex flex-col justify-center">
                      <p className="text-center font-bold text-gray-900 text-lg">0</p>
                      <p className="text-center text-xs text-gray-500 font-semibold">{language === 'TA' ? 'உடன்பிறந்தவர்கள் இல்லை' : 'No Siblings'}</p>
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'சொத்துக்கள் விவரம்' : 'Assets & Properties'}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-gray-100 p-3 rounded-xl shadow-sm text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'வீடு' : 'House'}</p>
                  <p className="text-sm font-bold text-gray-900">{family?.houseType || 'N/A'}</p>
                </div>
                <div className="border border-gray-100 p-3 rounded-xl shadow-sm text-center bg-emerald-50/50">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'தோட்டம்' : 'Farm / Thottam'}</p>
                  <p className="text-sm font-bold text-gray-900">{family?.thottam || (language === 'TA' ? 'இல்லை' : 'None')}</p>
                </div>
                <div className="border border-gray-100 p-3 rounded-xl shadow-sm text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'காலி இடம்' : 'Vacant Land'}</p>
                  <p className="text-sm font-bold text-gray-900">{family?.vacantLand || (language === 'TA' ? 'இல்லை' : 'None')}</p>
                </div>
                <div className="border border-gray-100 p-3 rounded-xl shadow-sm text-center bg-blue-50/50">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'மொத்த மதிப்பு' : 'Total Value'}</p>
                  <p className="text-sm font-bold text-gray-900">{family?.totalAssetValue || (language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Undisclosed')}</p>
                </div>
              </div>

              {/* DOWRY & RENTAL INCOME */}
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{language === 'TA' ? 'வரதட்சணை விவரங்கள்' : 'Dowry Details'}</span>
                  <span className="text-sm font-bold text-gray-900">{family?.dowryDetails || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{language === 'TA' ? 'வாடகை வருமானம்' : 'Rental Income'}</span>
                  <span className="text-sm font-bold text-gray-900">{family?.rentalIncome || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* PARTNER EXPECTATIONS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center border-b border-gray-100 pb-3">
                <Heart className="w-6 h-6 mr-2 text-red-500" /> {language === 'TA' ? 'எதிர்பார்ப்புகள்' : 'Partner Expectations'}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{language === 'TA' ? 'அடிப்படை தகுதிகள்' : 'Basic Criteria'}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> {language === 'TA' ? 'வயது வரம்பு:' : 'Age up to'} <strong className="ml-1 text-gray-900">{expectations?.maxAgeLimit || 'N/A'} {language === 'TA' ? 'வயது' : 'Yrs'}</strong></li>
                      <li className="flex items-center text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> {language === 'TA' ? 'எதிர்பார்க்கும் உயரம்:' : 'Height around'} <strong className="ml-1 text-gray-900">{expectations?.expectedHeight || 'N/A'} cm</strong></li>
                      <li className="flex items-center text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> {language === 'TA' ? 'வருமானம்:' : 'Income:'} <strong className="ml-1 text-gray-900">{expectations?.expectedIncome || (language === 'TA' ? 'எதுவும்' : 'Any')}</strong></li>
                      <li className="flex items-center text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> {language === 'TA' ? 'வாடகை வருமானம்:' : 'Rental Income Exp:'} <strong className="ml-1 text-gray-900">{expectations?.expectsRentalIncome ? 'Yes' : 'No'}</strong></li>
                      <li className="flex items-center text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> {language === 'TA' ? 'தோட்டம் எதிர்பார்ப்பு:' : 'Thottam Exp:'} <strong className="ml-1 text-gray-900">{expectations?.expectsThottam ? 'Yes' : 'No'}</strong></li>
                      <li className="flex items-center text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> {language === 'TA' ? 'வரதட்சணை எதிர்பார்ப்பு:' : 'Dowry Exp:'} <strong className="ml-1 text-gray-900">{expectations?.dowryExpectation || 'N/A'}</strong></li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {language === 'TA' ? 'விருப்பமான துறைகள்' : 'Preferred Sectors'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {expectations?.preferredSectors?.length ? expectations.preferredSectors.map((s: string, i: number) => (
                        <span key={i} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold shadow-sm">{s}</span>
                      )) : <span className="text-sm text-gray-500 italic">{language === 'TA' ? 'குறிப்பிட்ட விருப்பம் இல்லை' : 'No specific preference'}</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {language === 'TA' ? 'விருப்பமான இடங்கள்' : 'Preferred Locations'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {expectations?.preferredLocations?.length ? expectations.preferredLocations.map((l: string, i: number) => (
                        <span key={i} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold shadow-sm">{l}</span>
                      )) : <span className="text-sm text-gray-500 italic">{language === 'TA' ? 'எந்த இடமும் சம்மதம்' : 'Open to any location'}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {expectations?.comments && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">{language === 'TA' ? 'கூடுதல் எதிர்பார்ப்புகள்' : 'Additional Expectations'}</span>
                  <p className="text-sm font-medium text-gray-800 italic">"{expectations.comments}"</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

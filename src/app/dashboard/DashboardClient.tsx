'use client';

import { useState } from 'react';
import { 
  User, MapPin, Briefcase, GraduationCap, Heart, 
  Calendar, Activity, Users, MessageCircle, Star, ShieldCheck, Download, Lock, LogOut, X, Share2, Settings
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { logoutUser } from '@/backend/actions/auth';
import { shareToWhatsApp } from '@/lib/shareProfile';
import { downloadBioDataPdf, printBioDataPdf } from '@/lib/generatePdf';
import ProfileCarousel from '@/frontend/components/home/ProfileCarousel';

export default function DashboardClient({ 
  user, 
  matches = [], 
  recentProfiles = [], 
  shortlistedProfiles = [] 
}: { 
  user: any; 
  matches?: any[];
  recentProfiles?: any[];
  shortlistedProfiles?: any[];
}) {
  const { language, toggleLanguage } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const isApproved = String(user.status) === 'ACTIVE' || String(user.status) === 'APPROVED';
  const isPending = String(user.status) === 'PENDING';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 font-sans selection:bg-emerald-200">
      
      {/* GLOBAL NAVBAR WITH COMPACT WIDGET */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 px-4 sm:px-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <img src="/akshayam_logo.png" alt="Akshayam Logo" className="h-8 sm:h-10 object-contain" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => shareToWhatsApp(profile.id, profile)}
            className="hidden sm:flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border border-green-200"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'TA' ? 'பகிர்வு' : 'Share'}</span>
          </button>
          
          <Link
            href="/profile"
            className="hidden sm:flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Avatar Widget */}
          <div 
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full ring-2 ring-emerald-600 bg-gray-100 flex items-center justify-center cursor-pointer hover:ring-offset-2 transition-all overflow-hidden"
          >
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover object-top" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
      </header>

      {/* RIGHT-SIDE SLIDE-OVER DRAWER (MY PROFILE) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-xl font-bold text-gray-900">{language === 'TA' ? 'என் சுயவிவரம்' : 'My Profile'}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 pb-20 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full ring-4 ring-gray-50 overflow-hidden mb-3">
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center"><User className="w-10 h-10 text-gray-400" /></div>
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">{profile.name}</h3>
                <p className="text-primary font-bold text-sm mt-1">{user?.userid || profile.id.slice(0, 8).toUpperCase()}</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Link href="/profile" className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full">{language === 'TA' ? 'திருத்து' : 'Edit'}</Link>
                  <button onClick={() => downloadBioDataPdf(`pdf-template-${profile.id}`, profile.id)} className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full">{language === 'TA' ? 'PDF' : 'PDF'}</button>
                  <button onClick={async () => { await logoutUser(); window.location.href = '/'; }} className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full flex items-center gap-1"><LogOut className="w-3 h-3"/> Logout</button>
                </div>
              </div>

              {/* Status Box */}
              {!isApproved && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800">
                    {isPending 
                      ? (language === 'TA' ? 'நிர்வாகியின் ஒப்புதலுக்காக காத்திருக்கிறது' : 'Waiting for admin approval')
                      : (language === 'TA' ? 'சுயவிவரம் இன்னும் சரிபார்க்கப்படவில்லை' : 'Profile not yet verified')}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {isPending 
                      ? (language === 'TA' 
                          ? 'உங்கள் கட்டண விவரங்கள் நிர்வாகியால் சரிபார்க்கப்படும் வரை காத்திருக்கவும். எங்களை தொடர்புகொள்ள: 9566466079.' 
                          : 'Please wait while an admin verifies your payment details. Contact us at: 9566466079.')
                      : (language === 'TA' 
                          ? 'நிர்வாகி சரிபார்த்த பின் உங்கள் சுயவிவரம் மற்றவர்களுக்குத் தெரியும்.' 
                          : 'Your profile will be visible to others once verified by an admin.')}
                  </p>
                </div>
              )}

              {/* Basic Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'சுருக்கமான விவரம்' : 'Quick Overview'}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Age & Height</span><span className="font-bold">{age !== 'N/A' ? `${age.years} Yrs` : 'N/A'} • {profile.height}cm</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Community</span><span className="font-bold">{profile.religion} • {profile.caste}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Education</span><span className="font-bold">{profile.educations?.[0]?.degreeName || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Profession</span><span className="font-bold">{family?.designation || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-bold">{profile.city}, {profile.state}</span></div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{language === 'TA' ? 'தொடர்பு விவரங்கள்' : 'Contact Details'}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Mobile</span><span className="font-bold">{user.mobile_no || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Parents</span><span className="font-bold">{family?.fatherMobile || family?.motherMobile || 'N/A'}</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MAIN CAROUSEL CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* CAROUSEL 1: MATCHING PROFILES */}
        <section>
          <ProfileCarousel 
            profiles={matches} 
            title={language === 'TA' ? 'பொருத்தமான வரன்கள்' : 'Recommended Matches'} 
          />
        </section>

        {/* CAROUSEL 2: SHORTLISTED PROFILES */}
        <section>
          <ProfileCarousel 
            profiles={shortlistedProfiles} 
            title={language === 'TA' ? 'தேர்ந்தெடுக்கப்பட்ட வரன்கள்' : 'Shortlisted Profiles'} 
          />
        </section>
        
        {/* Empty States Handling */}
        {matches.length === 0 && recentProfiles.length === 0 && shortlistedProfiles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{language === 'TA' ? 'வரன்கள் கிடைக்கவில்லை' : 'No Profiles Found'}</h3>
            <p className="text-gray-500">{language === 'TA' ? 'உங்கள் தேடலுக்கு ஏற்ற வரன்கள் தற்போது இல்லை.' : 'We could not find any profiles matching your criteria right now.'}</p>
          </div>
        )}

      </main>
      
      {/* CSS Animation for Drawer */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}

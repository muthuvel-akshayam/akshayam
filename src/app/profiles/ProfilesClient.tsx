'use client';

import { useState } from 'react';
import { User, MapPin, Briefcase, GraduationCap, Phone, Shield, Lock, CheckCircle, Clock, Star, ArrowRightCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/frontend/context/LanguageContext';
import { translateRasi, translateNakshatra } from '@/frontend/utils/astrology';
import { logoutUser } from '@/backend/actions/auth';

export default function ProfilesClient({ profiles }: { profiles: any[] }) {
  const { language, toggleLanguage } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const calculateAge = (dob: Date | string | null | undefined) => {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return 'N/A';
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return years;
  };

  return (
    <div className="min-h-screen bg-background pb-12 font-sans selection:bg-rose-200">
      
      {/* GLOBAL NAVBAR WITH LANGUAGE TOGGLE */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/15 py-3 px-6 shadow-sm mb-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-primary-light transition-all shadow">
              ← {language === 'TA' ? 'முகப்பு' : 'Home'}
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full font-bold text-xs transition-all border border-gray-200">
              {language === 'TA' ? 'என் சுயவிவரம்' : 'My Dashboard'}
            </Link>
          </div>
          <div className="text-center font-bold text-primary text-base md:text-lg hidden sm:block">
            {language === 'TA' ? 'பொருத்தமான வரன்கள்' : 'Browse Matches'}
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
            <button
              onClick={toggleLanguage}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-primary focus:outline-none transition-colors shadow-inner"
              title="Translate English/Tamil"
            >
              <span className="absolute left-2 text-[10px] font-bold text-white z-0">EN</span>
              <span className="absolute right-2 text-[10px] font-bold text-white z-0">TA</span>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md z-10 ${language === 'TA' ? 'translate-x-9' : 'translate-x-1'}`}></span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vasantham Matrimony Banner Style */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          <div className="h-1.5 w-8 sm:w-16 bg-amber-400 rounded-full"></div>
          <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 text-center tracking-tight font-serif">
            {language === 'TA' ? 'உங்கள் கனவுகளுக்கு ஏற்ற உரியவர்களை தேடுங்கள்!' : 'Search for the right partners who match your dreams!'}
          </h2>
          <div className="h-1.5 w-8 sm:w-16 bg-amber-400 rounded-full"></div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 pb-3 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {language === 'TA' ? 'பொருத்தமான வரன்கள்' : 'Recommended Matches'}
          </h3>
          <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
            {profiles.length} {language === 'TA' ? 'வரன்கள்' : 'Profiles'}
          </span>
        </div>

        {/* Profiles List */}
        <div className="flex flex-col gap-5 mt-6">
          {profiles.map((match) => {
            const { profile, family, receivedRequests, sentRequests } = match;
            if (!profile) return null;

            const sentRequest = receivedRequests?.[0]; 
            const receivedRequest = sentRequests?.[0]; 

            const isApproved = sentRequest?.status === 'ACCEPTED' || receivedRequest?.status === 'ACCEPTED';
            const isPending = sentRequest?.status === 'PENDING';
            const theyArePending = receivedRequest?.status === 'PENDING';
            const age = calculateAge(profile.dob);

            return (
              <div key={match.id} className="bg-white rounded-xl shadow-[0px_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 flex flex-col md:flex-row overflow-hidden w-full transition-all hover:shadow-md">
                
                {/* Image Section */}
                <Link href={`/profiles/${match.id}`} className="w-full md:w-48 h-56 md:h-auto relative overflow-hidden flex-shrink-0 cursor-pointer block group">
                  {(!profile.hidePhoto || isApproved) && profile.photoUrl ? (
                    <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 transition-colors duration-300 group-hover:bg-gray-100">
                      <User className="w-16 h-16 text-gray-300 mb-2 transition-transform duration-500 group-hover:scale-110" />
                      {profile.hidePhoto && !isApproved && <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-white rounded shadow-sm border border-gray-100">{language === 'TA' ? 'புகைப்படம் பாதுகாக்கப்பட்டுள்ளது' : 'Photo Protected'}</span>}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-gray-800 border border-gray-200 shadow-sm">
                    ID: {match.id.substring(0,8).toUpperCase()}
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-5 md:p-6 flex flex-col justify-between w-full">
                  
                  <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-sm">
                    <div className="col-span-1 text-gray-500 font-bold">{language === 'TA' ? 'பெயர்' : 'Name'}</div>
                    <div className="col-span-2 text-gray-900 font-bold text-lg leading-tight">{profile.name}</div>

                    <div className="col-span-1 text-gray-500 font-medium">{language === 'TA' ? 'வயது & உயரம்' : 'Age & Height'}</div>
                    <div className="col-span-2 text-gray-800 font-semibold">{age !== 'N/A' ? `${age} ${language === 'TA' ? 'வயது' : 'Years'}` : 'N/A'} • {profile.height} cm</div>

                    <div className="col-span-1 text-gray-500 font-medium">{language === 'TA' ? 'ராசி & நட்சத்திரம்' : 'Rasi & Star'}</div>
                    <div className="col-span-2 text-gray-800 font-semibold">
                      <span className="bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-0.5 rounded font-bold inline-block shadow-2xs">
                        {translateRasi(profile.rasi, language)} • {translateNakshatra(profile.nakshatra, language)}
                      </span>
                      {profile.poruthaNakshatram && profile.poruthaNakshatram.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="text-[10px] font-bold text-primary self-center mr-1">✨ {language === 'TA' ? 'பொருத்தம்:' : 'Match:'}</span>
                          {profile.poruthaNakshatram.slice(0, 3).map((n: string) => (
                            <span key={n} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold border border-primary/20">
                              {translateNakshatra(n, language)}
                            </span>
                          ))}
                          {profile.poruthaNakshatram.length > 3 && (
                            <span className="text-[10px] font-bold text-gray-500 self-center">+{profile.poruthaNakshatram.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-span-1 text-gray-500 font-medium">{language === 'TA' ? 'திருமண நிலை' : 'Marital Status'}</div>
                    <div className="col-span-2 text-gray-800 font-semibold">{profile.maritalStatus === 'NEVER_MARRIED' ? (language === 'TA' ? 'திருமணம் ஆகாதவர்' : 'Never Married') : profile.maritalStatus.replace('_', ' ')}</div>

                    <div className="col-span-1 text-gray-500 font-medium">{language === 'TA' ? 'சமூகம்' : 'Community'}</div>
                    <div className="col-span-2 text-gray-800 font-semibold">{profile.caste || 'N/A'} {profile.subCaste ? `(${profile.subCaste})` : ''}</div>

                    <div className="col-span-1 text-gray-500 font-medium">{language === 'TA' ? 'கல்வி' : 'Education'}</div>
                    <div className="col-span-2 text-gray-800 font-semibold line-clamp-1">{profile.educations?.[0]?.degreeName || (language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not Specified')}</div>

                    <div className="col-span-1 text-gray-500 font-medium">{language === 'TA' ? 'இருப்பிடம்' : 'Location'}</div>
                    <div className="col-span-2 text-gray-800 font-semibold flex items-center">
                      {(profile.hideHouseLocation && !isApproved) ? (language === 'TA' ? 'பாதுகாக்கப்பட்ட இருப்பிடம்' : 'Protected Location') : `${profile.city}, ${profile.state}`}
                      {profile.hideHouseLocation && !isApproved && <Lock className="w-3 h-3 ml-1.5 text-yellow-500 inline" />}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
                    <Link href={`/profiles/${match.id}`} className="h-[40px] px-6 py-2.5 bg-gray-100 rounded-full border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm">
                      {language === 'TA' ? 'முழு விவரம்' : 'View Profile'}
                    </Link>

                    {isApproved ? (
                      <span className="text-green-600 font-bold text-sm flex items-center bg-green-50 px-4 py-2 rounded-full border border-green-200 h-[40px]">
                        <CheckCircle className="w-4 h-4 mr-2" /> {language === 'TA' ? 'விருப்பம் ஏற்கப்பட்டது' : 'Request Approved'}
                      </span>
                    ) : isPending ? (
                      <span className="text-yellow-600 font-bold text-sm flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200 h-[40px]">
                        <Clock className="w-4 h-4 mr-2" /> {language === 'TA' ? 'நிலுவையில் உள்ளது' : 'Pending'}
                      </span>
                    ) : theyArePending ? (
                      <span className="text-gray-600 font-bold text-sm flex items-center bg-gray-100 px-4 py-2 rounded-full border border-gray-200 h-[40px]">
                        <Clock className="w-4 h-4 mr-2" /> {language === 'TA' ? 'அவர்கள் விருப்பம்' : 'They Requested'}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {profiles.length === 0 && (
            <div className="py-20 text-center bg-white rounded-xl border border-gray-200 mt-4">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{language === 'TA' ? 'வரன்கள் எதுவும் இல்லை' : 'No profiles found'}</h3>
              <p className="text-gray-500">{language === 'TA' ? 'பின்னர் மீண்டும் பார்க்கவும்.' : 'Check back later for new members.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

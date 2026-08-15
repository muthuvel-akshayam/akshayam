'use client';

import { useState } from 'react';
import { User, MapPin, Briefcase, GraduationCap, Phone, Shield, Lock, CheckCircle, Clock, Star, ArrowRightCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { translateRasi, translateNakshatra } from '@/frontend/utils/astrology';
import { logoutUser } from '@/backend/actions/auth';
import { toggleShortlist } from '@/backend/actions/shortlist';
import { requestContact } from '@/backend/actions/matches';
import { Heart, Download, Share2 } from 'lucide-react';
import JathagamPDFTemplate from '@/frontend/components/pdf/JathagamPDFTemplate';
import { downloadBioDataPdf } from '@/lib/generatePdf';
import { shareProfile, shareToWhatsApp } from '@/lib/shareProfile';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default function ProfilesClient({ profiles, initialShortlists = [], initialSentInterests = [], activeTab = 'matches' }: { profiles: any[], initialShortlists?: string[], initialSentInterests?: string[], activeTab?: string }) {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [shortlists, setShortlists] = useState<Set<string>>(new Set(initialShortlists));
  const [sentInterests, setSentInterests] = useState<Set<string>>(new Set(initialSentInterests));

  const handleShortlist = async (targetId: string) => {
    setLoadingId(`shortlist-${targetId}`);
    const res = await toggleShortlist(targetId);
    if (res.success) {
      const newSet = new Set(shortlists);
      if (res.action === 'added') newSet.add(targetId);
      else newSet.delete(targetId);
      setShortlists(newSet);
    }
    setLoadingId(null);
  };

  const handleSendInterest = async (targetId: string) => {
    setLoadingId(`interest-${targetId}`);
    const res = await requestContact(targetId);
    if (res && res.success !== false) {
      const newSet = new Set(sentInterests);
      newSet.add(targetId);
      setSentInterests(newSet);
    }
    setLoadingId(null);
  };

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vasantham Matrimony Banner Style */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          <div className="h-1.5 w-8 sm:w-16 bg-amber-400 rounded-full"></div>
          <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 text-center tracking-tight font-serif">
            {language === 'TA' ? 'உங்கள் கனவுகளுக்கு ஏற்ற உரியவர்களை தேடுங்கள்!' : 'Search for the right partners who match your dreams!'}
          </h2>
          <div className="h-1.5 w-8 sm:w-16 bg-amber-400 rounded-full"></div>
        </div>

        <div className="mb-6 flex flex-col items-center gap-4 border-b border-gray-200 pb-2">
          <div className="flex w-full overflow-x-auto no-scrollbar gap-2 sm:gap-6 bg-gray-50/50 p-1.5 rounded-xl border border-gray-100">
            <button 
              onClick={() => { router.push('/profiles?tab=matches'); router.refresh(); }} 
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'matches' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              {language === 'TA' ? 'பொருத்தங்கள்' : 'All Matches'}
            </button>
            <button 
              onClick={() => { router.push('/profiles?tab=received'); router.refresh(); }} 
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'received' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              {language === 'TA' ? 'விருப்பங்கள்' : 'Interests Received'}
            </button>
            <button 
              onClick={() => { router.push('/profiles?tab=shortlisted'); router.refresh(); }} 
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'shortlisted' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              {language === 'TA' ? 'ஷார்ட்லிஸ்ட்' : 'My Shortlists'}
            </button>
          </div>
          
          <div className="w-full flex justify-between items-center px-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {activeTab === 'matches' ? (language === 'TA' ? 'பொருத்தமான வரன்கள்' : 'Recommended Matches') : ''}
              {activeTab === 'received' ? (language === 'TA' ? 'உங்களுக்கு வந்த விருப்பங்கள்' : 'Interests Received') : ''}
              {activeTab === 'shortlisted' ? (language === 'TA' ? 'நீங்கள் ஷார்ட்லிஸ்ட் செய்தவை' : 'Your Shortlisted Profiles') : ''}
            </h3>
            <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
              {profiles.length} {language === 'TA' ? 'வரன்கள்' : 'Profiles'}
            </span>
          </div>
        </div>

        {/* Profiles List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
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
              <div key={match.id} className="bg-white rounded-xl shadow-[0px_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 flex flex-col overflow-hidden w-full transition-all hover:shadow-md">
                
                {/* Image Section */}
                <Link href={`/profiles/${match.id}`} className="w-full aspect-[4/5] relative overflow-hidden flex-shrink-0 cursor-pointer block group">
                  {(!profile.hidePhoto || isApproved) && profile.photoUrl ? (
                    <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover object-top bg-gray-50 transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 transition-colors duration-300 group-hover:bg-gray-100">
                      <User className="w-16 h-16 text-gray-300 mb-2 transition-transform duration-500 group-hover:scale-110" />
                      {profile.hidePhoto && !isApproved && <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-white rounded shadow-sm border border-gray-100">{language === 'TA' ? 'புகைப்படம் பாதுகாக்கப்பட்டுள்ளது' : 'Photo Protected'}</span>}
                    </div>
                  )}
                </Link>

                {/* Content Section */}
                <div className="p-4 flex flex-col items-center w-full">
                  
                  <div className="text-gray-900 font-bold text-lg md:text-xl leading-tight text-center">{profile.name}</div>
                  <div className="text-green-600 font-bold text-base mt-0.5 mb-3 text-center">
                    {(match as any).userid || (match.userIndex ? `${1000 + match.userIndex}` : `${match.id.substring(0, 6).toUpperCase()}`)}
                  </div>

                  <div className="flex flex-col items-center text-sm text-gray-600 space-y-1 mb-5">
                    <div>{language === 'TA' ? 'வயது' : 'Age'} : <span className="font-semibold text-gray-800">{age !== 'N/A' ? age : 'N/A'}</span></div>
                    <div>{language === 'TA' ? 'படிப்பு' : 'Education'} : <span className="font-semibold text-gray-800">{profile.educations?.[0]?.degreeName || (language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not Specified')}</span></div>
                    <div>{language === 'TA' ? 'இராசி' : 'Rasi'} : <span className="font-semibold text-gray-800">{translateRasi(profile.rasi, language)}-{translateNakshatra(profile.nakshatra, language)}</span></div>
                    <div>{language === 'TA' ? 'ஜாதகம்' : 'Jathakam'} : <span className="font-semibold text-gray-800">{profile.dosham === 'NO' ? (language === 'TA' ? 'சுத்த ஜாதகம்' : 'No Dosham') : (language === 'TA' ? 'தோஷம் உண்டு' : 'Dosham')}</span></div>
                    <div className="flex items-center justify-center">
                      {language === 'TA' ? 'ஊர்' : 'Location'} : <span className="font-semibold text-gray-800 ml-1">{(profile.hideHouseLocation && !isApproved) ? (language === 'TA' ? 'பாதுகாக்கப்பட்டது' : 'Protected') : profile.city}</span>
                      {profile.hideHouseLocation && !isApproved && <Lock className="w-3 h-3 ml-1 text-yellow-500 inline" />}
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-3 w-full">
                      <button
                        onClick={() => shareToWhatsApp(match.id)}
                        className="w-10 h-[40px] rounded-full border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors shadow-sm"
                        title={language === 'TA' ? 'வாட்ஸ்அப்பில் பகிர' : 'Share on WhatsApp'}
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareProfile(match.id, profile.name)}
                        className="w-10 h-[40px] rounded-full border border-gray-200 text-gray-500 hover:text-primary hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
                        title={language === 'TA' ? 'பகிர' : 'Share'}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadBioDataPdf(`pdf-template-${match.id}`, match.id)}
                        className="w-10 h-[40px] rounded-full border border-gray-200 text-gray-500 hover:text-primary hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
                        title={language === 'TA' ? 'பதிவிறக்கு' : 'Download'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleShortlist(match.id)} 
                        disabled={loadingId === `shortlist-${match.id}`} 
                        className={`h-[40px] w-[40px] rounded-full border flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 ${shortlists.has(match.id) ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'}`}
                        title={language === 'TA' ? 'ஷார்ட்லிஸ்ட்' : 'Shortlist'}
                      >
                        {loadingId === `shortlist-${match.id}` ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Heart className={`w-4 h-4 ${shortlists.has(match.id) ? 'fill-current text-primary' : ''}`} />
                        )}
                      </button>
                    </div>

                    {/* Main Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
                      <Link href={`/profiles/${match.id}`} className="w-full sm:flex-1 h-[40px] px-6 py-2.5 bg-gray-100 rounded-full border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm">
                        {language === 'TA' ? 'முழு விவரம்' : 'View Profile'}
                      </Link>

                      {!isApproved && !isPending && !theyArePending && (
                        <button 
                          onClick={() => handleSendInterest(match.id)} 
                          disabled={loadingId === `interest-${match.id}` || sentInterests.has(match.id)} 
                          className="w-full sm:flex-1 h-[40px] px-6 py-2.5 bg-primary rounded-full text-white font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                        >
                          {loadingId === `interest-${match.id}` ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : sentInterests.has(match.id) ? (
                            language === 'TA' ? 'விருப்பம் அனுப்பப்பட்டது' : 'Interest Sent'
                          ) : (
                            language === 'TA' ? 'விருப்பம் அனுப்பு' : 'Send Interest'
                          )}
                        </button>
                      )}

                      {isApproved ? (
                        <span className="w-full sm:flex-1 text-green-600 font-bold text-sm flex items-center justify-center bg-green-50 px-4 py-2 rounded-full border border-green-200 h-[40px]">
                          <CheckCircle className="w-4 h-4 mr-2" /> {language === 'TA' ? 'விருப்பம் ஏற்கப்பட்டது' : 'Request Approved'}
                        </span>
                      ) : isPending ? (
                        <span className="w-full sm:flex-1 text-yellow-600 font-bold text-sm flex items-center justify-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200 h-[40px]">
                          <Clock className="w-4 h-4 mr-2" /> {language === 'TA' ? 'நிலுவையில் உள்ளது' : 'Pending'}
                        </span>
                      ) : theyArePending ? (
                        <span className="w-full sm:flex-1 text-gray-600 font-bold text-sm flex items-center justify-center bg-gray-100 px-4 py-2 rounded-full border border-gray-200 h-[40px]">
                          <Clock className="w-4 h-4 mr-2" /> {language === 'TA' ? 'அவர்கள் விருப்பம்' : 'They Requested'}
                        </span>
                      ) : null}
                    </div>
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
      
      {/* Hidden templates for PDF generation */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0.01, pointerEvents: 'none', zIndex: -1000 }}>
          {profiles.map(match => 
            match.profile && <JathagamPDFTemplate key={`pdf-${match.id}`} profile={match.profile as any} profileId={match.id} family={(match as any).family} akshayamId={(match as any).userid} userIndex={(match as any).userIndex} />
          )}
        </div>
    </div>
  );
}

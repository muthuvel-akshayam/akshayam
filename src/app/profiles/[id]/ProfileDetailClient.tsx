'use client';

import { useState, useEffect, useRef } from 'react';
import { User, MapPin, Briefcase, GraduationCap, Calendar, Clock, Star, Phone, Shield, Lock, Activity, Link as LinkIcon, Download, Share2, Wand2, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translateNakshatra, translateRasi } from '@/frontend/utils/astrology';
import JathagamChart from '@/frontend/components/JathagamChart';
import { supabase } from '@/backend/supabase';
import { requestContact } from '@/backend/actions/matches';
import { toggleShortlist } from '@/backend/actions/shortlist';
import JathagamPDFTemplate from '@/frontend/components/pdf/JathagamPDFTemplate';
import { shareProfile, shareToWhatsApp } from '@/lib/shareProfile';
import { downloadBioDataPdf } from '@/lib/generatePdf';

export function ProfileDetailClient({ user, initialIsShortlisted = false, currentUserHasProfile = false }: { user: any, initialIsShortlisted?: boolean, currentUserHasProfile?: boolean }) {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(initialIsShortlisted);
  const [isShortlisting, setIsShortlisting] = useState(false);
  
  // Calculate if interest has already been sent
  const [interestSent, setInterestSent] = useState(() => {
    return user.receivedRequests && user.receivedRequests.length > 0;
  });
  const [isSendingInterest, setIsSendingInterest] = useState(false);

  const handleToggleShortlist = async () => {
    setIsShortlisting(true);
    try {
      await toggleShortlist(user.id);
      setIsShortlisted(!isShortlisted);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleSendInterest = async () => {
    setIsSendingInterest(true);
    try {
      await requestContact(user.id);
      setInterestSent(true);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingInterest(false);
    }
  };

  const handleShareClick = () => {
    if (!currentUserHasProfile) {
      alert('Please sign up and create your profile to share profiles.');
      return;
    }
    shareToWhatsApp(user.profile.id, user.profile);
  };
  const profile = user.profile;
  const family = user.family;
  const exp = user.expectations;

  const convertLegacyGrid = (gridData: any) => {
    if (!gridData || typeof gridData !== 'object') return null;
    const houseMapping: Record<string, number> = {
      'meenam': 11, 'mesham': 0, 'rishabham': 1, 'mithunam': 2,
      'kadagam': 3, 'simmam': 4, 'kanni': 5, 'thulam': 6,
      'viruchigam': 7, 'dhanusu': 8, 'magaram': 9, 'kumbam': 10
    };
    const houses: {houseIndex: number, planets: string[]}[] = [];
    for (const [key, planets] of Object.entries(gridData)) {
      let idx: number | undefined;
      if (!isNaN(Number(key))) {
        idx = Number(key);
      } else {
        idx = houseMapping[key.toLowerCase()];
      }
      if (idx !== undefined && Array.isArray(planets)) {
        houses.push({ houseIndex: idx, planets: planets.map(p => String(p)) });
      }
    }
    return houses.length > 0 ? houses : null;
  };

  const rasiHouses = convertLegacyGrid((profile as any).jathagamData?.rasiChart) || convertLegacyGrid((profile as any).jathagamData?.rasi) || convertLegacyGrid(profile.rasiGrid);
  const amsamHouses = convertLegacyGrid((profile as any).jathagamData?.navamsamChart) || convertLegacyGrid((profile as any).jathagamData?.navamsam) || convertLegacyGrid(profile.amsamGrid);
  const hasCharts = rasiHouses && amsamHouses;

  if (!profile) return <div>Profile not found.</div>;

  const age = profile.dob ? Math.floor((new Date().getTime() - new Date(profile.dob).getTime()) / 3.15576e+10) : 'N/A';
  
  // Format education safely handling arrays
  const education = Array.isArray(profile.educations) && profile.educations.length > 0 
    ? profile.educations.map((e: any) => e.degreeName).join(', ') 
    : 'N/A';
    
  // Format profession
  const profession = family?.workNature === 'JOB' ? family?.designation || 'Job' : (family?.workNature === 'BUSINESS' ? 'Business' : 'Not Working');
  
  // Safe helper to return N/A if empty
  const safeStr = (str: any) => (str && str.toString().trim() !== '' ? str : '-');

  const fullJathakamUrl = profile?.jathakamUrl 
    ? supabase.storage.from('user-documents').getPublicUrl(profile.jathakamUrl).data.publicUrl 
    : null;

  const extractionAttempted = useRef(false);

  const handleExtractCharts = async () => {
    if (!profile?.jathakamUrl) return;
    
    setIsExtracting(true);
    
    try {
      const res = await fetch('/api/jathagam/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jathakamUrl: profile.jathakamUrl, userId: user.id })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error("Backend Error Response:", errText);
        throw new Error(`Extraction failed: ${errText}`);
      }
      
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Extraction failed');
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    if (!hasCharts && profile?.jathakamUrl && !extractionAttempted.current) {
      extractionAttempted.current = true;
      handleExtractCharts();
    }
  }, [hasCharts, profile?.jathakamUrl]);



  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-2 self-start sm:self-center"
          >
            &larr; Back to Profiles
          </button>
          
          <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={handleToggleShortlist}
              disabled={isShortlisting}
              className={`col-span-2 sm:col-span-1 justify-center flex items-center gap-2 px-2 py-2.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50 ${isShortlisted ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm">{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>
            <button
              onClick={handleSendInterest}
              disabled={isSendingInterest || interestSent}
              className={`col-span-2 sm:col-span-1 justify-center flex items-center gap-2 px-2 py-2.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-75 ${interestSent ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-light'}`}
            >
              <Star className={`w-4 h-4 ${interestSent ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm">{interestSent ? 'Interest Sent' : 'Send Interest'}</span>
            </button>
            <button
              onClick={handleShareClick}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-2 py-2.5 sm:px-4 sm:py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Share</span>
            </button>
            <button
              onClick={() => downloadBioDataPdf(`pdf-template-${profile.id}`, profile.id)}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-2 py-2.5 sm:px-4 sm:py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Download</span>
            </button>
          </div>
        </div>

        {/* Top Header Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="w-full md:w-1/3 h-80 bg-gray-100 relative">
            {profile.hidePhoto ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-500 p-4 text-center">
                <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-semibold text-lg">Photo Protected</span>
                <span className="text-xs mt-1">This user has chosen to hide their photo.</span>
              </div>
            ) : profile.photoUrl && !profile.photoUrl.includes('blurred-avatar.png') ? (
              <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-contain bg-gray-50" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo Available</div>
            )}
          </div>
          
          <div className="w-full md:w-2/3 p-0 flex flex-col">
            <div className="bg-amber-100/50 p-6 flex-1">
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto] gap-y-4">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">பெயர்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {profile.name}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">வயது</div>
                <div className="text-gray-900">: {age}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">படிப்பு</div>
                <div className="text-gray-900">: {education}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">{family?.workNature === 'JOB' ? 'பதவி' : 'தொழில்'}</div>
                <div className="text-gray-900">: {profession}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">{family?.workNature === 'JOB' ? 'வேலை செய்யும் இடம்' : 'தொழில் அலுவலகம்'}</div>
                <div className="text-gray-900">: {safeStr(family?.city || profile.city)}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 flex-1 border-t border-gray-100">
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto] gap-y-4">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">பதிவு எண்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {user.userid || (user.userIndex ? `${1000 + user.userIndex}` : `${user.id.substring(0, 6).toUpperCase()}`)}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">ஜாதி</div>
                <div className="text-gray-900">: {safeStr(profile.caste)}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">குலம்</div>
                <div className="text-gray-900">: {safeStr(profile.koottam)}</div>
                
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">திருமண நிலை</div>
                <div className="text-gray-900">: {safeStr(profile.maritalStatus)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">தனிப்பட்ட விவரங்கள்</h2>
          <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
        </div>

        {/* Personal Details Grid */}
        <div className="bg-[#f2f8f6] rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">தந்தை பெயர்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(family?.fatherName)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">தந்தை தொழில்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(family?.fatherStatus)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">தாயார் பெயர்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(family?.motherName)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">தாயார் தொழில்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(family?.motherStatus)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">உடன் பிறப்பு</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {Array.isArray(family?.siblings) ? family.siblings.length : 0}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">பிறந்த தேதி</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {profile.dob ? new Date(profile.dob).toLocaleDateString('en-GB') : '-'}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">பிறந்த நேரம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.tob)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">பிறந்த இடம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.lob)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">சொந்த ஊர்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.city)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">சொத்து விவரம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(family?.totalAssetValue || family?.vacantLand || family?.houseType)}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">நட்சத்திரம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {translateNakshatra(profile.nakshatra, 'TA')}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">ராசி</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {translateRasi(profile.rasi, 'TA')}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">தோஷம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.dosham)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">நிறம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.skinColour)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">உயரம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.height)} cm</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">எடை</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(profile.weight)} kg</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">மாத வருமானம்</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(family?.salary)}</div>
              </div>
              <div className="grid grid-cols-[130px_auto] sm:grid-cols-[150px_auto]">
                <div className="text-[15px] sm:text-lg font-bold text-gray-700">எதிர்பார்ப்பு</div>
                <div className="text-[15px] sm:text-lg font-bold text-gray-900">: {safeStr(exp?.expectedIncome || 'Any')}</div>
              </div>
              
              <div className="mt-8 bg-white/50 p-4 rounded-lg border border-red-100 text-sm text-red-600 italic">
                குறிப்பு: மொபைல் எண் மற்றும் முகவரி விவரங்கள் மறைக்கப்பட்டுள்ளன. மேலும் விவரங்களுக்கு நிர்வாகியைத் தொடர்பு கொள்ளவும். (Contact Admin for contact details).
              </div>
            </div>

          </div>
        </div>

        {/* Astrology / Horoscope Section */}
        {hasCharts ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
             <h3 className="text-xl font-bold text-gray-900 text-center">ஜாதகம் (Horoscope)</h3>
             {profile.dasaBalance && (
                <div className="text-center text-sm font-semibold text-gray-700 bg-amber-50 py-2 px-4 rounded inline-block mx-auto">
                   திசை இருப்பு: {profile.dasaBalance}
                </div>
             )}
             
             <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 my-8 w-full max-w-4xl mx-auto">
                <JathagamChart title="ராசி" houses={rasiHouses} />
                <JathagamChart title="அம்சம்" houses={amsamHouses} />
             </div>
             

          </div>
        ) : fullJathakamUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8 min-h-[300px] flex flex-col items-center justify-center">
             <h3 className="text-xl font-bold text-gray-900 text-center mb-6">ஜாதகம் (Horoscope)</h3>
             
             {isExtracting ? (
               <div className="flex flex-col items-center gap-4 text-indigo-600">
                 <Wand2 className="w-8 h-8 animate-spin" />
                 <p className="font-semibold text-sm">AI is automatically analyzing the charts...</p>
               </div>
             ) : (
               <div className="flex justify-center w-full">
                  {fullJathakamUrl.toLowerCase().endsWith('.pdf') ? (
                     <a href={fullJathakamUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-md font-bold shadow-sm hover:bg-red-700 transition-colors flex justify-center items-center">
                       View Horoscope PDF
                     </a>
                  ) : (
                     <div className="relative w-full max-w-4xl h-72 sm:h-96 overflow-hidden rounded-lg border border-gray-300 shadow-sm cursor-zoom-in group" onClick={(e) => {
                    e.stopPropagation();
                    shareToWhatsApp(profile.id, profile);
                  }}>
                       <img 
                         src={fullJathakamUrl} 
                         alt="Horoscope Charts" 
                         className="absolute bottom-0 w-full h-auto object-cover object-bottom scale-[1.4] sm:scale-[1.5] origin-bottom transition-transform duration-300 group-hover:scale-[1.45] sm:group-hover:scale-[1.55]"
                       />
                     </div>
                  )}
               </div>
             )}
          </div>
        )}
        
        {/* Hidden PDF Template */}
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -1000, opacity: 0.01, pointerEvents: 'none' }}>
           <JathagamPDFTemplate profile={profile} profileId={profile.id} family={family} akshayamId={user.userid} userIndex={user.userIndex} userCreatedAt={user.createdAt} />
        </div>
      </div>
    </div>
  );
}




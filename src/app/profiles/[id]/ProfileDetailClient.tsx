'use client';

import { useState, useEffect, useRef } from 'react';
import { User, MapPin, Briefcase, GraduationCap, Calendar, Clock, Star, Phone, Shield, Lock, Activity, Link as LinkIcon, Download, Share2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translateNakshatra, translateRasi } from '@/frontend/utils/astrology';
import JathagamChart from '@/frontend/components/JathagamChart';
import { supabase } from '@/backend/supabase';
import { requestContact } from '@/backend/actions/matches';
import JathagamPDFTemplate from '@/frontend/components/pdf/JathagamPDFTemplate';
import { shareProfile, shareToWhatsApp } from '@/lib/shareProfile';
import { downloadBioDataPdf } from '@/lib/generatePdf';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export function ProfileDetailClient({ user }: { user: any }) {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);
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
      const idx = houseMapping[key.toLowerCase()];
      if (idx !== undefined) {
        houses.push({ houseIndex: idx, planets: Array.isArray(planets) ? planets : [] });
      }
    }
    return houses.length > 0 ? houses : null;
  };

  const rasiHouses = (profile as any).jathagamData?.rasi || convertLegacyGrid(profile.rasiGrid);
  const amsamHouses = (profile as any).jathagamData?.navamsam || convertLegacyGrid(profile.amsamGrid);
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
      
      if (!res.ok) throw new Error('Extraction failed');
      
      router.refresh();
    } catch (err) {
      console.error(err);
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
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-2"
          >
            &larr; Back to Profiles
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => shareToWhatsApp(profile.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200 text-green-700 hover:bg-green-100 shadow-sm transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={() => shareProfile(profile.id, profile.name)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-bold hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => downloadBioDataPdf(`pdf-template-${profile.id}`, profile.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-bold hidden sm:inline">Download Bio-Data</span>
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
              <div className="grid grid-cols-[150px_auto] gap-y-4">
                <div className="font-semibold text-gray-700">பெயர்</div>
                <div className="font-bold text-gray-900">: {profile.name}</div>
                
                <div className="font-semibold text-gray-700">வயது</div>
                <div className="text-gray-900">: {age}</div>
                
                <div className="font-semibold text-gray-700">படிப்பு</div>
                <div className="text-gray-900">: {education}</div>
                
                <div className="font-semibold text-gray-700">தொழில்</div>
                <div className="text-gray-900">: {profession}</div>
                
                <div className="font-semibold text-gray-700">வேலை செய்யும் இடம்</div>
                <div className="text-gray-900">: {safeStr(family?.city || profile.city)}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 flex-1 border-t border-gray-100">
              <div className="grid grid-cols-[150px_auto] gap-y-4">
                <div className="font-semibold text-gray-700">பதிவு எண்</div>
                <div className="font-bold text-gray-900">: {user.userid || (user.userIndex ? `AKSH${1000 + user.userIndex}` : `AKSH${user.id.substring(0, 6).toUpperCase()}`)}</div>
                
                <div className="font-semibold text-gray-700">ஜாதி</div>
                <div className="text-gray-900">: {safeStr(profile.caste)}</div>
                
                <div className="font-semibold text-gray-700">குலம்</div>
                <div className="text-gray-900">: {safeStr(profile.koottam)}</div>
                
                <div className="font-semibold text-gray-700">திருமண நிலை</div>
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
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">தந்தை பெயர்</div>
                <div className="font-medium text-gray-900">: {safeStr(family?.fatherName)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">தந்தை தொழில்</div>
                <div className="font-medium text-gray-900">: {safeStr(family?.fatherStatus)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">தாயார் பெயர்</div>
                <div className="font-medium text-gray-900">: {safeStr(family?.motherName)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">தாயார் தொழில்</div>
                <div className="font-medium text-gray-900">: {safeStr(family?.motherStatus)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">உடன் பிறப்பு</div>
                <div className="font-medium text-gray-900">: {Array.isArray(family?.siblings) ? family.siblings.length : 0}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">பிறந்த தேதி</div>
                <div className="font-medium text-gray-900">: {profile.dob ? new Date(profile.dob).toLocaleDateString('en-GB') : '-'}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">பிறந்த நேரம்</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.tob)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">பிறந்த இடம்</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.lob)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">சொந்த ஊர்</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.city)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">சொத்து விவரம்</div>
                <div className="font-medium text-gray-900">: {safeStr(family?.totalAssetValue || family?.vacantLand || family?.houseType)}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">நட்சத்திரம்</div>
                <div className="font-medium text-gray-900">: {translateNakshatra(profile.nakshatra, 'TA')}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">ராசி</div>
                <div className="font-medium text-gray-900">: {translateRasi(profile.rasi, 'TA')}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">தோஷம்</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.dosham)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">நிறம்</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.skinColour)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">உயரம்</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.height)} cm</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">எடை</div>
                <div className="font-medium text-gray-900">: {safeStr(profile.weight)} kg</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">மாத வருமானம்</div>
                <div className="font-medium text-gray-900">: {safeStr(family?.salary)}</div>
              </div>
              <div className="grid grid-cols-[150px_auto]">
                <div className="text-gray-600">எதிர்பார்ப்பு</div>
                <div className="font-medium text-gray-900">: {safeStr(exp?.expectedIncome || 'Any')}</div>
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
                     <div className="relative w-full max-w-4xl h-72 sm:h-96 overflow-hidden rounded-lg border border-gray-300 shadow-sm cursor-zoom-in group" onClick={() => window.open(fullJathakamUrl, '_blank')}>
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
           <JathagamPDFTemplate profile={profile} profileId={profile.id} family={family} akshayamId={user.userid} userIndex={user.userIndex} />
        </div>
      </div>
    </div>
  );
}




import React from 'react';
import JathagamChart from '../JathagamChart';

interface JathagamPDFTemplateProps {
  profile: any;
  profileId: string;
}

// Function to safely parse JSON grids
const convertLegacyGrid = (gridData: any) => {
  if (!gridData || typeof gridData !== 'object') return [];
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
  return houses;
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

const FieldRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div className="flex mb-1.5 text-sm">
    <div className="w-32 font-bold text-gray-800">{label}</div>
    <div className="w-4 font-bold text-gray-800">:</div>
    <div className="flex-1 text-gray-900 font-medium whitespace-pre-wrap">{value || '-'}</div>
  </div>
);

export default function JathagamPDFTemplate({ profile, profileId }: JathagamPDFTemplateProps) {
  if (!profile) return null;

  const rasiHouses = profile.jathagamData?.rasi || convertLegacyGrid(profile.rasiGrid);
  const amsamHouses = profile.jathagamData?.navamsam || convertLegacyGrid(profile.amsamGrid);
  
  // Custom wrapper for JathagamChart to fit inside the PDF layout
  const PDFChartBox = ({ title, houses }: { title: "ராசி" | "அம்சம்" | "நவாம்சம்", houses: any }) => (
    <div className="w-[300px] flex flex-col items-center">
      <div className="w-full aspect-square border-2 border-green-800 relative bg-white flex items-center justify-center p-2">
        <JathagamChart title={title} houses={houses || []} />
        {/* Watermark/Center logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
          <img src="/akshayam_logo.png" alt="Logo Watermark" className="w-24 object-contain" />
        </div>
      </div>
      <div className="mt-2 font-bold text-green-900 text-lg bg-white px-4 py-1">{title}</div>
    </div>
  );

  const displayId = profile.userIndex ? `${1000 + profile.userIndex}AE` : `AK${parseInt(profileId.substring(0, 4), 16)}`;

  return (
    <div 
      id={`pdf-template-${profileId}`} 
      className="fixed -left-[9999px] top-0 bg-white" 
      style={{ width: '794px', height: '1123px' }} // Standard A4 at 96 DPI
    >
      <div className="w-full h-full border-4 border-[#004d25] flex flex-col font-sans p-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center border-b-2 border-gray-300 pb-4 mb-4">
          <img src="/akshayam_logo.png" alt="Akshayam Logo" className="h-20 object-contain mb-2" />
          <h1 className="text-3xl font-bold text-red-600 font-serif mb-2">அக்‌ஷயம் திருமண தகவல் மையம்</h1>
          <div className="bg-red-50 border-2 border-red-500 rounded-full px-6 py-1 text-red-600 font-bold text-sm mb-3">
            ஜாதகம் பதிவு செய்யப்படும்
          </div>
          <div className="text-sm font-bold text-gray-800 mb-1">24 மணி நேர சேவை மைய தொடர்புக்கு</div>
          <div className="bg-[#004d25] text-white rounded-full px-6 py-2 font-bold text-xl flex items-center gap-2 shadow-md">
            <span>📞 96776 13716, 93452 89217</span>
          </div>
        </div>

        {/* Profile Meta Strip */}
        <div className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-2 mb-6 font-bold text-sm">
          <div className="text-[#004d25]">Profile ID: <span className="text-red-600">{displayId}</span></div>
          <div className="text-[#004d25]">Date Reg: {new Date(profile.createdAt || Date.now()).toLocaleDateString('en-GB')}</div>
          <div className="text-[#004d25]">Expiry: {new Date(new Date(profile.createdAt || Date.now()).setFullYear(new Date(profile.createdAt || Date.now()).getFullYear() + 1)).toLocaleDateString('en-GB')}</div>
        </div>

        {/* Two Column Layout for Details & Photo */}
        <div className="flex gap-6 mb-6 flex-1">
          {/* Left Details Column */}
          <div className="flex-1 flex flex-col gap-x-4">
            <FieldRow label="பெயர்" value={profile.name} />
            <FieldRow label="பாலினம்" value={profile.gender === 'MALE' ? 'ஆண்' : 'பெண்'} />
            <FieldRow label="வயது" value={`${calculateAge(profile.dob)} வருடம்`} />
            <FieldRow label="திருமண நிலை" value={profile.maritalStatus === 'NEVER_MARRIED' ? 'முதல் மணம்' : 'மறுமணம்'} />
            <FieldRow label="நிறம்" value={profile.skinColour} />
            <FieldRow label="உயரம்" value={`${profile.height} cm`} />
            <FieldRow label="எடை" value={`${profile.weight} Kg`} />
            
            <div className="flex gap-4 mt-2">
               <div className="flex-1">
                  <FieldRow label="சாதி" value={profile.caste} />
               </div>
               <div className="flex-1">
                  <FieldRow label="குலம்" value={profile.koottam || profile.subCaste} />
               </div>
            </div>
            
            <FieldRow label="கோவில்" value={profile.houseLocation} />
            
            <div className="flex gap-4 mt-2">
               <div className="flex-1">
                  <FieldRow label="நட்சத்திரம்" value={profile.nakshatra} />
                  <FieldRow label="பாதம்" value="-" />
                  <FieldRow label="லக்னம்" value="-" />
                  <FieldRow label="ஜாதகம்" value={profile.dosham ? "தோஷ ஜாதகம்" : "சுத்த ஜாதகம்"} />
               </div>
               <div className="flex-1">
                  <FieldRow label="பிறந்த தேதி" value={new Date(profile.dob).toLocaleDateString('en-GB')} />
                  <FieldRow label="பிறந்த நேரம்" value={profile.tob} />
                  <FieldRow label="பிறந்த ஊர்" value={profile.lob || profile.city} />
               </div>
            </div>
          </div>

          {/* Right Photo Column */}
          <div className="w-[200px] flex-shrink-0">
            <div className="w-full h-[260px] border-2 border-gray-400 p-1 bg-white rounded-lg overflow-hidden shadow-sm">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo Not Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex justify-around items-start my-8 px-4 border-t border-gray-200 pt-8">
          <PDFChartBox title="ராசி" houses={rasiHouses} />
          <PDFChartBox title="நவாம்சம்" houses={amsamHouses} />
        </div>

        {/* Bottom Details Section */}
        <div className="flex gap-4 border-t border-gray-200 pt-6">
           <div className="flex-1">
              <FieldRow label="படிப்பு" value={profile.educations?.[0]?.degree || "-"} />
              <FieldRow label="மாத வருமானம்" value="-" />
              <FieldRow label="சொத்து விவரம்" value="-" />
           </div>
           <div className="flex-1">
              <FieldRow label="பணியின் விவரம்" value="-" />
              <FieldRow label="பணியிடம்" value={profile.city} />
           </div>
        </div>
        
        <div className="mt-4">
           <FieldRow label="எதிர்பார்ப்பு" value="நல்ல வாழ்க்கைத்துணை" />
           <div className="mt-4 text-[#004d25] font-bold text-sm">
              நேரடி தொடர்பு எண் : <span className="text-gray-900">+91 {profile.user?.mobile_no || "9677613716"}</span>
           </div>
        </div>

        {/* Footer Banner */}
        <div className="mt-auto h-32 bg-[#004d25] rounded-lg overflow-hidden flex relative items-center justify-between px-4">
           {/* Abstract left decoration */}
           <div className="w-1/3 flex items-end justify-start h-full">
              <img src="/hero-couple.png" alt="Couple" className="h-[120%] object-cover object-top opacity-90 -ml-4" style={{ transform: 'translateY(10%)' }} />
           </div>
           
           {/* Center Branding */}
           <div className="flex-1 flex flex-col items-center justify-center text-white z-10">
              <img src="/akshayam_logo.png" alt="Logo" className="h-10 brightness-0 invert mb-1 opacity-90" />
              <h2 className="text-2xl font-bold font-serif leading-tight">அக்‌ஷயம்</h2>
              <div className="text-sm font-medium mb-1">திருமண தகவல் மையம்</div>
              <div className="bg-white text-[#004d25] text-xs font-bold px-3 py-0.5 rounded-full mb-1">ஜாதகம் பதிவு செய்யப்படும்</div>
              <div className="text-[10px] opacity-80">24 மணி நேர சேவை மைய தொடர்புக்கு</div>
              <div className="font-bold text-sm">📞 96776 13716, 93452 89217</div>
           </div>

           {/* Right Temple Image */}
           <div className="w-1/3 flex items-center justify-end h-full">
              <img src="/temple.jpg" alt="Temple" className="h-28 w-40 object-cover rounded-md border-2 border-white/20 shadow-lg" />
           </div>
        </div>

      </div>
    </div>
  );
}

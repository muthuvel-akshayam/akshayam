import React from 'react';
import QRCode from 'react-qr-code';
import JathagamChart from '../JathagamChart';

interface JathagamPDFTemplateProps {
  profile: any;
  profileId: string;
  family?: any;
  akshayamId?: string;
}

const convertLegacyGrid = (gridData: any) => {
  if (!gridData || typeof gridData !== 'object') return [];
  const houseMapping: Record<string, number> = {
    'meenam': 0, 'mesham': 1, 'rishabham': 2, 'mithunam': 3,
    'kadagam': 4, 'simmam': 5, 'kanni': 6, 'thulam': 7,
    'viruchigam': 8, 'dhanusu': 9, 'magaram': 10, 'kumbam': 11
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

const translateToTamil = (val: string | null | undefined, dict: Record<string, string>) => {
  if (!val) return val;
  const key = val.trim().toLowerCase();
  return dict[key] || dict[val.trim().toUpperCase()] || val;
};

const colorMap: Record<string, string> = {
  'fair': 'சிகப்பு', 'very_fair': 'மிகவும் சிகப்பு', 'very fair': 'மிகவும் சிகப்பு', 
  'wheatish': 'மாநிறம்', 'wheatish_brown': 'கோதுமை நிறம்', 'wheatish brown': 'கோதுமை நிறம்', 'dark': 'கருப்பு'
};

const familyStatusMap: Record<string, string> = {
  'middle_class': 'நடுத்தர வர்க்கம்', 'middle class': 'நடுத்தர வர்க்கம்',
  'upper_middle_class': 'உயர் நடுத்தர வர்க்கம்', 'upper middle class': 'உயர் நடுத்தர வர்க்கம்',
  'rich': 'பணக்காரர்', 'affluent': 'மிகவும் பணக்காரர்'
};

const maritalStatusMap: Record<string, string> = {
  'never_married': 'முதல் மணம்', 'never married': 'முதல் மணம்',
  'widowed': 'விதவை', 'divorced': 'விவாகரத்து பெற்றவர்', 'awaiting_divorce': 'விவாகரத்துக்காக காத்திருப்பவர்'
};

const doshamMap: Record<string, string> = {
  'no_dosham': 'சுத்த ஜாதகம்', 'none': 'சுத்த ஜாதகம்',
  'rahu_ketu': 'ராகு கேது தோஷம்', 'chevvai': 'செவ்வாய் தோஷம்', 'sarpa': 'சர்ப்ப தோஷம்'
};

const nakshatraMap: Record<string, string> = {
  'ashwini': 'அஸ்வினி', 'bharani': 'பரணி', 'krithika': 'கிருத்திகை', 'karthigai': 'கிருத்திகை', 
  'rohini': 'ரோகிணி', 'mrigashiras': 'மிருகசீரிடம்', 'mrigasheersham': 'மிருகசீரிடம்', 
  'ardra': 'திருவாதிரை', 'thiruvathirai': 'திருவாதிரை', 'punarvasu': 'புனர்பூசம்', 'punarpoosam': 'புனர்பூசம்',
  'pushya': 'பூசம்', 'poosam': 'பூசம்', 'ashlesha': 'ஆயில்யம்', 'ayilyam': 'ஆயில்யம்',
  'magha': 'மகம்', 'makam': 'மகம்', 'purva phalguni': 'பூரம்', 'pooram': 'பூரம்', 
  'uttara phalguni': 'உத்திரம்', 'uthiram': 'உத்திரம்', 'hasta': 'அஸ்தம்', 'hastham': 'அஸ்தம்',
  'chitra': 'சித்திரை', 'chithirai': 'சித்திரை', 'swati': 'சுவாதி', 'swathi': 'சுவாதி',
  'vishakha': 'விசாகம்', 'visakam': 'விசாகம்', 'anuradha': 'அனுஷம்', 'anusham': 'அனுஷம்',
  'jyeshtha': 'கேட்டை', 'kettai': 'கேட்டை', 'mula': 'மூலம்', 'moolam': 'மூலம்',
  'purva ashadha': 'பூராடம்', 'pooradam': 'பூராடம்', 'uttara ashadha': 'உத்திராடம்', 'uthiradam': 'உத்திராடம்',
  'shravana': 'திருவோணம்', 'thiruvonam': 'திருவோணம்', 'dhanishta': 'அவிட்டம்', 'avittam': 'அவிட்டம்',
  'shatabhisha': 'சதயம்', 'sathayam': 'சதயம்', 'purva bhadrapada': 'பூரட்டாதி', 'poorattathi': 'பூரட்டாதி',
  'uttara bhadrapada': 'உத்திரட்டாதி', 'uthirattathi': 'உத்திரட்டாதி', 'revati': 'ரேவதி', 'revathi': 'ரேவதி'
};

const mapParentStatus = (status: string | null | undefined) => {
  if (!status) return 'உண்டு';
  const s = status.toLowerCase();
  if (s === 'alive' || s === 'yes') return 'உண்டு';
  if (s === 'late' || s === 'passed away' || s === 'deceased' || s === 'no') return 'இல்லை';
  return status;
};

// Strict colon-aligned row for bottom section
const FieldRow = ({ label, value, labelWidth = "w-[120px]", valueWidth = "w-[310px]" }: { label: string; value: string | number | null | undefined; labelWidth?: string; valueWidth?: string }) => (
  <div className="flex items-start mb-1 text-[11px] leading-tight">
    <div className={`font-bold text-emerald-950 whitespace-nowrap ${labelWidth} flex-shrink-0`}>{label}</div>
    <div className="font-bold text-emerald-950 text-center w-[10px] flex-shrink-0">:</div>
    <div className={`font-bold text-gray-900 whitespace-pre-wrap break-words pl-1 ${valueWidth} flex-shrink-0`}>{value || '-'}</div>
  </div>
);

// Strict colon-aligned grid item for top section
const FieldItem = ({ label, value, colSpan = 1 }: { label: string; value: string | number | null | undefined; colSpan?: number }) => {
  const displayValue = (value === null || value === undefined || value === '' || value === 'null' || value === '-') ? 'குறிப்பிடப்படவில்லை' : value;
  // Total column width is 265px. 115 + 10 + 140 = 265px.
  return (
    <div className={`flex items-start text-[12px] leading-tight text-slate-900 ${colSpan === 2 ? 'w-[540px]' : 'w-[265px]'}`}>
      <div className="font-semibold text-slate-800 whitespace-nowrap w-[115px] flex-shrink-0">{label}</div>
      <div className="font-bold text-center text-slate-700 w-[10px] flex-shrink-0">:</div>
      <div className={`font-medium text-slate-900 pl-1 break-words ${colSpan === 2 ? 'w-[415px]' : 'w-[140px]'} flex-shrink-0`}>{displayValue}</div>
    </div>
  );
};

export default function JathagamPDFTemplate({ profile, profileId, family: familyProp, akshayamId }: JathagamPDFTemplateProps) {
  if (!profile) return null;

  const rasiHouses = convertLegacyGrid(profile.jathagamData?.rasiChart || profile.jathagamData?.rasiGrid || profile.rasiGrid);
  const amsamHouses = convertLegacyGrid(profile.jathagamData?.navamsamChart || profile.jathagamData?.amsamGrid || profile.amsamGrid);
  const family = familyProp || profile.family || {};
  
  const getDerivedTamilDay = (dateStr: any) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString('ta-IN', { weekday: 'long' });
  };

  const siblingsCount = (family.brothers || 0) + (family.sisters || 0);
  const siblingsText = siblingsCount > 0 
    ? `${family.brothers ? `சகோதரன்: ${family.brothers} ` : ''}${family.sisters ? `சகோதரி: ${family.sisters}` : ''}`
    : "இல்லை";

  const ChartCenterLogo = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white opacity-95">
      <img src="/akshayam_logo.png" alt="Logo" className="w-10 opacity-80 mix-blend-multiply" />
      <div className="font-bold text-emerald-800 text-[11px] leading-tight mt-1 tracking-tight">அக்ஷயம்</div>
      <div className="font-bold text-emerald-700 text-[9px]">{title}</div>
    </div>
  );

  const PDFChartBox = ({ title, houses }: { title: "ராசி" | "நவாம்சம்", houses: any }) => (
    <div className="w-[200px] h-[200px]">
      <div className="w-full h-full border-[1.5px] border-emerald-800 bg-white p-[1px]">
        <JathagamChart title={title} houses={houses || []} centerElement={<ChartCenterLogo title={title} />} pdfMode={true} />
      </div>
    </div>
  );

  const safeProfileId = String(profileId || "");
  const parsedHex = parseInt(safeProfileId.substring(0, 4), 16);
  const safeIdNum = isNaN(parsedHex) ? 1000 : 1000 + (parsedHex % 9000);
  const displayId = akshayamId || profile.displayId || (profile.userIndex ? `AK${1000 + profile.userIndex}` : `AK${safeIdNum}`);
  const profileUrl = `https://www.akshayamtamilmatrimony.com/profiles/${profileId}`;

  // Priority Mapping Logic
  const jData = profile.jathagamData || {};
  
  const name = jData.name || profile.name;
  const nakshatra = translateToTamil(jData.nakshatra || profile.nakshatra, nakshatraMap) || 'குறிப்பிடப்படவில்லை';
  const padam = jData.padam || profile.padam || '1';
  const lagnam = translateToTamil(jData.lagnam || profile.lagnam, nakshatraMap) || 'குறிப்பிடப்படவில்லை';
  const dosham = translateToTamil(profile.dosham, doshamMap) || "சுத்த ஜாதகம்"; 
  
  const dob = jData.dateOfBirth || profile.dateOfBirth || profile.dob;
  const tob = jData.timeOfBirth || profile.timeOfBirth || profile.tob;
  const dayOfBirth = jData.dayOfBirth || profile.dayOfBirth || (dob ? getDerivedTamilDay(dob) : 'குறிப்பிடப்படவில்லை');
  const placeOfBirth = translateToTamil(jData.placeOfBirth || jData.nativePlace || profile.placeOfBirth || profile.lob || profile.city, { 'coimbatore': 'கோயம்புத்தூர்', 'chennai': 'சென்னை', 'tiruppur': 'திருப்பூர்', 'erode': 'ஈரோடு', 'salem': 'சேலம்', 'karur': 'கரூர்', 'namakkal': 'நாமக்கல்' }) || 'குறிப்பிடப்படவில்லை';
  const dasaBalance = jData.dasaBalance || profile.dasaBalance || profile.birthDetails || 'தசா இருப்பு விவரம் பார்க்கவும்';
  
  const kovil = jData.kovil || profile.houseLocation || 'குலதெய்வம் குறிப்பிடப்படவில்லை';
  const kulam = profile.koottam || jData.kulam || profile.subCaste || 'குறிப்பிடப்படவில்லை';
  const fatherStatus = mapParentStatus(jData.fatherName || family.fatherStatus);
  const motherStatus = mapParentStatus(jData.motherName || family.motherStatus);
  const siblingsDisplay = jData.siblings || (siblingsCount > 0 ? siblingsText : (profile.siblings || 'இல்லை'));
  
  let formattedOccupation = [];
  if (family.workNature) formattedOccupation.push(family.workNature);
  if (family.designation) formattedOccupation.push(family.designation);
  if (family.organisation) formattedOccupation.push(family.organisation);
  const occupationStr = formattedOccupation.length > 0 ? formattedOccupation.join(' - ') : (jData.occupation || profile.occupations?.map((o: any) => o.jobTitle || o.jobType).filter(Boolean).join(', ') || profile.occupation || "-");
  
  const income = family.salary || profile.income || jData.monthlyIncome || jData.income || "-";
  
  let formattedProperty = [];
  if (family.houseType) formattedProperty.push(`வீடு: ${family.houseType}`);
  if (family.thottam && family.thottam !== 'இல்லை' && family.thottam !== 'None') formattedProperty.push(`தோட்டம்: ${family.thottam}`);
  if (family.vacantLand && family.vacantLand !== 'இல்லை' && family.vacantLand !== 'None') formattedProperty.push(`காலி இடம்: ${family.vacantLand}`);
  if (family.propertyValue) formattedProperty.push(`மதிப்பு: ${family.propertyValue}`);
  const propertyStr = formattedProperty.length > 0 ? formattedProperty.join(', ') : (family.propertyDetails || profile.property || jData.propertyDetails || jData.property || "-");
  const nativePlace = translateToTamil(jData.nativePlace || profile.nativePlace || profile.city, { 'coimbatore': 'கோயம்புத்தூர்', 'chennai': 'சென்னை', 'tiruppur': 'திருப்பூர்', 'erode': 'ஈரோடு', 'salem': 'சேலம்', 'karur': 'கரூர்', 'namakkal': 'நாமக்கல்' }) || "-";

  // Height translation (e.g. 5ft 3in -> 5 அடி 3 அங்குலம்)
  let heightStr = 'குறிப்பிடப்படவில்லை';
  if (profile.height) {
    const feet = Math.floor(profile.height / 30.48);
    const inches = Math.round((profile.height % 30.48) / 2.54);
    heightStr = `${feet} அடி ${inches} அங்குலம் / ${profile.height} செ.மீ`;
  }
  
  const casteDisplay = translateToTamil(profile.caste, { 'kongu vellala gounder': 'கொங்கு வேளாளக் கவுண்டர்', 'gounder': 'கவுண்டர்' }) || 'குறிப்பிடப்படவில்லை';

  return (
    <div 
      id={`pdf-template-${profileId}`} 
      className="w-[794px] h-[1123px] bg-white p-6 flex flex-col justify-between overflow-hidden box-border mx-auto text-gray-900 relative"
      style={{ width: '794px', height: '1123px', fontFamily: "'Mukta Malar', 'Latha', 'Vijaya', 'Tamil MN', 'Arial', sans-serif" }}
    >
      <div className="w-full h-full flex flex-col justify-between">
        
        {/* 1. Top Header Banner */}
        <div className="flex justify-between items-end h-[120px] pb-2 border-b-2 border-gray-300">
          {/* Left Couple Image */}
          <div className="w-[240px] h-full flex items-end">
            <img src="/hero-couple.png" alt="Couple" className="h-[140%] object-cover object-top origin-bottom" style={{ borderRadius: '0 40px 0 0' }} />
          </div>
          
          {/* Center Logo & Title */}
          <div className="flex-1 flex flex-col items-center justify-end pb-1 px-2">
            <img src="/akshayam_logo.png" alt="Logo" className="h-14 mb-1" />
            <h1 className="text-[26px] font-bold text-emerald-800 font-serif leading-none tracking-tight">அக்ஷயம்</h1>
            <h2 className="text-[17px] font-bold text-red-600 tracking-wide mt-1 leading-tight">கொங்கு திருமணத் தகவல் மையம்</h2>
          </div>

          {/* Right Temple Image */}
          <div className="w-[240px] h-full flex items-end justify-end">
             <img src="/temple.jpg" alt="Temple" className="h-[120%] w-[90%] object-cover object-center origin-bottom-right shadow-sm" />
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex justify-between items-center py-2 px-6 border-b border-gray-300 bg-white h-12 overflow-hidden">
          <div className="flex items-center gap-1.5 font-bold text-[13px] whitespace-nowrap shrink-0">
            <span className="text-emerald-800">📞</span>
            <span className="text-red-600 tracking-wide">96776 13716, 93452 89217</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-800 whitespace-nowrap shrink-0">
            <span>🌐</span> www.akshayamtamilmatrimony.com
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[10px] text-gray-800 whitespace-nowrap shrink-0">
            <span className="text-emerald-800">📍</span> மலைக்கோயில், மங்கலம் ரோடு, திருப்பூர் - 641 604.
          </div>
        </div>

        {/* Registration Bar */}
        <div className="flex justify-between items-center bg-gray-50 border-b-2 border-gray-300 px-6 py-1.5 font-bold text-[13px] text-emerald-950 mt-2">
          <div>Profile ID: {displayId}</div>
          <div>Date Reg: {new Date(profile.createdAt || Date.now()).toLocaleDateString('en-GB')} | Expiry: {new Date(new Date(profile.createdAt || Date.now()).setFullYear(new Date(profile.createdAt || Date.now()).getFullYear() + 1)).toLocaleDateString('en-GB')}</div>
        </div>

        {/* 2. Profile Details & Photo Grid */}
        <div className="flex justify-between w-full gap-4 px-6 pt-2 pb-1">
          {/* Left Text Columns */}
          <div className="w-[550px] pr-2 grid grid-cols-2 gap-x-4 gap-y-0.5 leading-tight text-[11px] text-slate-900 content-start">
            <FieldItem label="பெயர்" value={name} />
            <FieldItem label="குலம்" value={kulam} />
            
            <FieldItem label="பாலினம்" value={profile.gender === 'MALE' ? 'ஆண்' : 'பெண்'} />
            <FieldItem label="தாய் நிலை" value={motherStatus} />
            
            <FieldItem label="வயது" value={`${calculateAge(dob)} வருடம்`} />
            <FieldItem label="சமூக நிலை" value={translateToTamil(family.familyStatus, familyStatusMap)} />
            
            <FieldItem label="திருமண நிலை" value={translateToTamil(profile.maritalStatus, maritalStatusMap)} />
            <FieldItem label="பிறந்த தேதி" value={dob ? new Date(dob).toLocaleDateString('en-GB').replace(/\//g, '-') : 'குறிப்பிடப்படவில்லை'} />
            
            <FieldItem label="பதிவு செய்தவர்" value={profile.profileCreatedBy || "உறவினர்"} />
            <FieldItem label="பிறந்த நேரம்" value={tob} />
            
            <FieldItem label="நிறம்" value={translateToTamil(profile.skinColour, colorMap)} />
            <FieldItem label="பிறந்த கிழமை" value={dayOfBirth} />
            
            <FieldItem label="உயரம்" value={heightStr} />
            <FieldItem label="பிறந்த ஊர்" value={placeOfBirth} />
            
            <FieldItem label="எடை" value={`${profile.weight} கிலோ`} />
            <FieldItem label="கோவில்" value={kovil} />
            
            <FieldItem label="சாதி" value={casteDisplay} />
            <FieldItem label="தந்தை நிலை" value={fatherStatus} />
            
            <FieldItem label="உடன் பிறந்தோர்" value={siblingsDisplay} />
            <FieldItem label="பாதம்" value={padam} />
            
            <FieldItem label="நட்சத்திரம்" value={nakshatra} />
            <FieldItem label="லக்னம்" value={lagnam} />
            
            <FieldItem label="ஜாதகம்" value={dosham} />
            <div />
          </div>

          {/* Right Photo Column (30%) */}
          <div className="w-[180px] flex-shrink-0 flex items-start justify-end">
            <div className="w-full h-[240px] border-2 border-emerald-950 p-[2px] bg-white">
              {profile.photoUrl ? (
                <img crossOrigin="anonymous" src={`/api/proxy-image?url=${encodeURIComponent(profile.photoUrl)}`} alt="Profile" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Astrology Charts & Center QR Code */}
        <div className="flex items-center justify-between gap-4 my-2 w-full px-8">
          <PDFChartBox title="ராசி" houses={rasiHouses} />
          
          <div className="flex flex-col items-center justify-center border-2 border-[#d4af37] rounded-xl p-2 relative w-[160px] h-[160px]">
            <div className="text-[9px] font-bold text-emerald-800 mb-1">www.akshayamtamilmatrimony.com</div>
            <div className="bg-white p-1 rounded-md">
              <QRCode value={profileUrl} size={110} level="M" fgColor="#004d25" />
            </div>
            {/* Center Logo Overlay for QR */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-sm p-0.5">
               <img src="/akshayam_logo.png" className="w-6 h-6 object-contain opacity-90" />
            </div>
            <div className="text-[9px] font-bold text-emerald-800 mt-1">www.akshayamtamilmatrimony.com</div>
          </div>

          <PDFChartBox title="நவாம்சம்" houses={amsamHouses} />
        </div>

        {/* 4. Bottom Career & Family Details */}
        <div className="flex px-6 py-1 gap-4">
          <div className="flex-1 flex flex-col gap-0.5">
            <FieldRow label="ஜனன கால தகவல்" value={dasaBalance} />
            <FieldRow label="படிப்பு - விவரங்கள்" value={profile.educations?.map((e: any) => e.degreeName || e.degree).filter(Boolean).join(', ') || "-"} />
            <FieldRow label="மாத வருமானம்" value={income} />
            <FieldRow label="சொத்து விவரம்" value={propertyStr} />
            <FieldRow label="பொழுதுபோக்கு" value={profile.hobbies || "-"} />
            <FieldRow label="நட்சத்திரங்கள்" value={profile.poruthaNakshatram?.length ? profile.poruthaNakshatram.join(', ') : "Any"} />
            <FieldRow label="எதிர்பார்ப்பு" value={profile.expectations || "நல்ல வாழ்க்கைத்துணை"} />
            <FieldRow label="ராகு கேது ஜாதகம்" value={profile.dosham === 'RAHU_KETU' ? "உண்டு" : "-"} />
            <div className="grid grid-cols-[130px_10px_1fr] mt-1 text-[11px] leading-tight">
              <div className="font-bold text-emerald-950">தொடர்பு எண்</div>
              <div className="font-bold text-emerald-950 text-center">:</div>
              <div className="font-bold text-red-600">+91 {profile.user?.mobile_no || "96776 13716, 93452 89217"}</div>
            </div>
          </div>
          <div className="w-[280px] flex flex-col gap-0.5 pt-5">
            <FieldRow label="பணியின் விவரம்" value={occupationStr} labelWidth="w-[100px]" valueWidth="w-[160px]" />
            <FieldRow label="பணியிடம்" value={family.workingAddress || profile.occupations?.[0]?.companyLocation || nativePlace} labelWidth="w-[100px]" valueWidth="w-[160px]" />
          </div>
        </div>

        {/* 5. Akshayam Services Footer Box */}
        <div className="mx-6 mt-auto mb-2 min-h-[120px] flex-shrink-0 flex flex-col justify-end">
          <div className="bg-[#fdfbf2] border-[1.5px] border-emerald-900 rounded-lg p-2.5 relative flex justify-between">
            {/* Left List */}
            <div className="w-[45%] flex flex-col gap-0.5 text-[10px] font-bold text-gray-800 pl-4">
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> ஜாதகம் பதிவு</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> வாழை மரம்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> ஐயர்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> மாங்கல்ய வாத்தியம்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> சீர்வரிசை தட்டு</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> சமையல் கேட்டரிங் பொருட்கள்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> காய்கறி, காயான்</div>
            </div>
            
            {/* Center Ornamental Divider */}
            <div className="absolute top-4 bottom-4 left-1/2 border-l-[1.5px] border-emerald-800 border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#fdfbf2] py-2">
               <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 0L14.5 10L24 12.5L14.5 15L12 25L9.5 15L0 12.5L9.5 10L12 0Z" fill="#065f46"/>
                 <circle cx="12" cy="12.5" r="3" fill="#fdfbf2"/>
               </svg>
            </div>

            {/* Right List */}
            <div className="w-[45%] flex flex-col gap-0.5 text-[10px] font-bold text-gray-800 pr-2">
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> பால், தயிர், நெய்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> பால் கோவா, பன்னீர்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> இங்கிலிஷ் காய்கறிகள்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> தண்ணீர் 300 ml to 20 லிட்டர்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> டெக்கரேஷன்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> போட்டோ வீடியோ</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> ஐஸ்கிரீம், பீடா, பழங்கள்</div>
               <div className="flex items-start gap-2"><span className="text-red-600 text-[10px] mt-0.5">▶</span> கரும்பு ஜூஸ் மற்றும் பல</div>
            </div>
          </div>
          
          {/* Bottom Dark Green Bar */}
          <div className="bg-[#004d25] text-white text-center rounded-b-lg py-1.5 mt-[-4px] z-10 relative">
             <div className="text-[12px] font-bold tracking-wide">காய்கறி, காய்பான் அனைத்தும் சிறந்த முறையில் செய்து தருகிறோம்.</div>
             <div className="text-[10px] font-medium flex items-center justify-center gap-1 mt-0.5">
               <span>🌐</span> www.akshayamtamilmatrimony.com
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

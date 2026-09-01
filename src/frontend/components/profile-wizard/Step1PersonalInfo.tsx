'use client'

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/backend/schema';
import { Gender, PhysicalCondition, MaritalStatus, FamilyStatus, Habit } from '../../../../generated/prisma/client/browser';
import { z } from 'zod';
import { savePersonalInfo } from '@/backend/actions/profile';
import { useState, useEffect, useRef } from 'react';
import { extractAstrologyData } from '@/backend/actions/extractAstrology';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { FileUpload } from '../FileUpload';
import { rasiOptions, nakshatraByRasi } from '@/frontend/utils/astrology';
import { formTranslations } from '@/frontend/utils/formTranslations';
import { RELIGION_OPTIONS, CASTE_OPTIONS, SUB_CASTE_OPTIONS, translateTerm } from '@/constants/demographics';

type FormValues = z.infer<typeof personalInfoSchema>;

const formatDob = (dobVal: any) => {
  if (!dobVal) return '';
  try {
    const d = new Date(dobVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};


const KVG_KOOTTAMS = ["Aandai (ஆந்தை)","Aadar (ஆடர்)","Aadhi (ஆதி / ஆதிக்குலம்)","Aadhirai (ஆதிரை)","Aadhitreya Kumban (ஆதித்தேய கும்பன்)","Aanthuvan (அந்துவன்)","Aavan (ஆவன்)","Agini / Akini (அக்கினி)","Alagan / Azhagu (அழகன் / அழகு)","Anangan (அனகன் / அனங்கன்)","Ariyan / Ashariyan (ஆரியன் / அஷரியன்)","Bharatan (பாரதன்)","Bramman (பிரம்மா)","Dananjayan / Thananjayan (தனஞ்செயன்)","Danavantan (தனவந்தன்)","Devendran (தேவேந்திரன்)","Eenjan (ஈஞ்சன்)","Ennai (எண்ணை)","Kaadan (காடன்)","Kaadai (காடை)","Kaari (காரி)","Kalingarayan (காலிங்கராயன் - Royal title/Lineage)","Kanavalan (கணவாளன்)","Kanakkan (கணக்கன்)","Kannan (கண்ணன்)","Kannanthai / Kananthai (கண்ணாந்தை)","Keeran (கீரன்)","Koorai (கூறை)","Koovendhar (கோவேந்தர்)","Kuzhalayan / Kuzhayar (குழையன்)","Maadar (மாடர்)","Maadai (மாடை)","Maniyan (மணியன்)","Mayilar / Mayilan (மயிலர் / மயிலான்)","Medhi / Moti (மேதி / மோதி)","Mulan (மூலன்)","Mutthan (முத்தன்)","Muzhukathan / Mulukadhan (முழுக்காதன்)","Neerunniyar (நீருண்ணியர்)","Ozukkar (ஒழுக்கர்)","Oothaalar / Odhaalar (ஓதாளர்)","Pallavarayan (பல்லவராயன்)","Panagkaadar (பனங்காடர்)","Panayan / Panaiyar (பணையன்)","Pandiyan (பாண்டியன்)","Pannai (பண்ணை)","Pathariar (பதறியர்)","Pathuman (பதுமன்)","Pavazhalar / Pavazhar (பவழர்)","Payiran (பயிரன்)","Periyan (பெரியன்)","Perunkudi (பெருங்குடி)","Pillar (பில்லர்)","Podiyan (பொடியன்)","Ponnar / Ponnan (பொன்னர் / பொன்னன்)","Poochadhai / Poochanthai (பூச்சந்தை)","Poodhiyan / Puthan (பூதியன் / புதன்)","Poosan (பூசன்)","Poondhai / Punnai (பூந்தை / புன்னை)","Porulaanthai / Porulthantha (பொருளாந்தை)","Saakadai (சாகாடை)","Sariyan / San (சரியன் / சன்)","Sathanthai / Sathandhai (சாத்தந்தை)","Sathuvaraayan (சத்துவராயன்)","Sanagan (சனகன்)","Sedan (சேடன்)","Sellan / Selvan (செல்லன் / செல்வன்)","Sembonn (செம்பொன்)","Sempoothan / Sembuthan (செம்பூதன்)","Semvan (செம்வன்)","Sengannan / Cenkannan (செங்கண்ணன்)","Sengunni / Senkunnier (செங்குன்னி)","Seralan (சேரலன்)","Seran / Cheran (சேரன்)","Sevadi (சேவடி)","Sevvayan / Sevvaayar (செவ்வாயர்)","Sevvandhi (செவ்வந்தி)","Silamban (சிலம்பன்)","Soman (சோமன்)","Soolan (சூலன்)","Sooriyan / Suriyan (சூரியன்)","Sothi (சோதி)","Sowriyan (சவுறியன்)","Surapi (சுரபி)","Thanakkavan (தனக்கவன்)","Thavalayan (தவளையன்)","Thazhinji / Taliyinji (தழிஞ்சி)","Themaan (தேமான்)","Thodai / Thodar (தோடை / தோடர்)","Thooran (தூரன்)","Thorakkan (தொரக்கன்)","Thunduman (துண்டுமன்)","Uvanan (உவணன்)","Uzhavan / Uzhuvar (உழவன்)","Urugalan (உறுகலன்)","Vaanan / Vaani (வாணன் / வாணி)","Vaanavarayar (வானவராயர் - Royal clan)","Vannakkan (வண்ணக்கன்)","Veliyan (வெளியன்)","Vellamban (வெள்ளம்பர்)","Vendhai / Venduvan (வெந்தை / வெண்டுவன்)","Viliyan / Vilayan (விளையன்)","Villi (வில்லி)","Vilosanan (விலோசனன்)","Viradhan (விரதன்)","Viraivulan (விரைவுலன்)","Vizhiyar (விழியர்)","Vennag / Vennai (வெண்ணங் / வெண்ணை)"];

export function Step1PersonalInfo({ onNext, language = 'TA', initialData, onGenderChange }: { onNext: () => void; language?: 'TA' | 'EN'; initialData?: any; onGenderChange?: (gender: string) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dobText, setDobText] = useState(() => {
    const d = initialData?.profile?.dob;
    if (!d) return '';
    if (typeof d === 'string') {
      if (d.includes('-')) {
        const parts = d.split('-');
        if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
        return d;
      }
    }
    try {
      const dateObj = new Date(d);
      if (!isNaN(dateObj.getTime())) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${day}-${m}-${y}`;
      }
    } catch (e) {}
    return '';
  });
  const [tobTime, setTobTime] = useState('');
  const [tobAmPm, setTobAmPm] = useState('AM');
  const t = formTranslations[language || 'TA'];
  const profile = initialData?.profile;
  
  const [religions, setReligions] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [subcastes, setSubcastes] = useState<any[]>([]);
  
  const [loadingReligions, setLoadingReligions] = useState(true);
  const [loadingCastes, setLoadingCastes] = useState(false);
  const [loadingSubcastes, setLoadingSubcastes] = useState(false);
  
  const schema = initialData ? personalInfoSchema : personalInfoSchema.superRefine((data, ctx) => {
    if (!data.mobileNo || data.mobileNo.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mobile number required (min 10 digits)',
        path: ['mobileNo']
      });
    }
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password required (min 6 chars)',
        path: ['password']
      });
    }
  });

  const { register, control, handleSubmit, setValue, formState: { errors, isDirty }, watch } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      mobileNo: initialData?.mobile_no || '',
      email: initialData?.email || '',
      name: profile?.name || '',
      gender: profile?.gender || 'MALE',
      livingCountry: profile?.livingCountry || 'India',
      state: profile?.state || 'Tamil Nadu',
      city: profile?.city || '',
      houseAddress: profile?.houseAddress || '',
      houseLocation: profile?.houseLocation || '',
      religion: profile?.religion || 'Hindu',
      caste: profile?.caste || 'Kongu Vellalar',
      subCaste: profile?.subCaste || '',
      koottam: profile?.koottam || '',
      dob: formatDob(profile?.dob),
      tob: profile?.tob || '',
      lob: profile?.lob || '',
      height: profile?.height || undefined,
      weight: profile?.weight || undefined,
      physicalCondition: profile?.physicalCondition || 'AVERAGE',
      skinColour: profile?.skinColour || '',
      maritalStatus: profile?.maritalStatus || 'NEVER_MARRIED',
      familyStatus: profile?.familyStatus || 'MIDDLE',
      foodHabits: profile?.foodHabits || 'NONE',
      drinkingHabits: profile?.drinkingHabits || 'NONE',
      smokingHabits: profile?.smokingHabits || 'NONE',
      rasi: profile?.rasi || '',
      hidePhoto: profile?.hidePhoto || false,
      nakshatra: profile?.nakshatra || '',
      poruthaNakshatram: profile?.poruthaNakshatram || [],
      dosham: profile?.dosham || 'None',
      photoUrl: profile?.photoUrl || '',
      jathakamUrl: profile?.jathakamUrl || '',
      casteCertificateUrl: profile?.casteCertificateUrl || '',
      hideMobileNo: profile?.hideMobileNo !== undefined ? profile?.hideMobileNo : true,
      hideHouseAddress: profile?.hideHouseAddress !== undefined ? profile?.hideHouseAddress : true,
      hideHouseLocation: profile?.hideHouseLocation !== undefined ? profile?.hideHouseLocation : true,
      haveChildren: profile?.haveChildren ?? undefined,
      numberOfChildren: profile?.numberOfChildren ?? undefined,
      childrenGender: profile?.childrenGender || '',
      childrenAge: profile?.childrenAge || '',
      educations: profile?.educations && profile.educations.length > 0 ? profile.educations.map((e: any) => ({
        level: e.level || '',
        degreeName: e.degreeName || '',
        institution: e.institution || ''
      })) : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations"
  });

  const dob = watch('dob');
  const gender = watch('gender');
  
  useEffect(() => {
    if (onGenderChange && gender) {
      onGenderChange(gender);
    }
  }, [gender, onGenderChange]);

  const selectedReligion = watch('religion');
  const selectedCaste = watch('caste');
  const selectedSubCaste = watch('subCaste');
  
  const showKoottam = (selectedCaste && (selectedCaste.toLowerCase().includes('gounder') || selectedCaste.toLowerCase().includes('kongu vellala'))) || 
                      (selectedSubCaste && (selectedSubCaste.toLowerCase().includes('gounder') || selectedSubCaste.toLowerCase().includes('kongu vellala')));

  const koottamRef = useRef<any>(null);
  
  useEffect(() => {
    if (selectedCaste === 'Kongu Vellala Gounder') {
      setValue('subCaste', ''); // Bypass subcaste
      setTimeout(() => {
        if (koottamRef.current) {
          koottamRef.current.focus();
        }
      }, 100);
    }
  }, [selectedCaste, setValue]);


  useEffect(() => {
    let isMounted = true;
    const fetchReligions = async () => {
      setLoadingReligions(true);
      try {
        const res = await fetch('/api/taxonomy/religions', { cache: 'no-store' });
        const data = await res.json();
        if (isMounted) {
          setReligions(Array.isArray(data) && data.length > 0 ? data : RELIGION_OPTIONS);
        }
      } catch (error) {
        console.error('Error fetching religions:', error);
        if (isMounted) setReligions(RELIGION_OPTIONS);
      } finally {
        if (isMounted) setLoadingReligions(false);
      }
    };
    fetchReligions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedReligion) {
      setCastes([]);
      return;
    }
    let isMounted = true;
    const fetchCastes = async () => {
      setLoadingCastes(true);
      try {
        const res = await fetch(`/api/taxonomy/castes?religion=${encodeURIComponent(selectedReligion)}`, { cache: 'no-store' });
        const data = await res.json();
        if (isMounted) {
          let casteList = Array.isArray(data) && data.length > 0 ? data : CASTE_OPTIONS;
          if (selectedReligion.toLowerCase() === 'hindu') {
            const kongu = casteList.find(c => c.value === 'Kongu Vellala Gounder' || c === 'Kongu Vellala Gounder') || { value: 'Kongu Vellala Gounder', labelEn: 'Kongu Vellala Gounder', labelTa: 'கொங்கு வேளாள கவுண்டர்' };
            const gounderOther = casteList.find(c => c.value === 'Gounder (Other)' || c === 'Gounder (Other)') || { value: 'Gounder (Other)', labelEn: 'Gounder (Other)', labelTa: 'கவுண்டர் (மற்றவை)' };
            const others = casteList.filter(c => {
              const val = typeof c === 'string' ? c : c.value;
              return val !== 'Kongu Vellala Gounder' && val !== 'Gounder (Other)';
            });
            casteList = [kongu, gounderOther, ...others];
          }
          setCastes(casteList);
        }
      } catch (error) {
        console.error('Error fetching castes:', error);
        if (isMounted) setCastes(CASTE_OPTIONS);
      } finally {
        if (isMounted) setLoadingCastes(false);
      }
    };
    fetchCastes();
    return () => { isMounted = false; };
  }, [selectedReligion]);

  useEffect(() => {
    if (!selectedCaste) {
      setSubcastes([]);
      return;
    }
    let isMounted = true;
    const fetchSubcastes = async () => {
      setLoadingSubcastes(true);
      try {
        const res = await fetch(`/api/taxonomy/subcastes?caste=${encodeURIComponent(selectedCaste)}`, { cache: 'no-store' });
        const data = await res.json();
        if (isMounted) {
          setSubcastes(Array.isArray(data) && data.length > 0 ? data : SUB_CASTE_OPTIONS);
        }
      } catch (error) {
        console.error('Error fetching subcastes:', error);
        if (isMounted) setSubcastes(SUB_CASTE_OPTIONS);
      } finally {
        if (isMounted) setLoadingSubcastes(false);
      }
    };
    fetchSubcastes();
    return () => { isMounted = false; };
  }, [selectedCaste]);

  const selectedRasi = watch('rasi');
  const allNakshatras = Object.values(nakshatraByRasi).flat();
  const availableNakshatras = (selectedRasi && nakshatraByRasi[selectedRasi]) ? nakshatraByRasi[selectedRasi] : allNakshatras;

  const uniqueNakshatrasMap = new Map();
  allNakshatras.forEach(n => {
    if (!uniqueNakshatrasMap.has(n.value)) {
      uniqueNakshatrasMap.set(n.value, n);
    }
  });
  const allUniqueNakshatras = Array.from(uniqueNakshatrasMap.values());
  const selectedPoruthaNaks = watch('poruthaNakshatram') || [];

  const togglePoruthaNakshatra = (val: string) => {
    if (selectedPoruthaNaks.includes(val)) {
      setValue('poruthaNakshatram', selectedPoruthaNaks.filter(n => n !== val), { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('poruthaNakshatram', [...selectedPoruthaNaks, val], { shouldValidate: true, shouldDirty: true });
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;

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
  const age = calculateAge(dob);

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) {
      onNext();
      return;
    }
    setIsSaving(true);
    try {
      const res = await savePersonalInfo(data);
      if (res && !res.success) {
        throw new Error(res.error || 'Failed to save personal info');
      }
      onNext();
    } catch (err) {
      console.error(err);
      alert('Error saving data: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleJathakamFileSelect = async (file: File) => {
    setIsExtracting(true);
    try {
      const base64 = await convertFileToBase64(file);
      const base64Data = base64.split(',')[1] || base64;
      const res = await fetch('/api/jathagam/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      const data = await res.json();
      if (data.success && data.jathagamData) {
        setValue('jathagamData', data.jathagamData, { shouldDirty: true });
        
        // Auto-fill newly extracted fields if present
        const jData = data.jathagamData;
        if (jData.name && !watch('name')) setValue('name', jData.name, { shouldDirty: true });
        if (jData.dateOfBirth && !watch('dob')) {
          setValue('dob', jData.dateOfBirth, { shouldDirty: true });
          setDobText(jData.dateOfBirth);
        }
        if (jData.timeOfBirth && !watch('tob')) {
          setValue('tob', jData.timeOfBirth, { shouldDirty: true });
          const parts = jData.timeOfBirth.split(' ');
          if (parts.length === 2) {
             setTobTime(parts[0]);
             setTobAmPm(parts[1].toUpperCase());
          } else {
             setTobTime(jData.timeOfBirth);
          }
        }
        if (jData.placeOfBirth && !watch('lob')) setValue('lob', jData.placeOfBirth, { shouldDirty: true });
        if (jData.rasi && !watch('rasi')) setValue('rasi', jData.rasi, { shouldDirty: true });
        if (jData.nakshatra && !watch('nakshatra')) setValue('nakshatra', jData.nakshatra, { shouldDirty: true });

        if (jData.kulam && !watch('subCaste')) setValue('subCaste', jData.kulam, { shouldDirty: true });
        if (jData.kovil && !watch('houseLocation')) setValue('houseLocation', jData.kovil, { shouldDirty: true });
        if (jData.dasaBalance && !watch('dasaBalance')) setValue('dasaBalance', jData.dasaBalance, { shouldDirty: true });
      }
    } catch (e) {
      console.error(e);
      alert(language === 'TA' ? 'ஜாதகத்தை படிப்பதில் பிழை.' : 'Error extracting Jathakam data.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleJathakamUploadSuccess = (url: string) => {
    setValue('jathakamUrl', url, { shouldValidate: true, shouldDirty: true });
  };

  const inputClass = "mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-base sm:text-sm border py-3 px-4 bg-gray-50 text-gray-900 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 after:content-['*'] after:ml-1 after:text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Account Details (Login Credentials) */}
      <div className="bg-amber-50/70 p-6 rounded-xl shadow-sm border border-amber-200/80 space-y-6">
        <h3 className="text-lg font-bold text-amber-900 border-b border-amber-200/60 pb-2 flex items-center gap-2">
          🔒 {t.accountDetails}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.mobileNo}</label>
            <input 
              type="tel" 
              {...register('mobileNo', { required: 'Mobile number required' })} 
              className={inputClass} 
              placeholder={t.mobileNoPlaceholder} 
            />
            {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo.message}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.password}</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password', { required: 'Password required' })} 
                className={inputClass} 
                placeholder={t.passwordPlaceholder} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
        </div>
      </div>

      {/* Section 1: Basic Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.basicDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.fullName}</label>
            <input {...register('name')} className={inputClass} placeholder={t.fullNamePlaceholder} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.gender}</label>
            <select {...register('gender')} className={inputClass}>
              <option value="MALE">{t.male}</option>
              <option value="FEMALE">{t.female}</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.livingCountry}</label>
            <input {...register('livingCountry')} className={inputClass} placeholder={t.livingCountryPlaceholder} />
            {errors.livingCountry && <p className="text-red-500 text-xs mt-1">{errors.livingCountry.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.state}</label>
            <input {...register('state')} className={inputClass} placeholder={t.statePlaceholder} />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.city}</label>
            <input {...register('city')} className={inputClass} placeholder={t.cityPlaceholder} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>{t.houseAddress}</label>
            <textarea {...register('houseAddress')} className={`${inputClass} resize-none`} rows={2} placeholder={t.houseAddressPlaceholder} />
            <div className="mt-2 flex gap-2 items-center">
              <input {...register('houseLocation')} className={inputClass.replace('mt-2', '') + ' flex-1'} placeholder="https://maps.google.com/..." />
            {errors.houseLocation && <p className="text-red-500 text-xs mt-1">{errors.houseLocation.message as string}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.religion}</label>
            <select 
              {...register('religion', {
                onChange: () => {
                  setValue('caste', '');
                  setValue('subCaste', '');
                }
              })} 
              className={inputClass}
            >
              <option value="">{t.selectReligion}</option>
              {(religions.length ? religions : RELIGION_OPTIONS).map((opt: any) => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const label = typeof opt === 'string' ? translateTerm(opt, language || 'TA') : (language === 'TA' ? opt.labelTa : opt.labelEn);
                return (
                  <option key={value} value={value}>{label}</option>
                );
              })}
            </select>
            {errors.religion && <p className="text-red-500 text-xs mt-1">{errors.religion.message}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.caste}</label>
            <select 
              {...register('caste', { 
                onChange: () => {
                  setValue('subCaste', '');
                }
              })} 
              className={inputClass} 
              disabled={loadingCastes || !selectedReligion}
            >
              <option value="">{loadingCastes ? 'Loading...' : t.selectCaste}</option>
              {(castes.length ? castes : CASTE_OPTIONS).map((opt: any) => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const label = typeof opt === 'string' ? translateTerm(opt, language || 'TA') : (language === 'TA' ? opt.labelTa : opt.labelEn);
                return (
                  <option key={value} value={value}>{label}</option>
                );
              })}
            </select>
          </div>
          {selectedCaste !== 'Kongu Vellala Gounder' && (
            <div>
              <label className={labelClass}>{t.subCaste}</label>
              <select {...register('subCaste')} className={inputClass} disabled={loadingSubcastes || !selectedCaste}>
                <option value="">{loadingSubcastes ? 'Loading...' : t.selectSubCaste}</option>
                {(subcastes.length ? subcastes : SUB_CASTE_OPTIONS).map((opt: any) => {
                  const value = typeof opt === 'string' ? opt : opt.value;
                  const label = typeof opt === 'string' ? translateTerm(opt, language || 'TA') : (language === 'TA' ? opt.labelTa : opt.labelEn);
                  return (
                    <option key={value} value={value}>{label}</option>
                  );
                })}
              </select>
            {errors.subCaste && <p className="text-red-500 text-xs mt-1">{errors.subCaste.message as string}</p>}
            </div>
          )}
          {showKoottam && (
            <div>
              <label className={labelClass}>{t.koottam}</label>
              {selectedCaste === 'Kongu Vellala Gounder' ? (
                <select {...register('koottam')} className={inputClass} ref={(e) => {
                  register('koottam').ref(e);
                  koottamRef.current = e;
                }}>
                  <option value="">{language === 'TA' ? 'கூட்டம் தேர்ந்தெடுக்கவும்' : 'Select Koottam'}</option>
                  {KVG_KOOTTAMS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                  <option value="Other">{language === 'TA' ? 'மற்றவை' : 'Other'}</option>
                </select>
              ) : (
                <input {...register('koottam')} className={inputClass} placeholder={t.koottamPlaceholder} ref={(e) => {
                  register('koottam').ref(e);
                  koottamRef.current = e;
                }} />
              )}
              {errors.koottam && <p className="text-red-500 text-xs mt-1">{errors.koottam.message as string}</p>}
            </div>
          )}
          <div>
            <label className={labelClass}>{t.dob}</label>
            <input 
              type="text" 
              placeholder="DD-MM-YYYY" 
              value={dobText}
              maxLength={10}
              className={inputClass} 
              onChange={(e) => {
                 let val = e.target.value.replace(/[^0-9]/g, '');
                 if (val.length > 2) val = val.slice(0,2) + '-' + val.slice(2);
                 if (val.length > 5) val = val.slice(0,5) + '-' + val.slice(5,9);
                 setDobText(val);
                 if (val.length === 10) {
                    const [d, m, y] = val.split('-');
                    setValue('dob', `${y}-${m}-${d}`);
                 } else {
                    setValue('dob', '');
                 }
              }}
            />
            {age && <p className="text-sm text-primary mt-2 font-bold bg-primary/10 border border-primary/20 p-2.5 rounded-lg inline-block shadow-sm">{age.years} {language === 'TA' ? 'வயது' : 'Years'}, {age.months} {language === 'TA' ? 'மாதங்கள்' : 'Months'}, {age.days} {language === 'TA' ? 'நாட்கள்' : 'Days'}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.tob}</label>
            <div className="mt-2 flex gap-2 items-center">
              <input type="text" placeholder="HH:MM" value={tobTime} className={inputClass.replace('mt-2', '')} maxLength={5} onChange={(e) => {
                 let val = e.target.value.replace(/[^0-9]/g, '');
                 if (val.length > 2) val = val.slice(0,2) + ':' + val.slice(2,4);
                 e.target.value = val;
                 setTobTime(val);
                 setValue('tob', `${val} ${tobAmPm}`);
              }} />
              <select value={tobAmPm} onChange={(e) => { setTobAmPm(e.target.value); setValue('tob', `${tobTime} ${e.target.value}`); }} className={`${inputClass.replace('mt-2', '')} w-24 px-2`}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.lob}</label>
            <input {...register('lob')} className={inputClass} placeholder={t.lobPlaceholder} />
            {errors.lob && <p className="text-red-500 text-xs mt-1">{errors.lob.message as string}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Astrological Details */}
      {selectedReligion?.toLowerCase() === 'hindu' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.astrologicalDetails}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>{t.rasi}</label>
              <select 
                {...register('rasi', {
                  onChange: (e) => {
                    const newRasi = e.target.value;
                    const currentNak = watch('nakshatra');
                    if (newRasi && nakshatraByRasi[newRasi]) {
                      const validNaks = nakshatraByRasi[newRasi].map(n => n.value);
                      if (currentNak && !validNaks.includes(currentNak)) {
                        setValue('nakshatra', '');
                      }
                    }
                  }
                })} 
                className={inputClass}
              >
                <option value="">{t.selectRasi}</option>
                {rasiOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {language === 'TA' ? item.ta : item.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.nakshatra}</label>
              <select {...register('nakshatra')} className={inputClass}>
                <option value="">{t.selectNakshatra}</option>
                {availableNakshatras.map((item) => (
                  <option key={item.value} value={item.value}>
                    {language === 'TA' ? item.ta : item.en}
                  </option>
                ))}
              </select>
            {errors.nakshatra && <p className="text-red-500 text-xs mt-1">{errors.nakshatra.message as string}</p>}
            </div>
            <div>
              <label className={labelClass}>{t.dosham}</label>
              <select {...register('dosham')} className={inputClass}>
                <option value="">{language === 'TA' ? 'தேர்ந்தெடுக்கவும்' : 'Select'}</option>
                <option value="Sutham">{language === 'TA' ? 'சுத்தம்' : 'Sutham'}</option>
                <option value="Rahu Kethu">{language === 'TA' ? 'ராகு கேது' : 'Rahu Kethu'}</option>
                <option value="Chevvai">{language === 'TA' ? 'செவ்வாய்' : 'Chevvai'}</option>
                <option value="Rahu Kethu Chevvai">{language === 'TA' ? 'ராகு கேது செவ்வாய்' : 'Rahu Kethu Chevvai'}</option>
              </select>
            {errors.dosham && <p className="text-red-500 text-xs mt-1">{errors.dosham.message as string}</p>}
            </div>

            {/* Porutha Nakshatram Multi-Select */}
            <div className="md:col-span-3 mt-3 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="block text-sm font-bold text-primary">
                    ✨ {t.poruthaNakshatram}
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">{t.poruthaNakshatramHint}</p>
                </div>
                {selectedPoruthaNaks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setValue('poruthaNakshatram', [], { shouldValidate: true })}
                    className="text-xs text-red-600 font-bold hover:underline self-start sm:self-center"
                  >
                    {language === 'TA' ? 'அனைத்தையும் நீக்கு' : 'Clear All'} ({selectedPoruthaNaks.length})
                  </button>
                )}
              </div>

              {/* Selected Chips */}
              {selectedPoruthaNaks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-background rounded-xl border border-primary/20 shadow-2xs">
                  <span className="text-xs font-bold text-primary self-center mr-1">
                    {language === 'TA' ? 'தேர்ந்தெடுக்கப்பட்டவை:' : 'Selected:'}
                  </span>
                  {selectedPoruthaNaks.map((val) => {
                    const found = allUniqueNakshatras.find(n => n.value === val);
                    return (
                      <span key={val} className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-in zoom-in-95 duration-150">
                        {found ? (language === 'TA' ? found.ta : found.en) : val}
                        <button
                          type="button"
                          onClick={() => togglePoruthaNakshatra(val)}
                          className="hover:bg-primary-light rounded-full w-4 h-4 inline-flex items-center justify-center font-bold"
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Checkbox Grid */}
              <div className="max-h-56 overflow-y-auto border border-gray-300 rounded-xl p-3 bg-gray-50/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 shadow-inner">
                {allUniqueNakshatras.map((item) => {
                  const isChecked = selectedPoruthaNaks.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={() => togglePoruthaNakshatra(item.value)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer text-xs font-bold transition-all select-none border ${
                        isChecked
                          ? 'bg-primary/10 border-primary text-primary shadow-2xs font-extrabold'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-100/70'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div click
                        className="rounded border-gray-300 text-primary focus:ring-[var(--color-primary)] w-4 h-4 pointer-events-none"
                      />
                      <span className="truncate">{language === 'TA' ? item.ta : item.en}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Documents & Photos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{language === 'TA' ? 'ஆவணங்கள்' : 'Documents & Photos'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {selectedReligion?.toLowerCase() === 'hindu' && (
            <div className="flex flex-col gap-2">
              <FileUpload 
                label={t.uploadJathakam} 
                subLabel={t.pdfJpg} 
                bucket="user-documents" 
                onUploadSuccess={handleJathakamUploadSuccess}
                onFileSelect={handleJathakamFileSelect}
                initialUrl={watch('jathakamUrl')}
                required
              />
              {isExtracting && (
                <div className="mt-1 flex items-center justify-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 py-1.5 rounded">
                  <div className="w-3 h-3 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                  {language === 'TA' ? 'ஜாதகம் படிக்கப்படுகிறது...' : 'Extracting details from Jathakam...'}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <FileUpload 
              label={t.uploadPhoto} 
              subLabel={t.clearFace} 
              bucket="profile-photos" 
              onUploadSuccess={(url) => setValue('photoUrl', url, { shouldValidate: true, shouldDirty: true })} 
              initialUrl={watch('photoUrl')}
              required
            />
            {watch('gender') === 'FEMALE' && (
              <div className="flex items-center space-x-2 bg-pink-50 p-2 rounded border border-pink-100">
                <input type="checkbox" {...register('hidePhoto')} className="w-4 h-4 text-pink-600 rounded border-gray-300" id="hidePhoto" />
            {errors.hidePhoto && <p className="text-red-500 text-xs mt-1">{errors.hidePhoto.message as string}</p>}
                <label htmlFor="hidePhoto" className="text-xs font-medium text-gray-700">
                  {language === 'TA' ? 'புகைப்படத்தை மறை (பொது பார்வைக்கு)' : 'Hide photo from public view'}
                </label>
              </div>
            )}
          </div>
          <FileUpload 
            label={t.casteCert} 
            subLabel={t.optional} 
            bucket="user-documents" 
            onUploadSuccess={(url) => setValue('casteCertificateUrl', url, { shouldValidate: true, shouldDirty: true })} 
            initialUrl={watch('casteCertificateUrl')}
            required
          />
          
        </div>
      </div>

      {/* Section 3: Physical Attributes & Lifestyle */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.physicalLifestyle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.height}</label>
            <input type="number" {...register('height', { valueAsNumber: true })} className={inputClass} placeholder={t.heightPlaceholder} />
            {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.weight}</label>
            <input type="number" {...register('weight', { valueAsNumber: true })} className={inputClass} placeholder={t.weightPlaceholder} />
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.physicalCondition}</label>
            <select {...register('physicalCondition')} className={inputClass}>
              <option value="SLIM">{t.slim}</option>
              <option value="AVERAGE">{t.average}</option>
              <option value="FAT">{t.fat}</option>
            </select>
            {errors.physicalCondition && <p className="text-red-500 text-xs mt-1">{errors.physicalCondition.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.skinColour}</label>
            <select {...register('skinColour')} className={inputClass}>
              <option value="">{t.selectColour}</option>
              <option value="Fair">{t.fair}</option>
              <option value="Wheatish">{t.wheatish}</option>
              <option value="Dark">{t.dark}</option>
            </select>
            {errors.skinColour && <p className="text-red-500 text-xs mt-1">{errors.skinColour.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.maritalStatus}</label>
            <select {...register('maritalStatus', { onChange: () => setValue('haveChildren', undefined) })} className={inputClass}>
              <option value="NEVER_MARRIED">{t.neverMarried}</option>
              <option value="DIVORCED">{t.divorced}</option>
              <option value="WIDOWED">{t.widowed}</option>
              <option value="AWAITING_DIVORCE">{t.awaitingDivorce}</option>
            </select>
            {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus.message as string}</p>}
          </div>

          {['DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'].includes(watch('maritalStatus')) && (
            <>
              <div className="md:col-span-2 border-t border-gray-100 mt-2"></div>
              <div>
                <label className={labelClass}>{t.haveChildren}</label>
                <select {...register('haveChildren', { setValueAs: v => v === 'true' ? true : v === 'false' ? false : undefined })} className={inputClass}>
                  <option value="">{language === 'TA' ? 'தேர்ந்தெடுக்கவும்' : 'Select'}</option>
                  <option value="true">{t.yes}</option>
                  <option value="false">{t.no}</option>
                </select>
              </div>

              {watch('haveChildren') === true && (
                <>
                  <div>
                    <label className={labelClass}>{t.numberOfChildren}</label>
                    <input type="number" {...register('numberOfChildren', { valueAsNumber: true })} className={inputClass} placeholder="1" min={1} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.childrenGender}</label>
                    <select {...register('childrenGender')} className={inputClass}>
                      <option value="">{language === 'TA' ? 'தேர்ந்தெடுக்கவும்' : 'Select'}</option>
                      <option value="Boy">{t.boy}</option>
                      <option value="Girl">{t.girl}</option>
                      <option value="Both">{language === 'TA' ? 'ஆண் & பெண் (Both)' : 'Both'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t.childrenAge}</label>
                    <input type="text" {...register('childrenAge')} className={inputClass} placeholder={language === 'TA' ? 'எ.கா. 5 வயது' : 'e.g. 5 years'} />
                  </div>
                </>
              )}
              <div className="md:col-span-2 border-b border-gray-100 mb-2"></div>
            </>
          )}

          <div>
            <label className={labelClass}>{t.familyStatus}</label>
            <select {...register('familyStatus')} className={inputClass}>
              <option value="LOW">{t.lowFamily}</option>
              <option value="MIDDLE">{t.middle}</option>
              <option value="UPPER_MIDDLE">{t.upperMiddle}</option>
              <option value="HIGH">{t.highClass}</option>
              <option value="VIP">{t.vip}</option>
            </select>
            {errors.familyStatus && <p className="text-red-500 text-xs mt-1">{errors.familyStatus.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.foodHabits}</label>
            <select {...register('foodHabits')} className={inputClass}>
              <option value="NONE">{t.veg}</option>
              <option value="OCCASIONAL">{t.occNonVeg}</option>
              <option value="REGULAR">{t.regNonVeg}</option>
            </select>
            {errors.foodHabits && <p className="text-red-500 text-xs mt-1">{errors.foodHabits.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.drinkingHabits}</label>
            <select {...register('drinkingHabits')} className={inputClass}>
              <option value="NONE">{t.no}</option>
              <option value="OCCASIONAL">{t.occasional}</option>
              <option value="REGULAR">{t.regular}</option>
            </select>
            {errors.drinkingHabits && <p className="text-red-500 text-xs mt-1">{errors.drinkingHabits.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.smokingHabits}</label>
            <select {...register('smokingHabits')} className={inputClass}>
              <option value="NONE">{t.no}</option>
              <option value="OCCASIONAL">{t.occasional}</option>
              <option value="REGULAR">{t.regular}</option>
            </select>
            {errors.smokingHabits && <p className="text-red-500 text-xs mt-1">{errors.smokingHabits.message as string}</p>}
          </div>
        </div>
      </div>

      {/* Section 4: Education & Privacy */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">{t.educationDetails}</h3>
          <button type="button" onClick={() => append({ level: '', degreeName: '', institution: '' })} className="flex items-center space-x-1 text-sm text-red-600 font-semibold hover:text-red-700">
            <Plus className="w-4 h-4" />
            <span>{t.addEducation}</span>
          </button>
        </div>
        
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">{t.noEducation}</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border relative group">
            <div>
              <label className="block text-xs font-semibold text-gray-600">{t.level}</label>
              <select {...register(`educations.${index}.level` as const)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-sm border p-2 text-gray-900">
                <option value="">{t.selectLevel}</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600">{t.degreeName}</label>
              <input {...register(`educations.${index}.degreeName` as const)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-sm border p-2 text-gray-900" placeholder={t.degreePlaceholder} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600">{t.institution}</label>
              <input {...register(`educations.${index}.institution` as const)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-sm border p-2 text-gray-900" placeholder={t.instPlaceholder} />
            </div>
            <button type="button" onClick={() => remove(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}


      </div>
      

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" disabled={isSaving} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold shadow-md transition-all active:scale-95 cursor-pointer">
          {isSaving 
            ? t.saving 
            : !isDirty 
            ? (language === 'TA' ? 'தொடர்க →' : 'Continue →') 
            : initialData 
            ? (language === 'TA' ? 'புதுப்பித்து தொடர்க →' : 'Update & Continue →')
            : t.saveContinue}
        </button>
      </div>
    </form>
  );
}

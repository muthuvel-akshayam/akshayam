'use client'

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/backend/schema';
import { Gender, PhysicalCondition, MaritalStatus, FamilyStatus, Habit } from '../../../../generated/prisma/client/browser';
import { z } from 'zod';
import { savePersonalInfo } from '@/backend/actions/profile';
import { useState, useEffect } from 'react';
import { extractAstrologyData } from '@/backend/actions/extractAstrology';
import { Plus, Trash2 } from 'lucide-react';
import { FileUpload } from '../FileUpload';
import { rasiOptions, nakshatraByRasi } from '@/frontend/utils/astrology';
import { formTranslations } from '@/frontend/utils/formTranslations';
import { RELIGION_OPTIONS, CASTE_OPTIONS, SUB_CASTE_OPTIONS } from '@/constants/demographics';

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

export function Step1PersonalInfo({ onNext, language = 'TA', initialData, onGenderChange }: { onNext: () => void; language?: 'TA' | 'EN'; initialData?: any; onGenderChange?: (gender: string) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const t = formTranslations[language || 'TA'];
  const profile = initialData?.profile;
  
  const [religions, setReligions] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [subcastes, setSubcastes] = useState<any[]>([]);
  
  const [loadingReligions, setLoadingReligions] = useState(true);
  const [loadingCastes, setLoadingCastes] = useState(false);
  const [loadingSubcastes, setLoadingSubcastes] = useState(false);
  
  const { register, control, handleSubmit, setValue, formState: { errors, isDirty }, watch } = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema) as any,
    defaultValues: {
      mobileNo: initialData?.mobile_no || '',
      email: initialData?.email || '',
      name: profile?.name || '',
      gender: profile?.gender || 'MALE',
      livingCountry: profile?.livingCountry || 'India',
      state: profile?.state || 'Tamil Nadu',
      city: profile?.city || '',
      houseAddress: profile?.houseAddress || '',
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
          setCastes(Array.isArray(data) && data.length > 0 ? data : CASTE_OPTIONS);
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

  const handleJathakamUpload = async (url: string) => {
    setValue('jathakamUrl', url, { shouldValidate: true, shouldDirty: true });
    try {
      const res = await extractAstrologyData(url);
      if (res.success && res.data) {
        setValue('rasiGrid', res.data.rasiGrid, { shouldDirty: true });
        setValue('amsamGrid', res.data.amsamGrid, { shouldDirty: true });
        setValue('dasaBalance', res.data.dasaBalance, { shouldDirty: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const inputClass = "mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 sm:text-sm border p-3 bg-gray-50 text-gray-900 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Account Details (Login Credentials) */}
      <div className="bg-amber-50/70 p-6 rounded-xl shadow-sm border border-amber-200/80 space-y-6">
        <h3 className="text-lg font-bold text-amber-900 border-b border-amber-200/60 pb-2 flex items-center gap-2">
          🔒 {t.accountDetails}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.mobileNo} <span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              {...register('mobileNo', { required: 'Mobile number required' })} 
              className={inputClass} 
              placeholder={t.mobileNoPlaceholder} 
            />
            {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo.message}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.password} <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              {...register('password', { required: 'Password required' })} 
              className={inputClass} 
              placeholder={t.passwordPlaceholder} 
            />
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
          </div>
          <div>
            <label className={labelClass}>{t.livingCountry}</label>
            <input {...register('livingCountry')} className={inputClass} placeholder={t.livingCountryPlaceholder} />
          </div>
          <div>
            <label className={labelClass}>{t.state}</label>
            <input {...register('state')} className={inputClass} placeholder={t.statePlaceholder} />
          </div>
          <div>
            <label className={labelClass}>{t.city}</label>
            <input {...register('city')} className={inputClass} placeholder={t.cityPlaceholder} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>{t.houseAddress}</label>
            <textarea {...register('houseAddress')} className={`${inputClass} resize-none`} rows={2} placeholder={t.houseAddressPlaceholder} />
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
                const label = typeof opt === 'string' ? opt : (language === 'TA' ? opt.labelTa : opt.labelEn);
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
                const label = typeof opt === 'string' ? opt : (language === 'TA' ? opt.labelTa : opt.labelEn);
                return (
                  <option key={value} value={value}>{label}</option>
                );
              })}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.subCaste}</label>
            <select {...register('subCaste')} className={inputClass} disabled={loadingSubcastes || !selectedCaste}>
              <option value="">{loadingSubcastes ? 'Loading...' : t.selectSubCaste}</option>
              {(subcastes.length ? subcastes : SUB_CASTE_OPTIONS).map((opt: any) => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const label = typeof opt === 'string' ? opt : (language === 'TA' ? opt.labelTa : opt.labelEn);
                return (
                  <option key={value} value={value}>{label}</option>
                );
              })}
            </select>
          </div>
          {showKoottam && (
            <div>
              <label className={labelClass}>{t.koottam}</label>
              <input {...register('koottam')} className={inputClass} placeholder={t.koottamPlaceholder} />
            </div>
          )}
          <div>
            <label className={labelClass}>{t.dob}</label>
            <input type="date" {...register('dob')} className={inputClass} />
            {age && <p className="text-sm text-primary mt-2 font-bold bg-primary/10 border border-primary/20 p-2.5 rounded-lg inline-block shadow-sm">{age.years} {language === 'TA' ? 'வயது' : 'Years'}, {age.months} {language === 'TA' ? 'மாதங்கள்' : 'Months'}, {age.days} {language === 'TA' ? 'நாட்கள்' : 'Days'}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.tob}</label>
            <input type="time" {...register('tob')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t.lob}</label>
            <input {...register('lob')} className={inputClass} placeholder={t.lobPlaceholder} />
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
            </div>
            <div>
              <label className={labelClass}>{t.dosham}</label>
              <select {...register('dosham')} className={inputClass}>
                <option value="None">{t.none}</option>
                <option value="Chevvai">{t.chevvai}</option>
                <option value="Rahu-Ketu">{t.rahuKetu}</option>
              </select>
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
            <FileUpload 
              label={t.uploadJathakam} 
              subLabel={t.pdfJpg} 
              bucket="user-documents" 
              onUploadSuccess={handleJathakamUpload} 
              initialUrl={watch('jathakamUrl')}
            />
          )}
          <div className="flex flex-col gap-2">
            <FileUpload 
              label={t.uploadPhoto} 
              subLabel={t.clearFace} 
              bucket="profile-photos" 
              onUploadSuccess={(url) => setValue('photoUrl', url, { shouldValidate: true, shouldDirty: true })} 
              initialUrl={watch('photoUrl')}
            />
            {watch('gender') === 'FEMALE' && (
              <div className="flex items-center space-x-2 bg-pink-50 p-2 rounded border border-pink-100">
                <input type="checkbox" {...register('hidePhoto')} className="w-4 h-4 text-pink-600 rounded border-gray-300" id="hidePhoto" />
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
          </div>
          <div>
            <label className={labelClass}>{t.weight}</label>
            <input type="number" {...register('weight', { valueAsNumber: true })} className={inputClass} placeholder={t.weightPlaceholder} />
          </div>
          <div>
            <label className={labelClass}>{t.physicalCondition}</label>
            <select {...register('physicalCondition')} className={inputClass}>
              <option value="SLIM">{t.slim}</option>
              <option value="AVERAGE">{t.average}</option>
              <option value="FAT">{t.fat}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.skinColour}</label>
            <select {...register('skinColour')} className={inputClass}>
              <option value="">{t.selectColour}</option>
              <option value="Fair">{t.fair}</option>
              <option value="Wheatish">{t.wheatish}</option>
              <option value="Dark">{t.dark}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.maritalStatus}</label>
            <select {...register('maritalStatus')} className={inputClass}>
              <option value="NEVER_MARRIED">{t.neverMarried}</option>
              <option value="DIVORCED">{t.divorced}</option>
              <option value="WIDOWED">{t.widowed}</option>
              <option value="AWAITING_DIVORCE">{t.awaitingDivorce}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.familyStatus}</label>
            <select {...register('familyStatus')} className={inputClass}>
              <option value="LOW">{t.lowFamily}</option>
              <option value="MIDDLE">{t.middle}</option>
              <option value="UPPER_MIDDLE">{t.upperMiddle}</option>
              <option value="HIGH">{t.highClass}</option>
              <option value="VIP">{t.vip}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.foodHabits}</label>
            <select {...register('foodHabits')} className={inputClass}>
              <option value="NONE">{t.veg}</option>
              <option value="OCCASIONAL">{t.occNonVeg}</option>
              <option value="REGULAR">{t.regNonVeg}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.drinkingHabits}</label>
            <select {...register('drinkingHabits')} className={inputClass}>
              <option value="NONE">{t.no}</option>
              <option value="OCCASIONAL">{t.occasional}</option>
              <option value="REGULAR">{t.regular}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.smokingHabits}</label>
            <select {...register('smokingHabits')} className={inputClass}>
              <option value="NONE">{t.no}</option>
              <option value="OCCASIONAL">{t.occasional}</option>
              <option value="REGULAR">{t.regular}</option>
            </select>
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
      
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 font-bold">
                {language === 'TA' ? 'தயவுசெய்து பின்வரும் தவறுகளை சரிசெய்யவும்:' : 'Please fix the following errors:'}
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-red-700">
                {Object.values(errors).map((err: any, idx) => (
                  <li key={idx}>{err.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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

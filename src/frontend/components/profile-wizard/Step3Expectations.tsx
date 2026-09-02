'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expectationsSchema } from '@/backend/schema';
import { z } from 'zod';
import { saveExpectations } from '@/backend/actions/profile';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { formTranslations } from '@/frontend/utils/formTranslations';

type FormValues = z.infer<typeof expectationsSchema>;

export function Step3Expectations({ onPrev, onNext, language = 'TA', initialData, gender }: { onPrev: () => void; onNext?: () => void; language?: 'TA' | 'EN'; initialData?: any; gender?: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const t = formTranslations[language || 'TA'];
  const exp = initialData?.expectations;
  const isBusinessSelected = exp?.preferredSectors?.some((s: string) => ['Farmer', 'Garments', 'Other (Business)'].includes(s));
  const [careerType, setCareerType] = useState<'JOB' | 'BUSINESS'>(isBusinessSelected ? 'BUSINESS' : 'JOB');
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(expectationsSchema) as any,
    defaultValues: {
      expectedHeight: exp?.expectedHeight || undefined,
      colourPreference: exp?.colourPreference || '',
      maxAgeLimit: exp?.maxAgeLimit || undefined,
      dowryExpectation: exp?.dowryExpectation || '',
      preferredSectors: exp?.preferredSectors || [],
      preferredLocations: exp?.preferredLocations || [],
      expectedIncome: exp?.expectedIncome || '',
      expectsRentalIncome: exp?.expectsRentalIncome || false,
      expectsThottam: exp?.expectsThottam || false,
      expectsVacantLand: exp?.expectsVacantLand || false,
      acceptsDivorced: exp?.acceptsDivorced || false,
      preferredDistanceRadius: exp?.preferredDistanceRadius || undefined,
      city: exp?.city || '',
      comments: exp?.comments || ''
    }
  });

  const preferredSectors = watch('preferredSectors') || [];
  const preferredLocations = watch('preferredLocations') || [];
  const expectsRentalIncome = watch('expectsRentalIncome');
  const expectsThottam = watch('expectsThottam');
  const expectsVacantLand = watch('expectsVacantLand');
  const acceptsDivorced = watch('acceptsDivorced');

  const toggleSector = (sector: string) => {
    if (preferredSectors.includes(sector)) {
      setValue('preferredSectors', preferredSectors.filter(s => s !== sector), { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('preferredSectors', [...preferredSectors, sector], { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleCareerTypeChange = (type: 'JOB' | 'BUSINESS') => {
    if (type !== careerType) {
      setCareerType(type);
      setValue('preferredSectors', [], { shouldValidate: true, shouldDirty: true });
      if (type === 'BUSINESS') {
        setValue('preferredLocations', [], { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const toggleLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      setValue('preferredLocations', preferredLocations.filter(l => l !== loc), { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('preferredLocations', [...preferredLocations, loc], { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) {
      if (onNext) onNext();
      else router.push('/dashboard');
      return;
    }
    setIsSaving(true);
    try {
      const res = await saveExpectations(data);
      if (res && !res.success) {
        throw new Error(res.error || 'Failed to save expectations');
      }
      alert(language === 'TA' ? 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Profile updated successfully!');
      if (onNext) onNext();
      else router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      alert((language === 'TA' ? 'சேமிக்க முடியவில்லை: ' : 'Failed to save expectations: ') + (err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-base sm:text-sm border py-3 px-4 bg-gray-50 text-gray-900 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 after:content-['*'] after:ml-1 after:text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Basic Expectations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.basicExpectations}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.expectedHeight}</label>
            <input type="number" {...register('expectedHeight', { valueAsNumber: true })} className={inputClass} placeholder="e.g. 160" />
            {errors.expectedHeight && <p className="text-red-500 text-xs mt-1">{errors.expectedHeight.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.colourPref}</label>
            <select {...register('colourPreference')} className={inputClass}>
              <option value="">{t.selectColour}</option>
              <option value="Any">{t.any}</option>
              <option value="Fair">{t.fair}</option>
              <option value="Wheatish">{t.wheatish}</option>
              <option value="Dark">{t.dark}</option>
            </select>
            {errors.colourPreference && <p className="text-red-500 text-xs mt-1">{errors.colourPreference.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.agePref}</label>
            <input type="number" {...register('maxAgeLimit', { valueAsNumber: true })} className={inputClass} placeholder={t.agePrefPlaceholder} />
            {errors.maxAgeLimit && <p className="text-red-500 text-xs mt-1">{errors.maxAgeLimit.message as string}</p>}
          </div>
          {gender !== 'FEMALE' && (
            <div>
              <label className={labelClass}>{t.dowryExpectation}</label>
              <input {...register('dowryExpectation')} className={inputClass} placeholder={t.dowryPlaceholder} />
            {errors.dowryExpectation && <p className="text-red-500 text-xs mt-1">{errors.dowryExpectation.message as string}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Job & Career Preferences */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.jobCareerPref}</h3>
        
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => handleCareerTypeChange('JOB')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${careerType === 'JOB' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {language === 'TA' ? 'வேலை (Job)' : 'Job'}
          </button>
          <button
            type="button"
            onClick={() => handleCareerTypeChange('BUSINESS')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${careerType === 'BUSINESS' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {language === 'TA' ? 'வியாபாரம் (Business)' : 'Business'}
          </button>
        </div>

        {careerType === 'JOB' ? (
          <>
            <div>
              <label className={labelClass + " mb-3"}>Job Preferences</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['IT', 'Doctor', 'Govt', 'Private', 'Garment', 'Other (Job)'].map(sector => (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                      preferredSectors.includes(sector)
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:bg-red-50'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass + " mb-3"}>{t.prefLocations}</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Chennai', 'Bangalore', 'Coimbatore', 'Tiruppur', 'Erode', 'Foreign', 'Anywhere'].map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocation(loc)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                      preferredLocations.includes(loc)
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:bg-red-50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className={labelClass + " mb-3"}>Business Preferences</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Farmer', 'Garments', 'Other (Business)'].map(sector => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => toggleSector(sector)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                    preferredSectors.includes(sector)
                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>{t.expectedMonthlyIncome}</label>
          {watch('expectedIncome')?.startsWith('Custom:') ? (
             <div className="flex gap-2 items-center">
               <input 
                 type="text" 
                 className={inputClass + " flex-1"} 
                 value={watch('expectedIncome')?.replace('Custom:', '') || ''} 
                 onChange={(e) => setValue('expectedIncome', 'Custom:' + e.target.value)} 
                 placeholder={language === 'TA' ? 'வருமானத்தை தட்டச்சு செய்யவும்' : 'Enter amount'} 
               />
               <button type="button" onClick={() => setValue('expectedIncome', '')} className="text-sm text-primary font-bold bg-primary/10 px-3 py-3 rounded-lg mt-2 whitespace-nowrap hover:bg-primary/20">
                 {language === 'TA' ? 'மாற்று' : 'Reset'}
               </button>
             </div>
          ) : (
            <select {...register('expectedIncome')} className={inputClass}>
              <option value="">{t.selectExpectation}</option>
              <option value="Any">{t.doesntMatter}</option>
              <option value="<25k">{language === 'TA' ? '25,000 க்கும் குறைவான' : 'Less than 25,000'}</option>
              <option value="25k-50k">25,000 - 50,000</option>
              <option value="50k-1L">50,000 - 1,00,000</option>
              <option value="1L+">1,00,000+</option>
              <option value="Custom:">{language === 'TA' ? 'மற்றவை (Manual Entry)' : 'Other (Manual Entry)'}</option>
            </select>
          )}
          {errors.expectedIncome && <p className="text-red-500 text-xs mt-1">{errors.expectedIncome.message as string}</p>}
        </div>
      </div>

      {/* Property & Location Expectations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{t.propLocPref}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={() => setValue('expectsRentalIncome', !expectsRentalIncome, { shouldValidate: true })}
              className={`w-full flex justify-between items-center p-4 rounded-lg border transition-all ${expectsRentalIncome ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-rose-400'}`}
            >
              <span className="text-sm font-semibold text-gray-700">{t.expectsRental}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${expectsRentalIncome ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                {expectsRentalIncome && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>

            {(initialData?.profile?.maritalStatus === 'DIVORCED' || initialData?.profile?.maritalStatus === 'WIDOWED' || initialData?.profile?.maritalStatus === 'AWAITING_DIVORCE') && (
              <button
                type="button"
                onClick={() => setValue('acceptsDivorced', !acceptsDivorced, { shouldValidate: true })}
                className={`w-full flex justify-between items-center p-4 rounded-lg border transition-all ${acceptsDivorced ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-rose-400'}`}
              >
                <span className="text-sm font-semibold text-gray-700">{t.acceptsDivorced}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${acceptsDivorced ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                  {acceptsDivorced && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => setValue('expectsThottam', !expectsThottam, { shouldValidate: true })}
              className={`w-full flex justify-between items-center p-4 rounded-lg border transition-all ${expectsThottam ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-rose-400'}`}
            >
              <span className="text-sm font-semibold text-gray-700">{t.expectsThottamReq}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${expectsThottam ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                {expectsThottam && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setValue('expectsVacantLand', !expectsVacantLand, { shouldValidate: true })}
              className={`w-full flex justify-between items-center p-4 rounded-lg border transition-all ${expectsVacantLand ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-rose-400'}`}
            >
              <span className="text-sm font-semibold text-gray-700">{t.expectsVacant}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${expectsVacantLand ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                {expectsVacantLand && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>{t.distancePref}</label>
              <select {...register('preferredDistanceRadius', { valueAsNumber: true })} className={inputClass}>
                <option value="">{t.anyDistance}</option>
                <option value="50">{t.within50}</option>
                <option value="100">{t.within100}</option>
                <option value="250">{t.within250}</option>
                <option value="500">{t.within500}</option>
              </select>
            {errors.preferredDistanceRadius && <p className="text-red-500 text-xs mt-1">{errors.preferredDistanceRadius.message as string}</p>}
            </div>
            <div>
              <label className={labelClass}>{t.prefCity}</label>
              <input {...register('city')} className={inputClass} placeholder={t.prefCityPlaceholder} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className={labelClass}>{t.otherComments}</label>
            <textarea {...register('comments')} className={inputClass} rows={4} placeholder={t.otherCommentsPlaceholder} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button type="button" onClick={onPrev} className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold shadow-sm transition-all active:scale-95">
          {t.back}
        </button>
        <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold shadow-md transition-all active:scale-95 cursor-pointer">
          {isSaving 
            ? t.submitting 
            : !isDirty 
            ? (language === 'TA' ? 'தொடர்க →' : 'Continue →') 
            : initialData 
            ? (language === 'TA' ? 'புதுப்பித்து சேமி →' : 'Update & Save →')
            : t.completeReg}
        </button>
      </div>
    </form>
  );
}

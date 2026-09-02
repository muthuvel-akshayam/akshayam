'use client'

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { familyDetailsSchema } from '@/backend/schema';
import { z } from 'zod';
import { saveFamilyDetails } from '@/backend/actions/profile';
import { useState } from 'react';
import { ParentLivingStatus, WorkNature } from '../../../../generated/prisma/client/browser';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
import { formTranslations } from '@/frontend/utils/formTranslations';

type FormValues = z.infer<typeof familyDetailsSchema>;

export function Step2FamilyDetails({ onNext, onPrev, language = 'TA', initialData, gender }: { onNext: () => void, onPrev: () => void, language?: 'TA' | 'EN', initialData?: any, gender?: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const t = formTranslations[language || 'TA'];
  const family = initialData?.family;
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(familyDetailsSchema) as any,
    defaultValues: {
      fatherName: family?.fatherName || '',
      fatherLivingStatus: family?.fatherLivingStatus || undefined,
      fatherStatus: family?.fatherStatus || '',
      fatherMobile: family?.fatherMobile || '',
      motherName: family?.motherName || '',
      motherLivingStatus: family?.motherLivingStatus || undefined,
      motherStatus: family?.motherStatus || '',
      motherMobile: family?.motherMobile || '',
      workNature: family?.workNature || undefined,
      salary: family?.salary || '',
      organisation: family?.organisation || '',
      designation: family?.designation || '',
      workingAddress: family?.workingAddress || '',
      googleLocation: family?.googleLocation || '',
      rentalIncome: family?.rentalIncome || '',
      houseType: family?.houseType || '',
      houseSqFt: family?.houseSqFt || '',
      siteLand: family?.siteLand || '',
      thottam: family?.thottam || '',
      vacantLand: family?.vacantLand || '',
      totalAssetValue: family?.totalAssetValue || '',
      assetComments: family?.assetComments || '',
      dowryDetails: family?.dowryDetails || '',
      siblings: family?.siblings && family.siblings.length > 0 ? family.siblings.map((s: any) => ({
        name: s.name || '',
        relation: s.relation || '',
        status: s.status || ''
      })) : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "siblings"
  });

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) {
      onNext();
      return;
    }
    setIsSaving(true);
    try {
      const res = await saveFamilyDetails(data);
      if (res && !res.success) {
        throw new Error(res.error || 'Failed to save family details');
      }
      onNext();
    } catch (err) {
      console.error(err);
      alert('Error saving data: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-base sm:text-sm border py-3 px-4 bg-white text-gray-900 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 after:content-['*'] after:ml-1 after:text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Notice Banner */}
      <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-900">{t.privacyNoticeTitle}</h4>
          <p className="text-sm text-red-700 mt-1">{t.privacyNoticeText}</p>
        </div>
      </div>

      {/* Parents Details */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t.parentsDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.fatherName}</label>
            <input {...register('fatherName')} className={inputClass} />
            {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.fatherStatus}</label>
            <select 
              {...register('fatherLivingStatus', {
                onChange: (e) => {
                  if (e.target.value === 'LATE') {
                    setValue('fatherStatus', '', { shouldDirty: true });
                    setValue('fatherMobile', '', { shouldDirty: true });
                  }
                }
              })} 
              className={inputClass}
            >
              <option value="">{t.selectStatus}</option>
              <option value="ALIVE">{t.alive}</option>
              <option value="LATE">{t.late}</option>
            </select>
            {errors.fatherLivingStatus && <p className="text-red-500 text-xs mt-1">{errors.fatherLivingStatus.message as string}</p>}
          </div>
          {watch('fatherLivingStatus') !== 'LATE' && (
            <>
              <div>
                <label className={labelClass}>{t.fatherOcc}</label>
                <input {...register('fatherStatus')} className={inputClass} placeholder={t.fatherOccPlaceholder} />
                {errors.fatherStatus && <p className="text-red-500 text-xs mt-1">{errors.fatherStatus.message as string}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.fatherMobile}</label>
                <input type="tel" {...register('fatherMobile')} className={inputClass} placeholder={t.privacyProtectedPlaceholder} />
                {errors.fatherMobile && <p className="text-red-500 text-xs mt-1">{errors.fatherMobile.message as string}</p>}
              </div>
            </>
          )}
          
          <div className="md:col-span-2"><hr className="my-2 border-gray-200" /></div>
          
          <div>
            <label className={labelClass}>{t.motherName}</label>
            <input {...register('motherName')} className={inputClass} />
            {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.motherStatus}</label>
            <select 
              {...register('motherLivingStatus', {
                onChange: (e) => {
                  if (e.target.value === 'LATE') {
                    setValue('motherStatus', '', { shouldDirty: true });
                    setValue('motherMobile', '', { shouldDirty: true });
                  }
                }
              })} 
              className={inputClass}
            >
              <option value="">{t.selectStatus}</option>
              <option value="ALIVE">{t.alive}</option>
              <option value="LATE">{t.late}</option>
            </select>
            {errors.motherLivingStatus && <p className="text-red-500 text-xs mt-1">{errors.motherLivingStatus.message as string}</p>}
          </div>
          {watch('motherLivingStatus') !== 'LATE' && (
            <>
              <div>
                <label className={labelClass}>{t.motherOcc}</label>
                <input {...register('motherStatus')} className={inputClass} placeholder={t.motherOccPlaceholder} />
                {errors.motherStatus && <p className="text-red-500 text-xs mt-1">{errors.motherStatus.message as string}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.motherMobile}</label>
                <input type="tel" {...register('motherMobile')} className={inputClass} placeholder={t.privacyProtectedPlaceholder} />
                {errors.motherMobile && <p className="text-red-500 text-xs mt-1">{errors.motherMobile.message as string}</p>}
              </div>
            </>
          )}
          
          <div className="md:col-span-2"><hr className="my-2 border-gray-200" /></div>
          
          <div>
            <label className={labelClass}>{t.rentalIncome}</label>
            <input {...register('rentalIncome')} placeholder={t.rentalPlaceholder} className={inputClass} />
            {errors.rentalIncome && <p className="text-red-500 text-xs mt-1">{errors.rentalIncome.message as string}</p>}
          </div>
        </div>
      </div>

      {/* Siblings */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-3 sm:gap-0 items-start">
          <h3 className="text-lg font-bold text-gray-800">{t.siblings}</h3>
          <button type="button" onClick={() => append({ name: '', relation: '', status: '' })} className="flex items-center space-x-1 text-sm text-red-600 font-semibold hover:text-red-700 shrink-0">
            <Plus className="w-4 h-4" />
            <span>{t.addSibling}</span>
          </button>
        </div>
        
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic text-center py-4 bg-white rounded-lg border">{t.noSiblings}</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border relative group">
            <div>
              <label className="block text-xs font-semibold text-gray-600 after:content-['*'] after:ml-1 after:text-red-500">{t.siblingName}</label>
              <input {...register(`siblings.${index}.name` as const)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-sm border p-2 text-gray-900" placeholder={t.siblingNamePlaceholder} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 after:content-['*'] after:ml-1 after:text-red-500">{t.relation}</label>
              <select {...register(`siblings.${index}.relation` as const)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-sm border p-2 text-gray-900">
                <option value="">{t.selectStatus}</option>
                <option value="Elder Brother">{t.elderBrother}</option>
                <option value="Younger Brother">{t.youngerBrother}</option>
                <option value="Elder Sister">{t.elderSister}</option>
                <option value="Younger Sister">{t.youngerSister}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 after:content-['*'] after:ml-1 after:text-red-500">{t.status}</label>
              <select {...register(`siblings.${index}.status` as const)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-600 focus:ring-rose-600 text-sm border p-2 text-gray-900">
                <option value="">{t.selectStatus}</option>
                <option value="Married">{t.married}</option>
                <option value="Unmarried">{t.unmarried}</option>
              </select>
            </div>
            <button type="button" onClick={() => remove(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Career & Income */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t.careerIncome}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.workNature}</label>
            <select 
              {...register('workNature', {
                onChange: (e) => {
                  if (e.target.value === 'NOT_WORKING') {
                    setValue('salary', '', { shouldDirty: true });
                    setValue('organisation', '', { shouldDirty: true });
                    setValue('designation', '', { shouldDirty: true });
                    setValue('workingAddress', '', { shouldDirty: true });
                    setValue('googleLocation', '', { shouldDirty: true });
                  }
                }
              })} 
              className={inputClass}
            >
              <option value="">{t.selectStatus}</option>
              <option value="JOB">{t.job}</option>
              <option value="BUSINESS">{t.business}</option>
              <option value="NOT_WORKING">{t.notWorking}</option>
            </select>
          </div>
          {watch('workNature') && watch('workNature') !== 'NOT_WORKING' && (
            <>
              <div>
                <label className={labelClass}>{t.salary}</label>
                <input {...register('salary')} placeholder={t.salaryPlaceholder} className={inputClass} />
            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary.message as string}</p>}
              </div>
              <div>
                <label className={labelClass}>{watch('workNature') === 'BUSINESS' ? (t as any).businessName : t.organisation}</label>
                <input {...register('organisation')} className={inputClass} />
            {errors.organisation && <p className="text-red-500 text-xs mt-1">{errors.organisation.message as string}</p>}
              </div>
              {watch('workNature') !== 'BUSINESS' && (
                <div>
                  <label className={labelClass}>{t.designation}</label>
                  <input {...register('designation')} className={inputClass} />
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message as string}</p>}
                </div>
              )}
              <div>
                <label className={labelClass}>{watch('workNature') === 'BUSINESS' ? (t as any).businessAddress : t.workingAddress} <span className="text-xs font-normal text-gray-500">{t.masked}</span></label>
                <input {...register('workingAddress')} className={inputClass} />
            {errors.workingAddress && <p className="text-red-500 text-xs mt-1">{errors.workingAddress.message as string}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.googleLocation} <span className="text-xs font-normal text-gray-500">{t.masked}</span></label>
                <div className="mt-1 flex gap-2">
                  <input {...register('googleLocation')} className={inputClass.replace('mt-2', '') + ' flex-1'} placeholder="https://maps.google.com/..." />
            {errors.googleLocation && <p className="text-red-500 text-xs mt-1">{errors.googleLocation.message as string}</p>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Property & Assets */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t.propertyAssets}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelClass}>{t.houseTypeSqft}</label>
              <select {...register('houseType')} className={inputClass}>
                <option value="">{language === 'TA' ? 'தேர்ந்தெடுக்கவும்' : 'Select'}</option>
                <option value="RC Own">{language === 'TA' ? 'சொந்த ஆர்.சி - RC Own' : 'RC Own'}</option>
                <option value="RC Rented">{language === 'TA' ? 'வாடகை ஆர்.சி - RC Rented' : 'RC Rented'}</option>
                <option value="Tiles Roof House">{language === 'TA' ? 'டைல்ஸ் ஓட்டு வீடு - Tiles Roof House' : 'Tiles Roof House'}</option>
                <option value="Standard Roof House">{language === 'TA' ? 'ஓட்டு வீடு - Standard Roof House' : 'Standard Roof House'}</option>
                <option value="Rented Roof House">{language === 'TA' ? 'வாடகை ஓட்டு வீடு - Rented Roof House' : 'Rented Roof House'}</option>
              </select>
            {errors.houseType && <p className="text-red-500 text-xs mt-1">{errors.houseType.message as string}</p>}
            </div>
            <div className="flex-1">
              <label className={labelClass}>Sq.ft</label>
              <input {...register('houseSqFt')} placeholder="e.g. 1200" className={inputClass} />
            {errors.houseSqFt && <p className="text-red-500 text-xs mt-1">{errors.houseSqFt.message as string}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.siteLand}</label>
            <input {...register('siteLand')} placeholder={t.sitePlaceholder} className={inputClass} />
            {errors.siteLand && <p className="text-red-500 text-xs mt-1">{errors.siteLand.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.thottam}</label>
            <input {...register('thottam')} placeholder={t.thottamPlaceholder} className={inputClass} />
            {errors.thottam && <p className="text-red-500 text-xs mt-1">{errors.thottam.message as string}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.vacantLand}</label>
            {(!["", "No Vacant Land", "Residential Plot (in City / Town)", "Agricultural Land (under 5 Acres)", "Agricultural Land (above 5 Acres)", "Commercial Land / Industrial Plot"].includes(watch('vacantLand') || "") && watch('vacantLand') !== undefined) ? (
              <div className="flex gap-2">
                <input {...register('vacantLand')} className={inputClass} placeholder={language === 'TA' ? 'விவரங்களை உள்ளிடவும்' : 'Enter details manually'} autoFocus />
            {errors.vacantLand && <p className="text-red-500 text-xs mt-1">{errors.vacantLand.message as string}</p>}
                <button type="button" onClick={() => setValue('vacantLand', '', { shouldDirty: true })} className="mt-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  ✕
                </button>
              </div>
            ) : (
              <select 
                value={watch('vacantLand') || ""}
                onChange={(e) => {
                  if (e.target.value === 'OTHER') {
                    setValue('vacantLand', ' ', { shouldDirty: true }); // space to trigger custom input
                  } else {
                    setValue('vacantLand', e.target.value, { shouldDirty: true });
                  }
                }}
                className={inputClass}
              >
                <option value="">{t.selectStatus}</option>
                <option value="No Vacant Land">{t.noVacantLand}</option>
                <option value="Residential Plot (in City / Town)">{t.residentialPlot}</option>
                <option value="Agricultural Land (under 5 Acres)">{t.agriUnder5}</option>
                <option value="Agricultural Land (above 5 Acres)">{t.agriAbove5}</option>
                <option value="Commercial Land / Industrial Plot">{t.commercialLand}</option>
                <option value="OTHER">{language === 'TA' ? 'மற்றவை / Manual Entry' : 'Other (Manual Entry)'}</option>
              </select>
            )}
          </div>
          <div>
            <label className={labelClass}>{t.totalAssetValue}</label>
            <input {...register('totalAssetValue')} placeholder={t.assetPlaceholder} className={inputClass} />
            {errors.totalAssetValue && <p className="text-red-500 text-xs mt-1">{errors.totalAssetValue.message as string}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>{t.assetComments}</label>
            <textarea {...register('assetComments')} className={inputClass} rows={3} placeholder={t.assetCommentsPlaceholder} />
          </div>
          {gender === 'FEMALE' && (
            <div className="md:col-span-2">
              <label className={labelClass}>{t.dowryExpectation || 'Jewels Details'}</label>
              <input {...register('dowryDetails')} className={inputClass} placeholder={t.dowryPlaceholder || 'e.g. 50 Pouns'} />
            {errors.dowryDetails && <p className="text-red-500 text-xs mt-1">{errors.dowryDetails.message as string}</p>}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button type="button" onClick={onPrev} className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold shadow-sm transition-all active:scale-95">
          {t.back}
        </button>
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

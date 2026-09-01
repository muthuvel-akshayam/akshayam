import React, { useState } from 'react';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { formTranslations } from '@/frontend/utils/formTranslations';
import { FileUpload } from '../FileUpload';
import { CheckCircle, Info } from 'lucide-react';
import { savePaymentScreenshot, markProfileCompleted } from '@/backend/actions/profile';

export function Step4Payment({ 
  onNext, 
  language = 'TA', 
  initialData 
}: { 
  onNext: () => void; 
  language?: 'TA' | 'EN'; 
  initialData?: any; 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(initialData?.user?.paymentScreenshot || null);
  const t = formTranslations[language];

  const handleUploadSuccess = (url: string) => {
    setScreenshotUrl(url);
  };

  const onSubmit = async () => {
    if (!screenshotUrl) {
      alert(language === 'TA' ? 'தயவுசெய்து கட்டணம் செலுத்திய ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும்.' : 'Please upload the payment screenshot.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await savePaymentScreenshot(screenshotUrl);
      if (res && !res.success) {
        throw new Error(res.error || 'Failed to save payment info');
      }
      onNext();
    } catch (err: any) {
      console.error(err);
      alert((language === 'TA' ? 'சேமிக்க முடியவில்லை: ' : 'Failed to save payment info: ') + (err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayLater = async () => {
    setIsSaving(true);
    try {
      await markProfileCompleted();
      onNext();
    } catch (err) {
      console.error(err);
      onNext(); // still navigate if it fails
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h3 className="text-2xl font-bold text-primary">
            {language === 'TA' ? 'பதிவை உறுதிப்படுத்தவும் (Payment)' : 'Confirm Registration (Payment)'}
          </h3>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md w-full flex items-start gap-3">
            <Info className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-left text-sm text-amber-800">
              <p className="font-semibold mb-1">
                {language === 'TA' ? 'கட்டண விவரங்கள்:' : 'Payment Details:'}
              </p>
              <p>Registration Fee: ₹999</p>
              <p className="font-bold text-lg mt-1 text-primary">Total: ₹999</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 flex flex-col items-center">
            <p className="text-gray-700 font-medium mb-4">
              {language === 'TA' ? 'கீழே உள்ள QR குறியீட்டை ஸ்கேன் செய்து கட்டணம் செலுத்தவும்:' : 'Scan the QR code below to pay:'}
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <img 
                src="/payment-qr.jpg" 
                alt="Payment QR Code" 
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500">
              UPI ID: muthuvelmsp-1@oksbi
            </p>
          </div>

          <div className="w-full max-w-md text-left mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
              {language === 'TA' ? 'கட்டணம் செலுத்திய ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும்' : 'Upload Payment Screenshot'}
            </label>
            <FileUpload
              label={language === 'TA' ? 'ஸ்கிரீன்ஷாட்' : 'Screenshot'}
              subLabel="JPEG, PNG (Max 5MB)"
              bucket="photos"
              onUploadSuccess={handleUploadSuccess}
              initialUrl={screenshotUrl || undefined}
              required={true}
            />
            {screenshotUrl && (
              <div className="mt-2 flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                <CheckCircle className="w-4 h-4 mr-2" />
                {language === 'TA' ? 'ஸ்கிரீன்ஷாட் பதிவேற்றப்பட்டது' : 'Screenshot uploaded successfully'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <div></div>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={onSubmit}
            disabled={isSaving || !screenshotUrl} 
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {language === 'TA' ? 'சமர்ப்பிக்கவும்' : 'Submit & Complete'}
          </button>
          <button
            onClick={handlePayLater}
            disabled={isSaving}
            className="text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-4 py-1.5 rounded-md transition-colors shadow-sm font-medium mt-2"
          >
            {language === 'TA' ? 'ஏற்கனவே செலுத்தியவர்கள் / பிறகு செலுத்துகிறேன்' : 'Already Paid / Pay Later'}
          </button>
        </div>
      </div>
    </div>
  );
}

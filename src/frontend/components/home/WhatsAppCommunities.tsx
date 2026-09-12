import React from 'react';
import { useLanguage } from '@/frontend/context/LanguageContext';
import { MessageCircle, Users, ExternalLink, Sparkles } from 'lucide-react';

// Placeholder data - we'll update this when you provide the links!
const communities = [
  { id: 1, nameEn: 'Suththam', nameTa: 'சுத்தம்', link: 'https://chat.whatsapp.com/KUA54gjOkVKKEzp1iRlrcN' },
  { id: 2, nameEn: 'Sevvai', nameTa: 'செவ்வாய்', link: 'https://chat.whatsapp.com/I88k1pdJzs8J743HVjJ55a' },
  { id: 3, nameEn: 'Ragu Kethu', nameTa: 'ராகு கேது', link: 'https://chat.whatsapp.com/BkHVrV9Dl3pDgO8wrTU3lP' },
  { id: 4, nameEn: 'Ragu Kethu Sevvai', nameTa: 'ராகு கேது செவ்வாய்', link: 'https://chat.whatsapp.com/H8uhM7xTcQiB5pEBiYQn5R' },
  { id: 5, nameEn: 'IT Velai', nameTa: 'ஐடி வேலை', link: 'https://chat.whatsapp.com/HfoCo21VyVjDCFQW9wHUpI' },
];

export default function WhatsAppCommunities() {
  const { language } = useLanguage();

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4 text-green-600 shadow-inner">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-2">
            {language === 'TA' ? 'எங்கள் வாட்ஸ்அப் சமூகங்களில் சேரவும்' : 'Join Our WhatsApp Communities'}
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
            {language === 'TA' 
              ? 'சமீபத்திய வரன்கள், நிகழ்வுகள் மற்றும் அறிவிப்புகளை உடனடியாகப் பெற எங்கள் சமூகங்களில் இணையுங்கள்.' 
              : 'Connect with specific groups to get instant updates on new profiles, events, and announcements.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {communities.map((community, index) => (
            <div 
              key={community.id}
              className={`group relative bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 ${index >= 3 ? 'lg:col-span-1 md:col-span-1' : ''}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                    {language === 'TA' ? community.nameTa : community.nameEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{language === 'TA' ? 'செயலில் உள்ள குழு' : 'Active Group'}</span>
                  </div>
                </div>
              </div>
              
              <a 
                href={community.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-50 text-green-700 font-extrabold rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors shadow-sm"
              >
                {language === 'TA' ? 'இப்போதே சேரவும்' : 'Join Group'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

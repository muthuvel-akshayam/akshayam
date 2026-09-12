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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="w-6 h-6 text-white" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
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

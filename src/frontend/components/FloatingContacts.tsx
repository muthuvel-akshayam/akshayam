import React from 'react';
import { Phone } from 'lucide-react';

export default function FloatingContacts() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* Contact 1 */}
      <a
        href="tel:9677613716"
        className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-gray-100 px-4 py-2.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
      >
        <Phone className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
        <span className="font-bold text-teal-800 tracking-wide text-sm sm:text-base">96776 13716</span>
      </a>

      {/* Contact 2 */}
      <a
        href="tel:9345289217"
        className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-gray-100 px-4 py-2.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
      >
        <Phone className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
        <span className="font-bold text-teal-800 tracking-wide text-sm sm:text-base">93452 89217</span>
      </a>
    </div>
  );
}

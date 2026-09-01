'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';

interface ProfileProps {
  profile: any;
}

export default function LandingProfileCard({ profile: data }: ProfileProps) {
  // Gracefully handle both User objects (with embedded .profile) and raw Profile objects
  const p = data.profile ? data.profile : data;
  const user = data.profile ? data : data.user;

  // Calculate age from dob
  const dob = new Date(p.dob);
  const age = new Date().getFullYear() - dob.getFullYear();

  // Primary Education
  const education = p.educations && p.educations.length > 0 
    ? p.educations[0].degreeName 
    : 'Not Specified';

  const rasi = p.rasi || '';
  const nakshatra = p.nakshatra || '';
  const rasiNakshatra = rasi && nakshatra ? `${rasi}-${nakshatra}` : (rasi || nakshatra || 'Not Specified');
  const dosham = p.dosham || 'சுத்த ஜாதகம்';
  const city = p.city || p.district || 'Not Specified';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full bg-gray-100">
        {!p.hidePhoto && p.photoUrl ? (
          <img 
            src={p.photoUrl.includes('/profile-photos/') ? p.photoUrl.replace(/\/profile-photos\/(?!watermarked\/)/, '/profile-photos/watermarked/') : p.photoUrl} onError={(e) => { const target = e.currentTarget; if (target.src !== p.photoUrl) target.src = p.photoUrl; }} 
            alt={p.name} 
            className="w-full h-full object-cover rounded-t-lg object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
            <User className="w-16 h-16 text-gray-400 mb-2" />
            {p.hidePhoto && (
              <div className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm">
                <Lock className="w-4 h-4 text-gray-700" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate Info */}
      <div className="p-4 flex flex-col items-center text-center flex-grow">
        <h3 className="text-base font-bold text-gray-900 mb-0.5 truncate w-full">{p.name || 'Not Specified'}</h3>
        <span className="text-sm font-bold text-primary mb-2">{user?.userid || p.displayId || p.userId?.slice(0, 8).toUpperCase() || p.id?.slice(0, 8).toUpperCase()}</span>
        
        <div className="text-sm text-slate-600 space-y-1 w-full font-medium">
          <p className="truncate"><span className="text-gray-500">வயது :</span> {age}</p>
          <p className="truncate"><span className="text-gray-500">படிப்பு :</span> {education}</p>
          <p className="truncate"><span className="text-gray-500">இராசி :</span> {rasiNakshatra}</p>
          <p className="truncate"><span className="text-gray-500">ஜாதகம் :</span> {dosham}</p>
          <p className="truncate"><span className="text-gray-500">ஊர் :</span> {city}</p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="px-4 pb-4 pt-2 w-full grid grid-cols-2 gap-2">
        <Link 
          href={`/profiles/${p.userId || p.id || user?.id}`}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold py-2 px-2 rounded text-center transition-colors shadow-sm"
        >
          ப்ரோபைல்
        </Link>
        <Link 
          href={`/profiles/${p.userId || p.id || user?.id}?tab=jathakam`}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold py-2 px-2 rounded text-center transition-colors shadow-sm"
        >
          ஜாதகம்
        </Link>
      </div>
    </div>
  );
}

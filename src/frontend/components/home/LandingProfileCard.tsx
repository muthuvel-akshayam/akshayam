'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';

interface ProfileProps {
  profile: any;
}

export default function LandingProfileCard({ profile }: ProfileProps) {
  // Calculate age from dob
  const dob = new Date(profile.dob);
  const age = new Date().getFullYear() - dob.getFullYear();

  // Primary Education
  const education = profile.educations && profile.educations.length > 0 
    ? profile.educations[0].degreeName 
    : 'Not Specified';

  const rasi = profile.rasi || '';
  const nakshatra = profile.nakshatra || '';
  const rasiNakshatra = rasi && nakshatra ? `${rasi}-${nakshatra}` : (rasi || nakshatra || 'Not Specified');
  const dosham = profile.dosham || 'சுத்த ஜாதகம்';
  const city = profile.city || profile.district || 'Not Specified';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full bg-gray-100">
        {!profile.hidePhoto && profile.photoUrl ? (
          <img 
            src={profile.photoUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover rounded-t-lg object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
            <User className="w-16 h-16 text-gray-400 mb-2" />
            {profile.hidePhoto && (
              <div className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm">
                <Lock className="w-4 h-4 text-gray-700" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate Info */}
      <div className="p-4 flex flex-col items-center text-center flex-grow">
        <h3 className="text-base font-bold text-gray-900 mb-0.5 truncate w-full">{profile.name}</h3>
        <span className="text-sm font-bold text-primary mb-2">{profile.user?.userid || profile.displayId || profile.userId?.slice(0, 8).toUpperCase() || profile.id.slice(0, 8).toUpperCase()}</span>
        
        <div className="text-sm text-slate-600 space-y-1 w-full font-medium">
          <p className="truncate"><span className="text-gray-500">வயது :</span> {age}</p>
          <p className="truncate"><span className="text-gray-500">படிப்பு :</span> {education}</p>
          <p className="truncate"><span className="text-gray-500">இராசி :</span> {rasiNakshatra}</p>
          <p className="truncate"><span className="text-gray-500">ஜாதகம் :</span> {dosham}</p>
          <p className="truncate"><span className="text-gray-500">ஊர் :</span> {city}</p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="px-4 pb-4 pt-2 w-full">
        <Link 
          href={`/profiles/${profile.userId || profile.id}`}
          className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-1.5 px-3 rounded-md text-center transition-colors"
        >
          ப்ரோபைல்
        </Link>
      </div>
    </div>
  );
}

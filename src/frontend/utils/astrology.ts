export interface AstrologyOption {
  value: string;
  ta: string;
  en: string;
}

export const rasiOptions: AstrologyOption[] = [
  { value: 'Mesham', ta: 'மேஷம்', en: 'Mesham' },
  { value: 'Rishabam', ta: 'ரிஷபம்', en: 'Rishabam' },
  { value: 'Mithunam', ta: 'மிதுனம்', en: 'Mithunam' },
  { value: 'Kadagam', ta: 'கடகம்', en: 'Kadagam' },
  { value: 'Simmam', ta: 'சிம்மம்', en: 'Simmam' },
  { value: 'Kanni', ta: 'கன்னி', en: 'Kanni' },
  { value: 'Thulam', ta: 'துலாம்', en: 'Thulam' },
  { value: 'Viruchigam', ta: 'விருச்சிகம்', en: 'Viruchigam' },
  { value: 'Dhanusu', ta: 'தனுசு', en: 'Dhanusu' },
  { value: 'Magaram', ta: 'மகரம்', en: 'Magaram' },
  { value: 'Kumbam', ta: 'கும்பம்', en: 'Kumbam' },
  { value: 'Meenam', ta: 'மீனம்', en: 'Meenam' },
];

export const nakshatraByRasi: Record<string, AstrologyOption[]> = {
  Mesham: [
    { value: 'Aswini', ta: 'அசுவினி', en: 'Aswini' },
    { value: 'Bharani', ta: 'பரணி', en: 'Bharani' },
    { value: 'Karthigai (1st Pada)', ta: 'கார்த்திகை (1-ஆம் பாதம்)', en: 'Karthigai (1st Pada)' },
  ],
  Rishabam: [
    { value: 'Karthigai (2nd to 4th Pada)', ta: 'கார்த்திகை (2 முதல் 4 பாதங்கள்)', en: 'Karthigai (2nd to 4th Pada)' },
    { value: 'Rohini', ta: 'ரோகிணி', en: 'Rohini' },
    { value: 'Mrigasheersham (1st & 2nd Pada)', ta: 'மிருகசீரிடம் (1, 2 பாதங்கள்)', en: 'Mrigasheersham (1st & 2nd Pada)' },
  ],
  Mithunam: [
    { value: 'Mrigasheersham (3rd & 4th Pada)', ta: 'மிருகசீரிடம் (3, 4 பாதங்கள்)', en: 'Mrigasheersham (3rd & 4th Pada)' },
    { value: 'Thiruvaathirai', ta: 'திருவாதிரை', en: 'Thiruvaathirai' },
    { value: 'Punarpoosam (1st to 3rd Pada)', ta: 'புனர்பூசம் (1 முதல் 3 பாதங்கள்)', en: 'Punarpoosam (1st to 3rd Pada)' },
  ],
  Kadagam: [
    { value: 'Punarpoosam (4th Pada)', ta: 'புனர்பூசம் (4-ஆம் பாதம்)', en: 'Punarpoosam (4th Pada)' },
    { value: 'Poosam', ta: 'பூசம்', en: 'Poosam' },
    { value: 'Ayilyam', ta: 'ஆயில்யம்', en: 'Ayilyam' },
  ],
  Simmam: [
    { value: 'Magam', ta: 'மகம்', en: 'Magam' },
    { value: 'Pooram', ta: 'பூரம்', en: 'Pooram' },
    { value: 'Uthiram (1st Pada)', ta: 'உத்திரம் (1-ஆம் பாதம்)', en: 'Uthiram (1st Pada)' },
  ],
  Kanni: [
    { value: 'Uthiram (2nd to 4th Pada)', ta: 'உத்திரம் (2 முதல் 4 பாதங்கள்)', en: 'Uthiram (2nd to 4th Pada)' },
    { value: 'Hastham (Astham)', ta: 'ஹஸ்தம் (அஸ்தம்)', en: 'Hastham (Astham)' },
    { value: 'Chithirai (1st & 2nd Pada)', ta: 'சித்திரை (1, 2 பாதங்கள்)', en: 'Chithirai (1st & 2nd Pada)' },
  ],
  Thulam: [
    { value: 'Chithirai (3rd & 4th Pada)', ta: 'சித்திரை (3, 4 பாதங்கள்)', en: 'Chithirai (3rd & 4th Pada)' },
    { value: 'Swathi', ta: 'சுவாதி', en: 'Swathi' },
    { value: 'Visagam (1st to 3rd Pada)', ta: 'விசாகம் (1 முதல் 3 பாதங்கள்)', en: 'Visagam (1st to 3rd Pada)' },
  ],
  Viruchigam: [
    { value: 'Visagam (4th Pada)', ta: 'விசாகம் (4-ஆம் பாதம்)', en: 'Visagam (4th Pada)' },
    { value: 'Anusham', ta: 'அனுஷம்', en: 'Anusham' },
    { value: 'Kettai', ta: 'கேட்டை', en: 'Kettai' },
  ],
  Dhanusu: [
    { value: 'Moolam', ta: 'மூலம்', en: 'Moolam' },
    { value: 'Pooradam', ta: 'பூராடம்', en: 'Pooradam' },
    { value: 'Uthiradam (1st Pada)', ta: 'உத்திராடம் (1-ஆம் பாதம்)', en: 'Uthiradam (1st Pada)' },
  ],
  Magaram: [
    { value: 'Uthiradam (2nd to 4th Pada)', ta: 'உத்திராடம் (2 முதல் 4 பாதங்கள்)', en: 'Uthiradam (2nd to 4th Pada)' },
    { value: 'Thiruvonam', ta: 'திருவோணம்', en: 'Thiruvonam' },
    { value: 'Avittam (1st & 2nd Pada)', ta: 'அவிட்டம் (1, 2 பாதங்கள்)', en: 'Avittam (1st & 2nd Pada)' },
  ],
  Kumbam: [
    { value: 'Avittam (3rd & 4th Pada)', ta: 'அவிட்டம் (3, 4 பாதங்கள்)', en: 'Avittam (3rd & 4th Pada)' },
    { value: 'Sathayam', ta: 'சதயம்', en: 'Sathayam' },
    { value: 'Poorattadhi (1st to 3rd Pada)', ta: 'பூரட்டாதி (1 முதல் 3 பாதங்கள்)', en: 'Poorattadhi (1st to 3rd Pada)' },
  ],
  Meenam: [
    { value: 'Poorattadhi (4th Pada)', ta: 'பூரட்டாதி (4-ஆம் பாதம்)', en: 'Poorattadhi (4th Pada)' },
    { value: 'Uthirattadhi', ta: 'உத்திரட்டாதி', en: 'Uthirattadhi' },
    { value: 'Revathi', ta: 'ரேவதி', en: 'Revathi' },
  ],
};

export const allNakshatras: AstrologyOption[] = Object.values(nakshatraByRasi).flat();

export function translateRasi(value: string | null | undefined, language: 'TA' | 'EN'): string {
  if (!value) return language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not Specified';
  const found = rasiOptions.find(item => item.value.toLowerCase() === value.toLowerCase() || item.ta === value || item.en.toLowerCase() === value.toLowerCase());
  if (!found) return value;
  return language === 'TA' ? found.ta : found.en;
}

export function translateNakshatra(value: string | null | undefined, language: 'TA' | 'EN'): string {
  if (!value) return language === 'TA' ? 'குறிப்பிடப்படவில்லை' : 'Not Specified';
  const found = allNakshatras.find(item => item.value.toLowerCase() === value.toLowerCase() || item.ta === value || item.en.toLowerCase() === value.toLowerCase());
  if (!found) return value;
  return language === 'TA' ? found.ta : found.en;
}

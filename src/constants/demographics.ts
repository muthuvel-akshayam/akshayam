export interface DropdownOption {
  value: string;
  labelEn: string;
  labelTa: string;
}

export const RELIGION_OPTIONS: DropdownOption[] = [
  { value: "Hindu", labelEn: "Hindu", labelTa: "இந்து" },
  { value: "Christian", labelEn: "Christian", labelTa: "கிறிஸ்தவர்" },
  { value: "Muslim", labelEn: "Muslim", labelTa: "முஸ்லிம்" },
  { value: "Jain", labelEn: "Jain", labelTa: "ஜைனர்" },
  { value: "Sikh", labelEn: "Sikh", labelTa: "சீக்கியர்" },
  { value: "Buddhist", labelEn: "Buddhist", labelTa: "பௌத்தர்" },
  { value: "Inter-Religion", labelEn: "Inter-Religion", labelTa: "மதமாற்றத் திருமணம்" },
  { value: "Other", labelEn: "Other / Not Specified", labelTa: "மற்றவை / குறிப்பிடப்படவில்லை" }
];

export const CASTE_OPTIONS: DropdownOption[] = [
  { value: "Gounder", labelEn: "Gounder", labelTa: "கவுண்டர்" },
  { value: "Vanniyar", labelEn: "Vanniyar", labelTa: "வன்னியர்" },
  { value: "Chettiar", labelEn: "Chettiar", labelTa: "செட்டியார்" },
  { value: "Mudaliar", labelEn: "Mudaliar", labelTa: "முதலியார்" },
  { value: "Pillai", labelEn: "Pillai", labelTa: "பிள்ளை" },
  { value: "Naidu", labelEn: "Naidu", labelTa: "நாயுடு" },
  { value: "Brahmin", labelEn: "Brahmin", labelTa: "பிராமணர்" },
  { value: "Thevar / Mukkulathor", labelEn: "Thevar / Mukkulathor", labelTa: "தேவர் / முக்களத்தோர்" },
  { value: "Nadar", labelEn: "Nadar", labelTa: "நாடார்" },
  { value: "Viswakarma / Achari", labelEn: "Viswakarma / Achari", labelTa: "விஸ்வகர்மா / ஆசாரி" },
  { value: "Yadav / Konar", labelEn: "Yadav / Konar", labelTa: "யாதவா / கோனார்" },
  { value: "Reddy", labelEn: "Reddy", labelTa: "ரெட்டி" },
  { value: "Adidravidar", labelEn: "Adidravidar", labelTa: "ஆதிதிராவிடர்" },
  { value: "Devendra Kula Vellalar", labelEn: "Devendra Kula Vellalar", labelTa: "தேவேந்திர குல வேளாளர்" },
  { value: "Sourashtra", labelEn: "Sourashtra", labelTa: "சௌராஷ்ட்ரா" },
  { value: "Sengunthar / Kaikolar", labelEn: "Sengunthar / Kaikolar", labelTa: "செங்குந்தர் / கைக்கோளர்" },
  { value: "Inter-Caste", labelEn: "Inter-Caste", labelTa: "சாதி மறுப்பு" },
  { value: "Caste No Bar", labelEn: "Caste No Bar", labelTa: "சாதி தடையில்லை" },
  { value: "Other", labelEn: "Other", labelTa: "மற்றவை" }
];

export const SUB_CASTE_OPTIONS: DropdownOption[] = [
  { value: "Not Specified", labelEn: "Not Specified / Any", labelTa: "குறிப்பிடப்படவில்லை / எதுவும்" },

  // Gounder / Kongu Vellalar
  { value: "Kongu Vellalar", labelEn: "Kongu Vellalar", labelTa: "கொங்கு வேளாளர்" },
  { value: "Senthalai", labelEn: "Senthalai", labelTa: "செந்தலை" },
  { value: "Padaithalai", labelEn: "Padaithalai", labelTa: "படைத்தலை" },
  { value: "Vettuva Gounder", labelEn: "Vettuva Gounder", labelTa: "வேட்டுவ கவுண்டர்" },

  // Vanniyar
  { value: "Vanniya Kula Kshatriyar", labelEn: "Vanniya Kula Kshatriyar", labelTa: "வன்னிய குல க்ஷத்ரியர்" },
  { value: "Padayachi", labelEn: "Padayachi", labelTa: "படையாட்சி" },
  { value: "Gounder (Vanniyar)", labelEn: "Gounder (Vanniyar)", labelTa: "கவுண்டர் (வன்னியர்)" },

  // Chettiar
  { value: "Nattukottai Chettiar (Nagarathar)", labelEn: "Nattukottai Chettiar (Nagarathar)", labelTa: "நாட்டுக்கோட்டை செட்டியார் (நகரத்தார்)" },
  { value: "Devanga Chettiar", labelEn: "Devanga Chettiar", labelTa: "தேவாங்க செட்டியார்" },
  { value: "Vaniyar Chettiar", labelEn: "Vaniyar Chettiar", labelTa: "வாணியர் செட்டியார்" },
  { value: "Elur Chettiar", labelEn: "Elur Chettiar", labelTa: "எழூர் செட்டியார்" },
  { value: "Ayira Vysya", labelEn: "Ayira Vysya", labelTa: "ஆயிர வைசிய" },

  // Mudaliar / Pillai
  { value: "Thondaimandala Mudaliar", labelEn: "Thondaimandala Mudaliar", labelTa: "தொண்டைமண்டல முதலியார்" },
  { value: "Arcot Mudaliar", labelEn: "Arcot Mudaliar", labelTa: "ஆற்காடு முதலியார்" },
  { value: "Saiva Pillai", labelEn: "Saiva Pillai", labelTa: "சைவ பிள்ளை" },
  { value: "Karakatha Pillai", labelEn: "Karakatha Pillai", labelTa: "கார்க்காத்த பிள்ளை" },
  { value: "Seer Karunigar", labelEn: "Seer Karunigar", labelTa: "சீர் கருணீகர்" },

  // Naidu / Nayakar
  { value: "Kamma", labelEn: "Kamma", labelTa: "கம்மா" },
  { value: "Kapu", labelEn: "Kapu", labelTa: "காப்பு" },
  { value: "Balija", labelEn: "Balija", labelTa: "பலிஜா" },
  { value: "Gavara", labelEn: "Gavara", labelTa: "கவரா" },
  { value: "Muthuraja", labelEn: "Muthuraja", labelTa: "முத்துராஜா" },

  // Brahmin
  { value: "Iyer - Vadama", labelEn: "Iyer - Vadama", labelTa: "ஐயர் - வடமா" },
  { value: "Iyer - Brahacharanam", labelEn: "Iyer - Brahacharanam", labelTa: "ஐயர் - பிரஹசரணம்" },
  { value: "Iyengar - Vadakalai", labelEn: "Iyengar - Vadakalai", labelTa: "ஐயங்கார் - வடகலை" },
  { value: "Iyengar - Tenkalai", labelEn: "Iyengar - Tenkalai", labelTa: "ஐயங்கார் - தென்கலை" },

  // Thevar / Mukkulathor
  { value: "Kallar", labelEn: "Kallar", labelTa: "கள்ளர்" },
  { value: "Maravar", labelEn: "Maravar", labelTa: "மறவர்" },
  { value: "Agamudayar", labelEn: "Agamudayar", labelTa: "அகமுடையார்" },

  // Viswakarma / Achari
  { value: "Kammalar", labelEn: "Kammalar", labelTa: "கம்மாளர்" },
  { value: "Gold Smith (Thattar)", labelEn: "Gold Smith (Thattar)", labelTa: "தட்டார்" },
  { value: "Blacksmith (Kollan)", labelEn: "Blacksmith (Kollan)", labelTa: "கொல்லன்" },
  { value: "Carpenter (Thachchan)", labelEn: "Carpenter (Thachchan)", labelTa: "தச்சன்" },

  // Christian / Muslim Denominations
  { value: "Roman Catholic", labelEn: "Roman Catholic", labelTa: "ரோமன் கத்தோலிக்கர்" },
  { value: "CSI / Protestant", labelEn: "CSI / Protestant", labelTa: "சி.எஸ்.ஐ / புராட்டஸ்டன்ட்" },
  { value: "Pentecostal", labelEn: "Pentecostal", labelTa: "பெந்தேகோஸ்தே" },
  { value: "Sunni", labelEn: "Sunni", labelTa: "சுன்னி" },
  { value: "Shia", labelEn: "Shia", labelTa: "ஷியா" },

  // Other / Generic
  { value: "Don't wish to specify / Other", labelEn: "Other Subcaste", labelTa: "மற்றவை" }
];


export const TERM_DICTIONARY: Record<string, string> = {
  // Core Religions
  "Hindu": "இந்து",
  "Christian": "கிறிஸ்தவர்",
  "Muslim": "முஸ்லிம்",

  // Castes
  "Adi Dravida": "ஆதி திராவிடர்",
  "Agamudayar / Arcot / Thuluva Vellala": "அகமுடையார் / ஆற்காடு / துளுவ வெள்ளாளர்",
  "Brahmin": "பிராமணர்",
  "Chettiar": "செட்டியார்",
  "Devandra Kula Vellalar": "தேவேந்திர குல வேளாளர்",
  "Gounder": "கவுண்டர்",
  "Mudaliar": "முதலியார்",
  "Mutharaiyar": "முத்தரையர்",
  "Naidu": "நாயுடு",
  "Naicker / Nayakar": "நாயக்கர்",
  "Nadar": "நாடார்",
  "Pillai": "பிள்ளை",
  "Reddiar": "ரெட்டியார்",
  "Vanniyar / Vannia Kula Kshatriyar": "வன்னியர் / வன்னிய குல க்ஷத்ரியர்",
  "Vellalar": "வேளாளர்",
  "Vishwakarma": "விஸ்வகர்மா",
  "Yadav": "யாதவ் / கோனார்",
  "Sourashtra": "சௌராஷ்டிரா",
  "Arunthathiyar": "அருந்ததியர்",
  "Caste No Bar": "சாதி தடையில்லை",
  "Other Hindu": "மற்ற இந்து",
  
  "Christian Adi Dravida": "கிறிஸ்தவ ஆதி திராவிடர்",
  "Christian Devandra Kula Vellalar": "கிறிஸ்தவ தேவேந்திர குல வேளாளர்",
  "Christian Nadar": "கிறிஸ்தவ நாடார்",
  "Christian Vellalar": "கிறிஸ்தவ வேளாளர்",
  "Christian Other": "கிறிஸ்தவர் (மற்றவை)",
  "Roman Catholic": "ரோமன் கத்தோலிக்கர்",
  "Church of South India (CSI)": "தென்னிந்திய திருச்சபை (CSI)",
  "Pentecostal": "பெந்தேகோஸ்தே",
  "Protestant": "புராட்டஸ்டன்ட்",
  "Orthodox": "ஆர்த்தடாக்ஸ்",
  "Seventh-day Adventist": "செவன்த்-டே அட்வென்டிஸ்ட்",
  "Syrian Catholic": "சிரியன் கத்தோலிக்கர்",
  
  "Sunni": "சுன்னி",
  "Shia": "ஷியா",
  "Labbai / Lebbai": "லெப்பை",
  "Rowther": "ராவுத்தர்",
  "Marakkayar": "மரைக்காயர்",
  "Dhakni": "தக்னி",
  "Other Muslim": "மற்ற முஸ்லிம்",
  
  "Jain": "ஜைனர்",
  "Jain Digambar": "திகம்பர ஜைனர்",
  "Jain Shwetambar": "சுவேதாம்பர ஜைனர்",
  "Sikh": "சீக்கியர்",
  "Buddhist": "பௌத்தர்",
  "Parsi": "பார்சி",
  "Jewish": "யூதர்",
  "No Religious Belief": "மத நம்பிக்கையில்லை",
  "InterReligion": "மதமாற்றத் திருமணம்",
  
  // Some common subcastes missing
  "Kongu Vellala Gounder": "கொங்கு வேளாள கவுண்டர்",
  "Vettuva Gounder": "வேட்டுவ கவுண்டர்",
  "Vanniyars": "வன்னியர்கள்",
  "Vettuva Gounders": "வேட்டுவ கவுண்டர்கள்",
  "Kurumba Gounders": "குறும்ப கவுண்டர்கள்",
  "Nattu Gounder": "நாட்டு கவுண்டர்",
  "Odayar Gounder": "உடையார் கவுண்டர்",
  "Kaikolar / Sengunthar": "கைக்கோளர் / செங்குந்தர்",
  "Balija Naidu": "பலிஜா நாயுடு",
  "Kamma Naidu": "கம்மா நாயுடு",
  "Reddy Naicker": "ரெட்டி நாயக்கர்",
  "Saiva Pillai": "சைவ பிள்ளை",
  "Vellala Pillai": "வெள்ளாள பிள்ளை",
  "Isai Vellalar": "இசை வேளாளர்",
  "Kongu Vellalar": "கொங்கு வேளாளர்",
  "Paraiyar": "பறையர்",
  "Sambavar": "சாம்பவர்",
  "Pallan": "பள்ளன்",
  "Iyer": "ஐயர்",
  "Iyengar": "ஐயங்கார்",
  "Vadama": "வடமா",
  "Brahacharanam": "பிரஹசரணம்",
  "Ashtasahasram": "அஷ்டசஹஸ்ரம்",
  "Dravida Brahmin": "திராவிட பிராமணர்",
  "Madhwa": "மாத்வா",
  "Smartha": "ஸ்மார்த்தா"
};

export const translateTerm = (term: string, language: string) => {
  if (language === 'EN') return term;
  return TERM_DICTIONARY[term] || term;
};

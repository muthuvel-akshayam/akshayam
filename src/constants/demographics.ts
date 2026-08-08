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

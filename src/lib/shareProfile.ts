export async function shareProfile(profileOrId: any, nameStr?: string) {
  let profile = profileOrId;
  if (typeof profileOrId === 'string') {
    // Legacy support where it was called as shareProfile(profileId, name)
    profile = { id: profileOrId, name: nameStr };
  }
  
  const shareUrl = `${window.location.origin}/profiles/${profile.id}`;
  const kulamVal = profile.kulam || profile.koottam || profile.subCaste || '';
  const kulam = kulamVal ? `குலம் : ${kulamVal} ` : '';
  const doshamVal = profile.dosham || 'சுத்த ஜாதகம்';
  const dosham = `தோஷம் : ${doshamVal} `;
  const education = profile.education || profile.educations?.[0]?.degreeName || '-';
  const name = profile.name || '';
  
  const text = `பெயர் : ${name} | படிப்பு : ${education} | ${kulam}| ${dosham}- View profile`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${name} - Akshayam Matrimony`,
        text: text,
        url: shareUrl,
      });
    } catch (err) {
      console.log("Share cancelled/failed", err);
    }
  } else {
    await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
    alert("விவரங்கள் நகலெடுக்கப்பட்டது!");
  }
}

export function shareToWhatsApp(profileId: string, profileData?: any) {
  const shareUrl = `${window.location.origin}/profiles/${profileId}`;
  
  if (profileData) {
    const name = profileData.name || '';
    const education = profileData.education || profileData.educations?.[0]?.degreeName || '-';
    const kulam = profileData.kulam || profileData.koottam || profileData.subCaste || '-';
    const dosham = profileData.dosham || 'சுத்த ஜாதகம்';
    
    const text = `பெயர் : ${name} | படிப்பு : ${education} | குலம் : ${kulam} | தோஷம் : ${dosham} - View profile`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  } else {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  }
}

export async function shareProfile(profileId: string, name: string) {
  const shareUrl = `${window.location.origin}/profiles/${profileId}`;
  const shareData = {
    title: `Akshayam Matrimony - ${name}`,
    url: shareUrl,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log("Share cancelled/failed", err);
    }
  } else {
    await navigator.clipboard.writeText(shareUrl);
    alert("Profile link copied to clipboard!");
  }
}

export function shareToWhatsApp(profileId: string, profileData?: any) {
  const shareUrl = `${window.location.origin}/profiles/${profileId}`;
  
  if (profileData) {
    const name = profileData.name || '';
    const education = profileData.educations?.[0]?.degreeName || '';
    const kulam = profileData.koottam || profileData.subCaste || '';
    
    const text = `பெயர் :${name}  படிப்பு :${education} குலம் : ${kulam} - மேலும் விபரங்களுக்கு லிங்க்கை கிளிக் செய்யவும்\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  } else {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  }
}

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

export function shareToWhatsApp(profileId: string, name?: string, education?: string, kulam?: string) {
  const shareUrl = `${window.location.origin}/profiles/${profileId}`;
  
  let textToShare = shareUrl;
  if (name && education && kulam) {
    textToShare = `பெயர் :${name} படிப்பு :${education} குலம் : ${kulam} - View profile ${shareUrl}`;
  }
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
  window.open(whatsappUrl, '_blank');
}

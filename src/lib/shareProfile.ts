export async function shareProfile(profileId: string, name: string) {
  const shareUrl = `${window.location.origin}/profiles/${profileId}`;
  const shareData = {
    title: `Akshayam Matrimony - ${name} (${profileId})`,
    text: `Check out the matrimonial profile for ${name} (${profileId}) on Akshayam Matrimony.`,
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

export function shareToWhatsApp(profileId: string) {
  const shareUrl = `${window.location.origin}/profiles/${profileId}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
  window.open(whatsappUrl, '_blank');
}

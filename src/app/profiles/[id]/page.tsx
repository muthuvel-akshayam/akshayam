import { getProfileById } from '@/backend/actions/matches';
import { notFound } from 'next/navigation';
import { ProfileDetailClient } from './ProfileDetailClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params;
  // Avoid using headers() which can break static generation. Use env vars instead.
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://www.akshayamtamilmatrimony.com';
  const profileData = await getProfileById(id);

  if (!profileData || !profileData.profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  const profile = profileData.profile;
  const name = profile.name || 'Profile';
  const education = profile.educations?.[0]?.degreeName || 'Not Specified';
  
  // Use koottam, fallback to subCaste, fallback to empty
  const kulam = profile.koottam || profile.subCaste || 'Not Specified';
  const dosham = profile.dosham || 'சுத்த ஜாதகம்';
  
  // Format exactly as requested: Name, koottam, thoosam
  const description = `பெயர் :${name} படிப்பு :${education} குலம் : ${kulam} தோஷம் : ${dosham}`;

  let imageUrl = `${baseUrl}/akshayam_logo.png`;
  if (profile.photoUrl) {
    imageUrl = profile.photoUrl;
    
    if (imageUrl.includes('/profile-photos/')) {
      const watermarkedUrl = imageUrl.replace(/\/profile-photos\/(?!watermarked\/)/, '/profile-photos/watermarked/');
      try {
        // Perform a lightweight HEAD request to check if the watermarked image exists
        const res = await fetch(watermarkedUrl, { method: 'HEAD', next: { revalidate: 3600 } });
        if (res.ok) {
          imageUrl = watermarkedUrl;
        }
      } catch (e) {
        // Fallback to original image silently
      }
    }
      
    // Ensure absolute URL just in case
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
  }

  // Now that we have the final photoUrl, we generate a guaranteed 1200x630 landscape OpenGraph image
  const ogImageUrl = `${baseUrl}/api/og-profile?photoUrl=${encodeURIComponent(imageUrl)}`;

  return {
    title: `${name} - Akshayam Matrimony`,
    description: description,
    openGraph: {
      title: `${name} - Akshayam Matrimony`,
      description: description,
      url: `${baseUrl}/profiles/${id}`,
      siteName: 'Akshayam Matrimony',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s Profile Photo`,
        },
      ],
      locale: 'ta_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - Akshayam Matrimony`,
      description: description,
      images: [ogImageUrl],
    },
  }
}

export default async function ProfileDetailPage({ params }: Props) {
  const { id } = await params;
  const profileData = await getProfileById(id);

  if (!profileData || !profileData.profile) {
    return notFound();
  }

  // Check if current user has shortlisted this profile
  const { getShortlistsForUser } = await import('@/backend/actions/shortlist');
  const shortlists = await getShortlistsForUser();
  const isShortlisted = shortlists.includes(id);

  const { getUserId } = await import('@/backend/actions/profile');
  const currentUserId = await getUserId();
  let currentUserHasProfile = false;
  
  if (currentUserId && currentUserId !== 'test-user-id') {
    const { default: prisma } = await import('@/backend/prisma');
    const userProfile = await prisma.profile.findUnique({ where: { userId: currentUserId } });
    if (userProfile) {
      currentUserHasProfile = true;
    }
  }

  return <ProfileDetailClient user={profileData} initialIsShortlisted={isShortlisted} currentUserHasProfile={currentUserHasProfile} />;
}

import { getProfileById } from '@/backend/actions/matches';
import { notFound } from 'next/navigation';
import { ProfileDetailClient } from './ProfileDetailClient';
import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params;
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

  let imageUrl = 'https://www.akshayamtamilmatrimony.com/akshayam_logo.png';
  if (profile.photoUrl) {
    // WhatsApp and Facebook scrapers prefer raw image URLs (JPG/PNG) over Next.js optimized WebP routes.
    // Using the direct photoUrl ensures maximum compatibility across social platforms.
    imageUrl = profile.photoUrl;
  }

  return {
    title: `${name} - Akshayam Matrimony`,
    description: description,
    openGraph: {
      title: `${name} - Akshayam Matrimony`,
      description: description,
      url: `https://www.akshayamtamilmatrimony.com/profiles/${id}`,
      siteName: 'Akshayam Matrimony',
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
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

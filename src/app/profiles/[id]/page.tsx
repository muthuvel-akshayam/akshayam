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
  
  // Format exactly as requested: பெயர் :Name படிப்பு :Edu குலம் : Kulam தோஷம் : Dosham
  const description = `பெயர் :${name} படிப்பு :${education} குலம் : ${kulam} தோஷம் : ${dosham}`;

  let imageUrl = 'https://www.akshayamtamilmatrimony.com/akshayam_logo.png';
  if (profile.photoUrl) {
    const headersList = await headers();
    const host = headersList.get('host') || 'www.akshayamtamilmatrimony.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    // Compress via Next.js image optimizer to ensure size < 300KB for WhatsApp
    imageUrl = `${baseUrl}/_next/image?url=${encodeURIComponent(profile.photoUrl)}&w=828&q=75`;
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

  return <ProfileDetailClient user={profileData} />;
}

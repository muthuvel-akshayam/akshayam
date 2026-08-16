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
  
  // Format exactly as requested: பெயர் :Name படிப்பு :Edu குலம் : Kulam - View profile
  const description = `பெயர் :${name} படிப்பு :${education} குலம் : ${kulam} - View profile akshayamtamilmatrimony.com`;

  const ogUrl = new URL(`https://www.akshayamtamilmatrimony.com/api/og/profile`);
  if (profile.photoUrl) ogUrl.searchParams.set('photo', profile.photoUrl);
  ogUrl.searchParams.set('name', name);
  if (kulam && kulam !== 'Not Specified') ogUrl.searchParams.set('desc', `குலம்: ${kulam}`);

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
          url: ogUrl.toString(),
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
      images: [ogUrl.toString()],
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

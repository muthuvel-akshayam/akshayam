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
          url: profile.photoUrl || 'https://www.akshayamtamilmatrimony.com/akshayam_logo.png', // Fallback image
          width: 800,
          height: 600,
          alt: `${name}'s Profile Photo`,
        },
      ],
      locale: 'ta_IN',
      type: 'website',
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

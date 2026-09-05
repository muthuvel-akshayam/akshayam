import { getFullProfile } from '@/backend/actions/profile';
import { getMatches, getRecentProfiles } from '@/backend/actions/matches';
import { getShortlistedProfilesFull } from '@/backend/actions/shortlist';
import DashboardClient from './DashboardClient';

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getFullProfile();
  
  if (!user) {
    redirect('/');
  }

  const [matches, recentProfiles, shortlistedProfiles] = await Promise.all([
    getMatches(),
    getRecentProfiles(15),
    getShortlistedProfilesFull()
  ]);
  
  return (
    <DashboardClient 
      user={user} 
      matches={matches || []} 
      recentProfiles={recentProfiles || []}
      shortlistedProfiles={shortlistedProfiles || []}
    />
  );
}

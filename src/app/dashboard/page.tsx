import { getFullProfile } from '@/backend/actions/profile';
import { getMatches, getRecentProfiles } from '@/backend/actions/matches';
import { getShortlistedProfilesFull } from '@/backend/actions/shortlist';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [user, matches, recentProfiles, shortlistedProfiles] = await Promise.all([
    getFullProfile(),
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

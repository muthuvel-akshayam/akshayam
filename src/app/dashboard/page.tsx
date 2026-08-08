import { getFullProfile } from '@/backend/actions/profile';
import { getMatches } from '@/backend/actions/matches';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [user, matches] = await Promise.all([
    getFullProfile(),
    getMatches()
  ]);
  return <DashboardClient user={user} matches={matches || []} />;
}

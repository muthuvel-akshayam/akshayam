import { getMatches } from '@/backend/actions/matches';
import ProfilesClient from './ProfilesClient';

export const dynamic = 'force-dynamic';

export default async function ProfilesPage() {
  const profiles = await getMatches();
  return <ProfilesClient profiles={profiles} />;
}

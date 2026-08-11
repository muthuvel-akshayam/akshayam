import { getMatches, getSentInterestsForUser, getReceivedInterestsFull } from '@/backend/actions/matches';
import { getShortlistsForUser, getShortlistedProfilesFull } from '@/backend/actions/shortlist';
import ProfilesClient from './ProfilesClient';

export const dynamic = 'force-dynamic';

export default async function ProfilesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tab = typeof params?.tab === 'string' ? params.tab : 'matches';
  
  let profiles: any[] = [];
  if (tab === 'received') {
    profiles = await getReceivedInterestsFull();
  } else if (tab === 'shortlisted') {
    profiles = await getShortlistedProfilesFull();
  } else {
    profiles = await getMatches();
  }

  const shortlists = await getShortlistsForUser();
  const sentInterests = await getSentInterestsForUser();
  
  return <ProfilesClient profiles={profiles} initialShortlists={shortlists} initialSentInterests={sentInterests} activeTab={tab} />;
}

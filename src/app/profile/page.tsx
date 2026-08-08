import { getFullProfile } from '@/backend/actions/profile';
import ProfileWizard from '@/frontend/components/profile-wizard/ProfileWizard';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getFullProfile();
  return (
    <ProfileWizard initialData={user} />
  );
}

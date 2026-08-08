import test from 'node:test';
import assert from 'node:assert';
import { getMatches } from './matches';
import prisma from '../prisma';
import * as profileModule from './profile';

// Mock getUserId
(profileModule as any).getUserId = async () => 'user-1';

// Mock Prisma
const originalFindUnique = prisma.user.findUnique;
const originalFindMany = prisma.user.findMany;

test('Matches API - Bidirectional stars & different Kootam & Privacy Masks', async () => {
  // Mock current user
  (prisma.user.findUnique as any) = async () => ({
    id: 'user-1',
    profile: {
      status: 'APPROVED',
      gender: 'MALE',
      koottam: 'Siva',
      nakshatra: 'Ashwini',
      poruthaNakshatram: ['Bharani', 'Krithika']
    }
  });

  // Mock finding a valid female match
  (prisma.user.findMany as any) = async (query: any) => {
    // Basic verification of the query built
    const where = query.where;
    assert.strictEqual(where.profile.is.gender, 'FEMALE');
    assert.strictEqual(where.profile.is.status, 'APPROVED');
    assert.strictEqual(where.profile.is.isLive, true);

    const andConditions = where.profile.is.AND;
    // Check Kootam exclusion
    const hasKootamExclusion = andConditions.some((c: any) => c.NOT?.koottam?.equals === 'Siva');
    assert.ok(hasKootamExclusion, 'Missing Kootam exclusion');

    // Check one-directional nakshatra
    const hasNakshatraIn = andConditions.some((c: any) => c.nakshatra?.in?.includes('Bharani'));
    assert.ok(hasNakshatraIn, 'Missing Nakshatra IN clause');

    return [
      {
        id: 'user-2',
        mobile_no: '1234567890',
        profile: {
          gender: 'FEMALE',
          koottam: 'Vishnu',
          nakshatra: 'Bharani',
          poruthaNakshatram: ['Ashwini'],
          houseAddress: '123 Test St',
          hidePhoto: true,
          photoUrl: 'real-photo.png',
          casteCertificateUrl: 'cert.pdf'
        },
        family: {
          fatherMobile: '0987654321',
          motherMobile: '1122334455',
          workingAddress: 'Work Address'
        }
      }
    ];
  };

  const matches = await getMatches();
  assert.strictEqual(matches.length, 1);
  const match = matches[0];
  
  // Verify Privacy Masking
  assert.strictEqual(match.mobile_no, 'Hidden for Safety');
  assert.strictEqual(match.profile.houseAddress, 'Hidden for Safety');
  assert.strictEqual(match.family.fatherMobile, 'Hidden for Safety');
  assert.strictEqual(match.family.motherMobile, 'Hidden for Safety');
  assert.strictEqual(match.family.workingAddress, 'Hidden for Safety');
  
  // Verify Photo Masking
  assert.strictEqual(match.profile.photoUrl, '/static/assets/blurred-avatar.png');
  
  // Verify Certificate
  assert.strictEqual(match.profile.casteCertificateUrl, null);
});

test('Matches API - Empty query results', async () => {
  (prisma.user.findUnique as any) = async () => ({
    id: 'user-1',
    profile: { status: 'APPROVED', gender: 'MALE', koottam: 'Siva', nakshatra: 'Ashwini', poruthaNakshatram: [] }
  });

  (prisma.user.findMany as any) = async () => []; // No matches

  const matches = await getMatches();
  assert.strictEqual(matches.length, 0);
});

test('Cleanup mocks', () => {
  prisma.user.findUnique = originalFindUnique;
  prisma.user.findMany = originalFindMany;
});

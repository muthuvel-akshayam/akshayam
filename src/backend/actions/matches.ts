'use server';

import prisma, { Prisma } from '../prisma';
import { getUserId } from './profile';
import { revalidatePath } from 'next/cache';

export async function getMatches(filters?: {
  caste?: string;
  subCaste?: string;
  koottam?: string;
  [key: string]: any;
}) {
  const currentUserId = await getUserId();

  // Get current user's profile to exclude them, and determine opposite gender matching
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    include: { profile: true }
  });

  // Only users with an APPROVED profile status can view matches
  if (!currentUser?.profile || String(currentUser.profile.status) !== 'APPROVED') {
    return [];
  }

  const targetGender = currentUser.profile.gender === 'MALE' ? 'FEMALE' : 'MALE';

  // Build the dynamic where clause using Prisma's ProfileWhereInput for strict type safety.
  const profileWhere: Prisma.ProfileWhereInput = {
    gender: targetGender,
    status: 'APPROVED',
    isLive: true,
    AND: [] // Initialize AND array to hold multiple conditions
  };

  const isHindu = currentUser.profile.religion?.toLowerCase() === 'hindu';

  if (isHindu) {
    // 1. Kootam / Gotram Exclusion
    if (currentUser.profile.koottam) {
      (profileWhere.AND as Prisma.ProfileWhereInput[]).push({
        NOT: {
          koottam: {
            equals: currentUser.profile.koottam.trim(),
            mode: 'insensitive'
          }
        }
      });
    }

    // 2. One-directional Nakshatra Porutham Matching
    if (currentUser.profile.nakshatra && currentUser.profile.poruthaNakshatram.length > 0) {
      (profileWhere.AND as Prisma.ProfileWhereInput[]).push(
        { nakshatra: { in: currentUser.profile.poruthaNakshatram } }
      );
    }
  } else {
    // For other religions, match strictly on religion, caste, and subCaste
    profileWhere.religion = currentUser.profile.religion;
    
    if (currentUser.profile.caste) {
      profileWhere.caste = currentUser.profile.caste;
    }
    
    if (currentUser.profile.subCaste) {
      profileWhere.subCaste = currentUser.profile.subCaste;
    }
  }

  // Defensively validate and append optional filters only when values are defined and non-empty
  if (filters?.caste && typeof filters.caste === 'string' && filters.caste.trim() !== '') {
    profileWhere.caste = filters.caste.trim();
  }
  if (filters?.subCaste && typeof filters.subCaste === 'string' && filters.subCaste.trim() !== '') {
    profileWhere.subCaste = filters.subCaste.trim();
  }
  if (filters?.koottam && typeof filters.koottam === 'string' && filters.koottam.trim() !== '') {
    (profileWhere.AND as Prisma.ProfileWhereInput[]).push({
      koottam: { 
        contains: filters.koottam.trim(), 
        mode: 'insensitive' 
      }
    });
  }

  // Remove empty AND to avoid Prisma errors if no conditions were pushed
  if (Array.isArray(profileWhere.AND) && profileWhere.AND.length === 0) {
    delete profileWhere.AND;
  }

  const whereClause: Prisma.UserWhereInput = {
    id: { not: currentUserId },
    status: 'ACTIVE',
    profile: {
      is: profileWhere
    }
  };

  const matches = await prisma.user.findMany({
    where: whereClause,
    include: {
      profile: {
        include: { educations: true }
      },
      family: true,
      expectations: true,
      // Include contact approvals to see if we have requested/received contact
      sentRequests: {
        where: { recipientId: currentUserId }
      },
      receivedRequests: {
        where: { requesterId: currentUserId }
      }
    },
    take: 50,
  });

  // 3. Privacy Masking Rules Layer
  const sanitizedMatches = matches.map(match => {
    // Female Privacy Masking
    if (match.profile?.gender === 'FEMALE') {
      if (match.mobile_no) match.mobile_no = 'Hidden for Safety';
      
      if (match.profile.houseAddress) match.profile.houseAddress = 'Hidden for Safety';
      
      if (match.family) {
        if (match.family.fatherMobile) match.family.fatherMobile = 'Hidden for Safety';
        if (match.family.motherMobile) match.family.motherMobile = 'Hidden for Safety';
        if (match.family.workingAddress) match.family.workingAddress = 'Hidden for Safety';
      }
    }

    // Photo Protection
    if (match.profile?.hidePhoto) {
      match.profile.photoUrl = '/static/assets/blurred-avatar.png';
    }

    // Community Certificate Protection
    if (match.profile) {
      match.profile.casteCertificateUrl = null;
    }

    return match;
  });

  return sanitizedMatches;
}

export async function requestContact(recipientId: string) {
  const requesterId = await getUserId();
  if (!requesterId) return { success: false, error: 'Not authenticated' };
  
  await prisma.contactApproval.upsert({
    where: {
      requesterId_recipientId: {
        requesterId,
        recipientId
      }
    },
    create: {
      requesterId,
      recipientId,
      status: 'PENDING'
    },
    update: {
      status: 'PENDING' // or reset if previously rejected
    }
  });
  
  revalidatePath('/profiles');
  return { success: true };
}

export async function respondToContact(requesterId: string, status: 'ACCEPTED' | 'REJECTED') {
  const recipientId = await getUserId();
  
  await prisma.contactApproval.update({
    where: {
      requesterId_recipientId: {
        requesterId,
        recipientId
      }
    },
    data: {
      status
    }
  });
  
  revalidatePath('/profiles');
  return { success: true };
}

export async function fetchUserByProfileId(profileId: string) {
  return await prisma.user.findFirst({
    where: { profile: { id: profileId } }
  });
}

export async function getRecentProfiles(limit: number = 10) {
  const currentUserId = await getUserId();
  if (!currentUserId) return [];

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    include: { profile: true }
  });

  if (!currentUser?.profile || String(currentUser.profile.status) !== 'APPROVED') {
    return [];
  }

  const targetGender = currentUser.profile.gender === 'MALE' ? 'FEMALE' : 'MALE';

  const recentUsers = await prisma.user.findMany({
    where: {
      profile: {
        gender: targetGender,
        status: 'APPROVED',
        isLive: true,
      },
      status: 'ACTIVE',
    },
    include: {
      profile: { include: { educations: true } },
      family: true,
      expectations: true,
      sentRequests: { where: { recipientId: currentUserId } },
      receivedRequests: { where: { requesterId: currentUserId } }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });

  // Apply privacy filters
  return recentUsers.map(match => {
    if (match.profile?.gender === 'FEMALE') {
      if (match.mobile_no) match.mobile_no = 'Hidden for Safety';
      if (match.profile.houseAddress) match.profile.houseAddress = 'Hidden for Safety';
      if (match.family) {
        if (match.family.fatherMobile) match.family.fatherMobile = 'Hidden for Safety';
        if (match.family.motherMobile) match.family.motherMobile = 'Hidden for Safety';
        if (match.family.workingAddress) match.family.workingAddress = 'Hidden for Safety';
      }
    }
    if (match.profile?.hidePhoto) {
      match.profile.photoUrl = '/static/assets/blurred-avatar.png';
    }
    if (match.profile) match.profile.casteCertificateUrl = null;
    return match;
  });
}

export async function getProfileById(targetUserId: string) {
  const currentUserId = await getUserId();
  
  const parsedIndex = parseInt(targetUserId, 10);
  const possibleUserIndex = !isNaN(parsedIndex) && parsedIndex >= 1000 ? parsedIndex - 1000 : -1;

  const targetUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: targetUserId },
        { id: { startsWith: targetUserId.toLowerCase() } },
        { userid: targetUserId },
        { profile: { displayId: targetUserId } },
        ...(possibleUserIndex >= 0 ? [{ userIndex: possibleUserIndex }] : [])
      ]
    },
    include: {
      profile: {
        include: { educations: true }
      },
      family: {
        include: { siblings: true }
      },
      expectations: true,
      sentRequests: currentUserId ? {
        where: { recipientId: currentUserId }
      } : undefined,
      receivedRequests: currentUserId ? {
        where: { requesterId: currentUserId }
      } : undefined
    }
  });

  if (!targetUser) return null;

  // Masking protected fields strictly as per requirements
  if (targetUser.profile) {
    targetUser.profile.hideMobileNo = true; // Force UI to not show
    targetUser.profile.hideHouseAddress = true;
    targetUser.profile.hideHouseLocation = true;
    
    // Also explicitly nullify them so they don't even reach the client
    (targetUser as any).mobile_no = null;
    if (targetUser.family) {
      targetUser.family.fatherMobile = null;
      targetUser.family.motherMobile = null;
      targetUser.family.workingAddress = null;
      targetUser.family.googleLocation = null;
    }
    targetUser.profile.houseAddress = null;

    // Photo Protection
    if (targetUser.profile.hidePhoto) {
      targetUser.profile.photoUrl = '/static/assets/blurred-avatar.png';
    }

    // Community Certificate Protection
    targetUser.profile.casteCertificateUrl = null;
  }

  return targetUser;
}

export async function getSentInterestsForUser() {
  const userId = await getUserId();
  if (!userId) return [];

  const requests = await prisma.contactApproval.findMany({
    where: { requesterId: userId },
    select: { recipientId: true }
  });

  return requests.map(r => r.recipientId);
}

export async function getReceivedInterestsFull() {
  const currentUserId = await getUserId();
  if (!currentUserId) return [];

  const requests = await prisma.contactApproval.findMany({
    where: { recipientId: currentUserId },
    select: { requesterId: true }
  });

  const requesterIds = requests.map(r => r.requesterId);
  if (requesterIds.length === 0) return [];

  const matches = await prisma.user.findMany({
    where: { id: { in: requesterIds }, status: 'ACTIVE' },
    include: {
      profile: { include: { educations: true } },
      family: true,
      expectations: true,
      sentRequests: { where: { recipientId: currentUserId } },
      receivedRequests: { where: { requesterId: currentUserId } }
    }
  });

  return matches.map(match => {
    if (match.profile?.gender === 'FEMALE') {
      if (match.mobile_no) match.mobile_no = 'Hidden for Safety';
      if (match.profile.houseAddress) match.profile.houseAddress = 'Hidden for Safety';
      if (match.family) {
        if (match.family.fatherMobile) match.family.fatherMobile = 'Hidden for Safety';
        if (match.family.motherMobile) match.family.motherMobile = 'Hidden for Safety';
        if (match.family.workingAddress) match.family.workingAddress = 'Hidden for Safety';
      }
    }
    if (match.profile?.hidePhoto) {
      match.profile.photoUrl = '/static/assets/blurred-avatar.png';
    }
    if (match.profile) match.profile.casteCertificateUrl = null;
    return match;
  });
}

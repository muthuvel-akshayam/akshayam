'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { getUserId } from './profile';

export async function toggleShortlist(targetId: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const existing = await prisma.shortlist.findUnique({
      where: {
        userId_targetId: {
          userId,
          targetId,
        }
      }
    });

    if (existing) {
      await prisma.shortlist.delete({
        where: { id: existing.id }
      });
      revalidatePath('/profiles');
      return { success: true, action: 'removed' };
    } else {
      await prisma.shortlist.create({
        data: {
          userId,
          targetId,
        }
      });
      revalidatePath('/profiles');
      return { success: true, action: 'added' };
    }
  } catch (error: any) {
    console.error('Error toggling shortlist:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getShortlistsForUser() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return [];
    }

    const shortlists = await prisma.shortlist.findMany({
      where: { userId },
      select: { targetId: true }
    });

    return shortlists.map(s => s.targetId);
  } catch (error: any) {
    console.error('Error fetching shortlists:', error);
    return [];
  }
}

export async function getShortlistedProfilesFull() {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return [];

    const shortlists = await prisma.shortlist.findMany({
      where: { userId: currentUserId },
      select: { targetId: true }
    });

    const targetIds = shortlists.map(s => s.targetId);
    if (targetIds.length === 0) return [];

    const matches = await prisma.user.findMany({
      where: { id: { in: targetIds }, status: 'ACTIVE' },
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
  } catch (error: any) {
    console.error('Error fetching full shortlists:', error);
    return [];
  }
}

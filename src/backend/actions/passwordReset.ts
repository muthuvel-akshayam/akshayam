'use server';

import prisma from '@/backend/prisma';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Creates a password reset request for a given mobile number or email.
 */
export async function requestPasswordReset(mobileNo: string) {
  if (!mobileNo) {
    return { success: false, error: 'Mobile number is required' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile_no: mobileNo },
          { email: mobileNo }
        ]
      }
    });

    if (!user) {
      // Don't leak if user exists or not for security, but since this is an internal app,
      // it might be helpful to tell them user not found, but we'll stick to generic success or specific error.
      return { success: false, error: 'No user found with this mobile number.' };
    }

    // Check if there's already a pending request
    const existingReq = await prisma.passwordResetRequest.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING'
      }
    });

    if (existingReq) {
      return { success: true, message: 'Password reset request already sent.' };
    }

    await prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        status: 'PENDING'
      }
    });

    return { success: true, message: 'Password reset request sent to admin.' };
  } catch (error: any) {
    console.error('Error creating password reset request:', error);
    return { success: false, error: 'Failed to create request. Please try again.' };
  }
}

/**
 * Admin action: get all password reset requests.
 */
export async function getPasswordResetRequests() {
  try {
    const requests = await prisma.passwordResetRequest.findMany({
      include: {
        user: {
          select: {
            mobile_no: true,
            email: true,
            profile: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' }
      ]
    });
    return { success: true, data: requests };
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return { success: false, error: 'Failed to fetch requests' };
  }
}

/**
 * Admin action: get unread pending requests count.
 */
export async function getUnreadPasswordResetRequestsCount() {
  try {
    const count = await prisma.passwordResetRequest.count({
      where: {
        status: 'PENDING',
        isRead: false
      }
    });
    return { success: true, count };
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return { success: false, count: 0 };
  }
}

/**
 * Admin action: mark a request as read.
 */
export async function markPasswordResetRequestRead(id: string) {
  try {
    await prisma.passwordResetRequest.update({
      where: { id },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error marking as read:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

/**
 * Admin action: mark all as read.
 */
export async function markAllPasswordResetRequestsRead() {
  try {
    await prisma.passwordResetRequest.updateMany({
      where: { status: 'PENDING', isRead: false },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error marking all as read:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

/**
 * Admin action: reset the password and mark request as resolved.
 */
export async function resolvePasswordResetRequest(requestId: string, userId: string, newPasswordPlain: string) {
  if (!newPasswordPlain) {
    return { success: false, error: 'New password cannot be empty' };
  }

  try {
    const hashedPassword = hashPassword(newPasswordPlain);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetRequest.update({
        where: { id: requestId },
        data: { status: 'RESOLVED', isRead: true }
      })
    ]);

    return { success: true, message: 'Password reset successfully and request resolved.' };
  } catch (error: any) {
    console.error('Error resolving request:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}

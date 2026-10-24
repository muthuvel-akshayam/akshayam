'use server';

import prisma from '@/backend/prisma';
import { hashPassword } from '@/backend/crypto';
import { getCurrentUserId } from './auth';

/**
 * Ensures the requesting user is an authenticated administrator.
 */
async function requireAdmin(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }

  return userId;
}

/**
 * Creates a password reset request for a given mobile number or email.
 */
export async function requestPasswordReset(mobileNo: string) {
  if (!mobileNo) {
    return { success: false, error: 'Mobile number is required' };
  }

  const cleanPhone = mobileNo.replace(/\D/g, '').slice(-10);

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile_no: cleanPhone },
          { email: mobileNo }
        ]
      }
    });

    if (!user) {
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
 * Admin action: get all password reset requests. Protected by requireAdmin.
 */
export async function getPasswordResetRequests() {
  try {
    await requireAdmin();

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
    return { success: false, error: error.message || 'Failed to fetch requests' };
  }
}

/**
 * Admin action: get unread pending requests count. Protected by requireAdmin.
 */
export async function getUnreadPasswordResetRequestsCount() {
  try {
    await requireAdmin();

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
 * Admin action: mark a request as read. Protected by requireAdmin.
 */
export async function markPasswordResetRequestRead(id: string) {
  try {
    await requireAdmin();

    await prisma.passwordResetRequest.update({
      where: { id },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error marking as read:', error);
    return { success: false, error: error.message || 'Failed to mark as read' };
  }
}

/**
 * Admin action: mark all as read. Protected by requireAdmin.
 */
export async function markAllPasswordResetRequestsRead() {
  try {
    await requireAdmin();

    await prisma.passwordResetRequest.updateMany({
      where: { status: 'PENDING', isRead: false },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error marking all as read:', error);
    return { success: false, error: error.message || 'Failed to mark as read' };
  }
}

/**
 * Admin action: reset the password and mark request as resolved. Protected by requireAdmin.
 */
export async function resolvePasswordResetRequest(requestId: string, userId: string, newPasswordPlain: string) {
  if (!newPasswordPlain) {
    return { success: false, error: 'New password cannot be empty' };
  }

  try {
    await requireAdmin();

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
    return { success: false, error: error.message || 'Failed to reset password' };
  }
}

/**
 * Reset password directly using OTP verified mobile number.
 * STRICT SECURITY: Requires a valid, recent verified OTP record to prevent account takeover.
 */
export async function resetPasswordDirectly(mobileNo: string, newPasswordPlain: string, resetToken?: string) {
  if (!mobileNo) {
    return { success: false, error: 'Mobile number is required' };
  }
  if (!newPasswordPlain) {
    return { success: false, error: 'New password is required' };
  }
  if (newPasswordPlain.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const cleanPhone = mobileNo.replace(/\D/g, '').slice(-10);

  try {
    // 1. Verify that OTP was genuinely completed for this phone number in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const verifiedRecord = await prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        verified: true,
        createdAt: { gt: fifteenMinutesAgo },
        ...(resetToken ? { id: resetToken } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!verifiedRecord) {
      return { 
        success: false, 
        error: 'OTP சரிபார்ப்பு தேவை அல்லது காலாவதியானது / Verified OTP required or session expired. Please verify again.' 
      };
    }

    // 2. Find target user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile_no: cleanPhone },
          { email: `${cleanPhone}@akshayam.local` }
        ]
      }
    });

    if (!user) {
      return { success: false, error: 'User not found with this mobile number' };
    }

    const hashedPassword = hashPassword(newPasswordPlain);

    // 3. Update password and invalidate the verified OTP record to prevent replay attacks
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      }),
      prisma.otpVerification.delete({
        where: { id: verifiedRecord.id }
      }),
      prisma.passwordResetRequest.updateMany({
        where: { userId: user.id, status: 'PENDING' },
        data: { status: 'RESOLVED', isRead: true }
      })
    ]);

    return { success: true, message: 'Password updated successfully' };
  } catch (error: any) {
    console.error('Error resetting password directly:', error);
    return { success: false, error: 'Failed to reset password. Please try again later.' };
  }
}

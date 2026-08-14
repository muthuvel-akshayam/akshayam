'use server';

import prisma from '@/backend/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function registerAuthUser(mobileNo: string, passwordPlain: string) {
  if (!mobileNo || !passwordPlain) {
    return { success: false, error: 'Mobile number and password are required' };
  }

  const hashedPassword = hashPassword(passwordPlain);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { mobile_no: mobileNo }
    });

    if (existingUser) {
      // Update password if user exists
      const updated = await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
      });
      const cookieStore = await cookies();
      cookieStore.set('auth_token', updated.id, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      });
      return { success: true, userId: updated.id };
    }

    // Fetch max userIndex to generate sequential ID
    const maxUser = await prisma.user.findFirst({
      orderBy: { userIndex: 'desc' },
      select: { userIndex: true }
    });
    const nextIndex = (maxUser?.userIndex || 0) + 1;

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        mobile_no: mobileNo,
        password: hashedPassword,
        email: `${mobileNo}@akshayam.local`,
        userIndex: nextIndex,
        userid: `${1000 + nextIndex}ae`
      }
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', newUser.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return { success: true, userId: newUser.id };
  } catch (error: any) {
    console.error('Error in registerAuthUser:', error);
    return { success: false, error: 'Database connection failed. Please try again.' };
  }
}

export async function loginUser(mobileNo: string, passwordPlain: string) {
  if (!mobileNo || !passwordPlain) {
    return { success: false, error: 'Mobile number and password are required' };
  }

  const hashedPassword = hashPassword(passwordPlain);

  try {
    const user = await prisma.user.findFirst({
      where: { mobile_no: mobileNo }
    });

    if (!user) {
      return { success: false, error: 'User not found with this mobile number' };
    }

    if (user.password !== hashedPassword && user.password !== passwordPlain) {
      return { success: false, error: 'Invalid password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error('Error in loginUser:', error);
    return { success: false, error: 'Database connection failed. Please try again.' };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}

export async function getCurrentUserId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (token) {
      const user = await prisma.user.findUnique({ where: { id: token } });
      if (user) return user.id;
    }
  } catch (e) {
    console.error('Cookie error:', e);
  }
  return 'test-user-id';
}

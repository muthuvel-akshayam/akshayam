'use server';

import prisma from '@/backend/prisma';
import { cookies } from 'next/headers';
import { 
  hashPassword, 
  verifyPassword, 
  createSignedSessionToken, 
  verifySessionToken 
} from '@/backend/crypto';

export async function registerAuthUser(mobileNo: string, passwordPlain: string) {
  if (!mobileNo || !passwordPlain) {
    return { success: false, error: 'Mobile number and password are required' };
  }

  const cleanPhone = mobileNo.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number' };
  }

  const hashedPassword = hashPassword(passwordPlain);

  try {
    const currentUserId = await getCurrentUserId();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { mobile_no: cleanPhone }
    });

    if (existingUser) {
      // If the current logged in user is editing their own phone/profile, allow update
      if (currentUserId && currentUserId === existingUser.id) {
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword }
        });
        const cookieStore = await cookies();
        cookieStore.set('auth_token', createSignedSessionToken(updated.id), {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        });
        return { success: true, userId: updated.id };
      }

      // Security fix: Prevent account takeover by re-registration
      return { 
        success: false, 
        error: 'இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. உள்நுழையவும் / Mobile number is already registered. Please login.' 
      };
    }

    // If user is already logged in and changing to a new, unused mobile number
    if (currentUserId) {
      const updated = await prisma.user.update({
        where: { id: currentUserId },
        data: {
          mobile_no: cleanPhone,
          password: hashedPassword,
          email: `${cleanPhone}@akshayam.local`
        }
      });
      return { success: true, userId: updated.id };
    }

    // Fetch max userIndex to generate sequential ID
    const maxUser = await prisma.user.findFirst({
      where: { userIndex: { not: null } },
      orderBy: { userIndex: 'desc' },
      select: { userIndex: true }
    });
    let nextIndex = (maxUser?.userIndex || 0) + 1;

    let newUser = null;
    let attempts = 0;
    
    while (!newUser && attempts < 10) {
      try {
        newUser = await prisma.user.create({
          data: {
            mobile_no: cleanPhone,
            password: hashedPassword,
            email: `${cleanPhone}@akshayam.local`,
            userIndex: nextIndex,
            userid: `${nextIndex}`
          }
        });
      } catch (e: any) {
        if (e.code === 'P2002') {
          const target = e.meta?.target || [];
          if (target.includes('userid')) {
            nextIndex++;
            attempts++;
          } else {
            return {
              success: false,
              error: 'இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. உள்நுழையவும் / Mobile number is already registered. Please login.'
            };
          }
        } else {
          throw e;
        }
      }
    }

    if (!newUser) {
      return { success: false, error: 'Failed to generate a unique ID. Please try again.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', createSignedSessionToken(newUser.id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return { success: true, userId: newUser.id };
  } catch (error: any) {
    console.error('Error in registerAuthUser:', error);
    return { success: false, error: error.message || 'Database connection failed. Please try again.' };
  }
}

export async function loginUser(mobileNo: string, passwordPlain: string, rememberMe: boolean = true) {
  if (!mobileNo || !passwordPlain) {
    return { success: false, error: 'Mobile number and password are required' };
  }

  const cleanPhone = mobileNo.replace(/\D/g, '').slice(-10);

  try {
    const user = await prisma.user.findFirst({
      where: { mobile_no: cleanPhone }
    });

    if (!user) {
      return { success: false, error: 'User not found with this mobile number' };
    }

    const isMatch = verifyPassword(passwordPlain, user.password);
    if (!isMatch) {
      return { success: false, error: 'Invalid password' };
    }

    // Transparently upgrade legacy SHA-256 or plaintext password to PBKDF2
    if (!user.password?.startsWith('pbkdf2$')) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(passwordPlain) }
      }).catch(err => console.error('Error upgrading password hash:', err));
    }

    const cookieStore = await cookies();
    const cookieOptions: any = {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    };
    
    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
    }
    
    cookieStore.set('auth_token', createSignedSessionToken(user.id), cookieOptions);

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

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get('auth_token')?.value;
    if (!rawToken) return null;

    const validatedUserId = verifySessionToken(rawToken);
    if (validatedUserId) {
      const user = await prisma.user.findUnique({ 
        where: { id: validatedUserId },
        select: { id: true, status: true }
      });
      if (user && user.status !== 'SUSPENDED') {
        return user.id;
      }
    }
  } catch (e) {
    console.error('Cookie error:', e);
  }
  return null;
}

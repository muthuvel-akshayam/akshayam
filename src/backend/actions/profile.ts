'use server'

import { z } from 'zod';
import prisma from '@/backend/prisma';
import { personalInfoSchema, familyDetailsSchema, expectationsSchema } from '@/backend/schema';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId, registerAuthUser } from './auth';

export async function getUserId() {
  return await getCurrentUserId();
}

export async function savePersonalInfo(data: z.infer<typeof personalInfoSchema>) {
  const parsed = personalInfoSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Validation failed:", parsed.error.issues);
    throw new Error("Validation failed: " + JSON.stringify(parsed.error.issues));
  }

  const { 
    mobileNo, 
    password, 
    email, 
    educations, 
    haveChildren,
    numberOfChildren,
    childrenGender,
    childrenAge,
    ...profileData 
  } = parsed.data;

  try {
    let userId = await getUserId();
    
    if (mobileNo && password) {
      const authRes = await registerAuthUser(mobileNo, password);
      if (authRes.success && authRes.userId) {
        userId = authRes.userId;
      }
    }
    // Create user if not exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { 
        id: userId, 
        mobile_no: mobileNo || undefined, 
        email: email || (mobileNo ? `${mobileNo}@akshayam.local` : `test-${userId}@example.com`) 
      },
      update: {
        mobile_no: mobileNo || undefined
      }
    });

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData,
        dob: new Date(profileData.dob),
        educations: {
          create: educations || []
        }
      },
      update: {
        ...profileData,
        dob: new Date(profileData.dob),
        educations: {
          deleteMany: {},
          create: educations || []
        }
      }
    });

    revalidatePath('/profile');
    return { success: true, profile };
  } catch (error: any) {
    console.error('Error saving personal info:', error);
    return { success: false, error: error?.message || 'Database connection failed or operation unsuccessful. Please try again.' };
  }
}

export async function saveFamilyDetails(data: z.infer<typeof familyDetailsSchema>) {
  const parsed = familyDetailsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid family data");
  }

  const userId = await getUserId();
  
  const { siblings, ...familyData } = parsed.data;
  
  try {
    const family = await prisma.family.upsert({
      where: { userId },
      create: {
        userId,
        ...familyData,
        siblings: {
          create: siblings || []
        }
      },
      update: {
        ...familyData,
        siblings: {
          deleteMany: {},
          create: siblings || []
        }
      }
    });

    revalidatePath('/profile');
    return { success: true, family };
  } catch (error: any) {
    console.error('Error saving family details:', error);
    return { success: false, error: 'Database connection failed or operation unsuccessful. Please try again.' };
  }
}

export async function saveExpectations(data: z.infer<typeof expectationsSchema>) {
  try {
    const parsed = expectationsSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Invalid expectations data: " + JSON.stringify(parsed.error.issues));
    }

    const userId = await getUserId();
    
    // Ensure User exists for mock purposes, just in case they skipped step 1
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: 'test@example.com' },
      update: {}
    });

    const { acceptsDivorced, ...expectationsData } = parsed.data;

    const expectations = await prisma.expectations.upsert({
      where: { userId },
      create: {
        userId,
        ...expectationsData,
      },
      update: {
        ...expectationsData,
      }
    });

    revalidatePath('/profile');
    return { success: true, expectations };
  } catch (error: any) {
    console.error('Error saving expectations:', error);
    return { success: false, error: 'Database connection failed or operation unsuccessful. Please try again.' };
  }
}

export async function getFullProfile() {
  const userId = await getUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: { educations: true }
      },
      family: {
        include: { siblings: true }
      },
      expectations: true,
    }
  });
  return user;
}

export async function savePaymentScreenshot(paymentScreenshot: string) {
  try {
    const userId = await getUserId();
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        paymentScreenshot,
        status: "PENDING"
      }
    });

    await prisma.profile.updateMany({
      where: { userId },
      data: { status: "PENDING" }
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error saving payment screenshot:', error);
    return { success: false, error: 'Database connection failed or operation unsuccessful. Please try again.' };
  }
}

export async function markProfileCompleted() {
  try {
    const userId = await getUserId();
    
    await prisma.user.update({
      where: { id: userId },
      data: { status: "PENDING" }
    });

    await prisma.profile.updateMany({
      where: { userId },
      data: { status: "PENDING" }
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error marking profile completed:', error);
    return { success: false, error: 'Database connection failed' };
  }
}

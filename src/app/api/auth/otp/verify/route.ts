import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ success: false, message: 'Phone and OTP are required' }, { status: 400 });
    }

    // Find the latest active OTP for this phone
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ success: false, message: 'தவறான அல்லது காலாவதியான OTP' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ success: false, message: 'தவறான அல்லது காலாவதியான OTP' }, { status: 400 });
    }

    // Check OTP value
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ success: false, message: 'தவறான அல்லது காலாவதியான OTP' }, { status: 400 });
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Check if user exists and update phoneVerified
    const existingUser = await prisma.user.findUnique({
      where: { mobile_no: phone }
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { phoneVerified: true }
      });
    }

    return NextResponse.json({ success: true, message: 'OTP Verified successfully' });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

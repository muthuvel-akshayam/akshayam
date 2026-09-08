import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, message: 'Invalid Indian phone number' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate any existing non-verified OTPs for this phone
    await prisma.otpVerification.updateMany({
      where: { phone, verified: false },
      data: { verified: true } // marking as verified so they are effectively "used/cancelled"
    });

    await prisma.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt
      }
    });

    // Send OTP
    if (process.env.NODE_ENV === 'development') {
      console.log('====================================');
      console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
      console.log('====================================');
    } else {
      // Fast2SMS Integration
      try {
        const apiKey = process.env.FAST2SMS_API_KEY;
        if (apiKey) {
          await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
              'authorization': apiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              route: 'v3',
              sender_id: 'TXTIND', // Default or custom sender ID
              message: `Your Akshayam Matrimony verification code is ${otp}. It is valid for 5 minutes.`,
              language: 'english',
              flash: 0,
              numbers: phone
            })
          });
        } else {
          console.warn('FAST2SMS_API_KEY not configured. OTP not sent.');
        }
      } catch (smsError) {
        console.error('Error sending SMS via Fast2SMS:', smsError);
      }
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error in send OTP route:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

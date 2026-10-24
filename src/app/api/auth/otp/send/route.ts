import { NextResponse } from "next/server";
import prisma from "@/backend/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const cleanPhone = phone?.replace(/\D/g, "").slice(-10);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்" },
        { status: 400 }
      );
    }

    // Rate Limiting 1: Cooldown check (prevent SMS spamming within 45 seconds)
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        createdAt: { gt: new Date(Date.now() - 45 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentOtp) {
      return NextResponse.json(
        { 
          success: false, 
          message: "தயவுசெய்து 45 விநாடிகள் காத்திருந்து மீண்டும் முயற்சிக்கவும் / Please wait 45 seconds before requesting another OTP" 
        },
        { status: 429 }
      );
    }

    // Rate Limiting 2: Maximum 5 OTPs per phone number per hour
    const hourlyCount = await prisma.otpVerification.count({
      where: {
        phone: cleanPhone,
        createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });

    if (hourlyCount >= 5) {
      return NextResponse.json(
        { 
          success: false, 
          message: "அதிகபட்ச முயற்சிகள் கடந்துவிட்டது. 1 மணிநேரம் கழித்து முயற்சிக்கவும் / Hourly limit exceeded. Try again in an hour." 
        },
        { status: 429 }
      );
    }

    // Cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP record to database
    await prisma.otpVerification.create({
      data: {
        phone: cleanPhone,
        otp,
        expiresAt,
      },
    });

    const apiKey = process.env.FAST2SMS_API_KEY;

    // Local fallback if API key is not configured or in dev placeholder
    if (!apiKey || apiKey.includes("your_fast2sms")) {
      console.log("==========================================");
      console.log(`[DEV OTP SMS] Phone: ${cleanPhone} | OTP: ${otp}`);
      console.log("==========================================");
      return NextResponse.json({
        success: true,
        message: "OTP அனுப்பப்பட்டது (Development mode - check terminal)",
      });
    }

    // Fast2SMS Quick OTP API Call
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: `Your OTP for Akshayam Matrimony is ${otp}. Please do not share this with anyone.`,
        language: "english",
        flash: 0,
        numbers: cleanPhone,
      }),
    });

    const result = await response.json();

    if (result.return) {
      return NextResponse.json({
        success: true,
        message: "OTP உங்கள் மொபைல் எண்ணிற்கு அனுப்பப்பட்டது",
      });
    } else {
      console.error("Fast2SMS Error:", result);
      return NextResponse.json(
        { success: false, message: result.message || "SMS அனுப்புவதில் பிழை ஏற்பட்டது" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Fast2SMS Catch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/backend/prisma";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    const cleanPhone = phone?.replace(/\D/g, "").slice(-10);

    if (!cleanPhone || !otp) {
      return NextResponse.json(
        { success: false, message: "தொலைபேசி எண் மற்றும் OTP தேவை" },
        { status: 400 }
      );
    }

    const trimmedOtp = otp.toString().trim();

    // Find the latest active unverified OTP for this phone
    const record = await prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "காலாவதியான அல்லது தவறான OTP / Expired or invalid OTP" },
        { status: 400 }
      );
    }

    if (record.otp !== trimmedOtp) {
      return NextResponse.json(
        { success: false, message: "தவறான OTP / Invalid OTP" },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return NextResponse.json({
      success: true,
      message: "சரிபார்ப்பு வெற்றிகரமாக முடிந்தது",
      resetToken: record.id,
      phone: cleanPhone,
    });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

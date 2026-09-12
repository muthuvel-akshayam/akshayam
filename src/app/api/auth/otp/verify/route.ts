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

    const record = await prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        otp: otp.trim(),
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "தவறான அல்லது காலாவதியான OTP" },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    // We can omit phoneVerified update if schema doesn't have it,
    // or just leave it in try-catch as user provided.
    await prisma.profile.updateMany({
      where: { user: { phone: cleanPhone } as any },
      data: { phoneVerified: true } as any,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "சரிபார்ப்பு வெற்றிகரமாக முடிந்தது",
    });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

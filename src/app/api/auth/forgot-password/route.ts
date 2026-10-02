import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // To prevent email enumeration attacks, return 200 even if email not found
    if (!user) {
      return NextResponse.json({
        message: "If that email is registered, a password reset link has been sent.",
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    sendPasswordResetEmail(user.email, resetLink).catch((err) =>
      console.error("Failed to send reset email:", err)
    );

    return NextResponse.json({
      message: "If that email is registered, a password reset link has been sent.",
      // In dev mode, return the token/link so manual testing is immediately easy
      ...(process.env.NODE_ENV !== "production" ? { debugResetLink: resetLink } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error processing password reset request" },
      { status: 500 }
    );
  }
}

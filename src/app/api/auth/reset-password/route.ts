import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Password reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return NextResponse.json({
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Error resetting password" },
      { status: 500 }
    );
  }
}

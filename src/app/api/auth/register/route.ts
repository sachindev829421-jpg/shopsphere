import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        phone: phone || null,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    // Create session token and set cookie
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as "CUSTOMER" | "ADMIN",
    });

    await setAuthCookie(token);

    // Fire welcome email asynchronously
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    return NextResponse.json(
      {
        message: "Account registered successfully",
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}

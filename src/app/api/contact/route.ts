import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // In production, this can send an email via Resend or save to database/CRM.
    // For now, log the validated customer query and return success response.
    console.log("Customer Support Inquiry received:", {
      ...validatedData,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our customer concierge team will respond within 24 business hours.",
      referenceId: `TICK-${Date.now().toString().slice(-6)}`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

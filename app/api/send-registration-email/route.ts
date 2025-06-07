import { NextResponse } from "next/server";
import { sendUserRegistrationConfirmationEmail } from "@/app/(auth)/register/sendUserRegistrationConfirmationEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user || !user.email || !user.firstName || !user.lastName) {
      return NextResponse.json(
        { message: "Missing required user information" },
        { status: 400 }
      );
    }

    await sendUserRegistrationConfirmationEmail({
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    console.log("Email sent");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending registration email:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}

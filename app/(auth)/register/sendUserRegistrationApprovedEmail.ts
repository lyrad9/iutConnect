"use server";

import { transporter } from "@/src/lib/nodemailer";
import { render } from "@react-email/components";
import UserRegistrationApprovedEmail from "@/emails/user-registration-approved";

export const sendUserRegistrationApprovedEmail = async ({
  user,
  generatedPassword,
}: {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  generatedPassword: string;
}) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000";
  const loginUrl = `${baseUrl}/login`;

  const emailContent = await render(
    UserRegistrationApprovedEmail({
      user,
      password: generatedPassword,
      loginUrl,
    })
  );

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@uniconnect.com",
    to: user.email,
    subject: "Votre inscription a été approuvée",
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

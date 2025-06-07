"use server";

import { transporter } from "@/src/lib/nodemailer";
import { render } from "@react-email/components";
import UserRegistrationRejectedEmail from "@/emails/user-registration-rejected";
import { UserType } from "@/src/types/user";

export const sendUserRegistrationRejectedEmail = async ({
  user,
  reason,
}: {
  user: UserType;
  reason?: string;
}) => {
  const emailContent = await render(
    UserRegistrationRejectedEmail({
      user,
      reason:
        reason ||
        "Vos informations n'ont pas pu être vérifiées. Veuillez réessayer avec des informations correctes.",
    })
  );

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@uniconnect.com",
    to: user.email,
    subject: "Votre demande d'inscription n'a pas été approuvée",
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

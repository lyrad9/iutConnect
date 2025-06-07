"use server";

import { transporter } from "@/src/lib/nodemailer";
import { render } from "@react-email/components";
import AdminUserValidationEmail from "@/emails/admin-user-validation";
import { UserType } from "@/src/types/user";

export const sendAdminUserRegistrationEmail = async ({
  user,
  userId,
}: {
  user: UserType;
  userId: string;
}) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000";
  const validationUrl = `${baseUrl}/admins/users/validation/${userId}`;

  const emailContent = await render(
    AdminUserValidationEmail({
      user,
      validationUrl,
    })
  );

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "Nouvelle demande d'inscription utilisateur",
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

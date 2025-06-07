"use server";

import { transporter } from "@/src/lib/nodemailer";
import { render } from "@react-email/components";
import UserRegistrationConfirmationEmail from "@/emails/user-registration-confirmation";

export const sendUserRegistrationConfirmationEmail = async ({
  user,
}: {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}) => {
  const emailContent = await render(
    UserRegistrationConfirmationEmail({
      firstName: user.firstName,
    })
  );

  const mailOptions = {
    from: '"IUT-university-social-network" <mbakopngako@gmail.com>',
    to: user.email,
    subject: "Confirmation de votre demande d'inscription",
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

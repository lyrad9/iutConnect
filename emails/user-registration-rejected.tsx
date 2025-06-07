import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { UserType } from "../src/types/user";
import { BaseEmail, section, text } from "./base-email";
import { LayoutClient } from "./layout-client";
interface UserRegistrationRejectedEmailProps {
  user: UserType;
  reason: string;
}

export const UserRegistrationRejectedEmail = ({
  user,
  reason,
}: UserRegistrationRejectedEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uniconnect.com";
  const previewText = `Demande d'inscription non approuvée - ${user.firstName} ${user.lastName}`;
  const headingText = "Demande d'inscription non approuvée";
  return (
    <BaseEmail preview={previewText} headingText={headingText}>
      <Section style={section}>
        <Text style={text}>Bonjour {user.firstName},</Text>
        <Text style={text}>
          Nous vous informons que votre demande d&apos;inscription sur
          UniConnect n&apos;a pas pu être approuvée.
        </Text>

        <Section style={reasonSection}>
          <Text className="my-0 text-sm text-destructive">{reason}</Text>
        </Section>

        <LayoutClient>
          <Text style={text}>
            Vous pouvez soumettre une nouvelle demande en vous assurant que
            toutes les informations sont correctes et complètes.
          </Text>
          <Text style={text}>
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur ou si vous
            avez des questions, n&apos;hésitez pas à contacter notre équipe de
            support.
          </Text>
        </LayoutClient>
      </Section>
    </BaseEmail>
  );
};

// Styles
const reasonSection = {
  backgroundColor: "#fff2f2",
  padding: "15px",
  borderRadius: "6px",
  margin: "20px 0",
  /* borderLeft: "4px solid #f87171", */
};

UserRegistrationRejectedEmail.PreviewProps = {
  user: {
    firstName: "John",
    lastName: "Doe",
  },
  reason: "Mot de passe invalide",
};
export default UserRegistrationRejectedEmail;

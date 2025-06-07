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
import { BaseEmail, section, text } from "./base-email";
import { LayoutClient } from "./layout-client";
interface UserRegistrationConfirmationEmailProps {
  firstName: string;
}

export const UserRegistrationConfirmationEmail = ({
  firstName,
}: UserRegistrationConfirmationEmailProps) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000";
  const previewText = `Confirmation de votre demande d'inscription`;
  const headingText = "Demande d'inscription reçue";
  return (
    <BaseEmail preview={previewText} headingText={headingText}>
      <Section style={section}>
        <Text style={text}>Bonjour {firstName},</Text>

        <LayoutClient>
          <Text style={text}>
            Nous vous remercions pour votre inscription sur UniConnect, la
            plateforme sociale de votre université.
          </Text>
          <Text style={text}>
            Votre demande a bien été reçue et est en cours d&apos;examen par
            notre équipe administrative. Ce processus prend généralement moins
            de 48 heures.
          </Text>
          <Text style={text}>
            Vous recevrez un email dès que votre compte sera activé, avec vos
            identifiants de connexion.
          </Text>
          <Text style={text}>
            En attendant, n&apos;hésitez pas à nous contacter si vous avez des
            questions.
          </Text>
        </LayoutClient>
      </Section>
    </BaseEmail>
  );
};

export default UserRegistrationConfirmationEmail;

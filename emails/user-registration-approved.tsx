import * as React from "react";
import { Button, Section, Text, Row, Column } from "@react-email/components";
import { BaseEmail, section, text } from "./base-email";
import { LayoutClient } from "./layout-client";

interface UserRegistrationApprovedEmailProps {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  password: string;
  loginUrl: string;
}

export const UserRegistrationApprovedEmail = ({
  user,
  password,
  loginUrl,
}: UserRegistrationApprovedEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uniconnect.com";
  const previewText = "Votre inscription a été approuvée";
  const headingText = "Bienvenue sur UniConnect !";

  return (
    <BaseEmail preview={previewText} headingText={headingText}>
      <Section style={section}>
        <Text style={text}>Bonjour {user.firstName},</Text>
        <Text style={text}>
          Nous sommes heureux de vous informer que votre inscription sur
          UniConnect a été approuvée !
        </Text>
        <Text style={text}>
          Vous pouvez dès maintenant vous connecter à votre compte et profiter
          de toutes les fonctionnalités de notre plateforme sociale
          universitaire.
        </Text>

        <Section style={credentialsContainer}>
          <Text style={credentialsHeading}>Vos identifiants de connexion</Text>
          <Section style={credentialsBox}>
            <Row>
              <Column>
                <Text style={labelText}>Email :</Text>
              </Column>
              <Column>
                <Text className="text-right" style={valueText}>
                  {user.email}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={labelText}>Mot de passe :</Text>
              </Column>
              <Column>
                <Text className="text-right" style={valueText}>
                  {password}
                </Text>
              </Column>
            </Row>
          </Section>
          <Text style={passwordNote}>
            Nous vous recommandons de changer votre mot de passe après votre
            première connexion.
          </Text>
        </Section>

        <Section className="flex justify-center">
          <Button
            href={loginUrl}
            className="bg-primary cursor-pointer text-white px-4 py-3 rounded-md text-sm"
          >
            Se connecter maintenant
          </Button>
        </Section>
        <LayoutClient>
          <Text style={text}>
            Si vous avez des questions ou besoin d&apos;aide, n&apos;hésitez pas
            à contacter notre équipe de support.
          </Text>
        </LayoutClient>
      </Section>
    </BaseEmail>
  );
};

// Styles

const credentialsContainer = {
  margin: "30px 0",
};

const credentialsHeading = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const credentialsBox = {
  backgroundColor: "#f0f9ff",
  padding: "20px",
  borderRadius: "6px",
  border: "1px solid #bae6fd",
  margin: "10px 0",
};

const passwordNote = {
  fontSize: "14px",
  color: "#666",
  fontStyle: "italic",
  margin: "10px 0 0",
  textAlign: "center" as const,
};

const labelText = {
  fontSize: "14px",
  color: "#666",
  fontWeight: "600",
  margin: "6px 0",
  width: "120px",
};

const valueText = {
  fontSize: "14px",
  color: "#333",
  margin: "6px 0",
  fontFamily: "monospace",
};

const loginButton = {
  backgroundColor: "#2563eb",
  padding: "12px 30px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#fff",
  textDecoration: "none",
  textAlign: "center" as const,
  cursor: "pointer",
};
UserRegistrationApprovedEmail.PreviewProps = {
  user: {
    email: "test@test.com",
    firstName: "John",
    lastName: "Doe",
  },
  loginUrl: "https://uniconnect.com",
  password: "123456",
};

export default UserRegistrationApprovedEmail;

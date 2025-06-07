import * as React from "react";
import {
  Button,
  Heading,
  Img,
  Link,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import { UserType } from "@/src/types/user";
import { BaseEmail, logo, section, text } from "./base-email";

interface AdminUserValidationEmailProps {
  user: UserType;
  validationUrl: string;
}

export const AdminUserValidationEmail = ({
  user,
  validationUrl,
}: AdminUserValidationEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uniconnect.com";
  const previewText = `Nouvelle demande d'inscription - ${user.firstName} ${user.lastName}`;
  const headingText = "Nouvelle demande d'inscription ";

  return (
    <BaseEmail preview={previewText} headingText={headingText}>
      <Section style={section}>
        <Text style={text}>Bonjour Administrateur,</Text>
        <Text style={text}>
          Une nouvelle demande d&apos;inscription a été soumise et nécessite
          votre validation. Voici les informations de l&apos;utilisateur :
        </Text>

        <Section style={infoSection}>
          <Row>
            <Column>
              <Text style={labelText}>Nom :</Text>
            </Column>
            <Column>
              <Text className="text-right" style={valueText}>
                {user.lastName}
              </Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={labelText}>Prénom :</Text>
            </Column>
            <Column>
              <Text className="text-right" style={valueText}>
                {user.firstName}
              </Text>
            </Column>
          </Row>
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
              <Text style={labelText}>Matricule :</Text>
            </Column>
            <Column>
              <Text className="text-right" style={valueText}>
                {user.registrationNumber}
              </Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={labelText}>Fonction :</Text>
            </Column>
            <Column>
              <Text className="text-right" style={valueText}>
                {user.function}
              </Text>
            </Column>
          </Row>
          {user.function === "Etudiant" && (
            <>
              <Row>
                <Column>
                  <Text style={labelText}>Filière :</Text>
                </Column>
                <Column>
                  <Text className="text-right" style={valueText}>
                    {user.fieldOfStudy}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={labelText}>Classe :</Text>
                </Column>
                <Column>
                  <Text className="text-right" style={valueText}>
                    {user.classroom}
                  </Text>
                </Column>
              </Row>
            </>
          )}
        </Section>

        <Text style={text}>
          Veuillez valider ou rejeter cette demande en cliquant sur l&apos;un
          des boutons ci-dessous :
        </Text>

        <Section style={buttonContainer}>
          <Button
            href={`${validationUrl}?action=reject`}
            className="border bg-background shadow-xs hover:bg-accent text-destructive px-4 py-2 rounded-md hover:text-red-600 mr-4"
            /* style={rejectButton} */
          >
            Rejeter
          </Button>
          <Button
            className="bg-accent-foreground text-white px-4 py-2 rounded-md"
            href={`${validationUrl}?action=approve`}
            /*  style={approveButton} */
          >
            Approuver
          </Button>
        </Section>
      </Section>
    </BaseEmail>
  );
};

// Specific styles for this email
const infoSection = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "6px",
  margin: "20px 0",
  /* borderLeft: "4px solid #2563eb", */
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
};

const buttonContainer = {
  display: "flex",
  justifyContent: "center",
  margin: "30px 0",
  gap: "10px",
};

AdminUserValidationEmail.PreviewProps = {
  user: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    registrationNumber: "1234567890",
    function: "Etudiant",
    fieldOfStudy: "Computer Science",
    classroom: "1A",
  },
};

export default AdminUserValidationEmail;

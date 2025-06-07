import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Tailwind,
  Preview,
  Text,
  Hr,
  Heading,
} from "@react-email/components";

interface BaseEmailProps {
  children: React.ReactNode;
  preview?: string;
  headingText?: string;
}

export const BaseEmail = ({
  children,
  preview,
  headingText,
}: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: "hsl(204 12.2% 91.96%)",
                foreground: "hsl(0 0% 20%)",
                primary: "hsl(240 100% 50%)",
                "primary-foreground": "hsl(0 0% 100%)",
                secondary: "hsl(220 14.29% 95.88%)",
                "secondary-foreground": "hsl(215 13.79% 34.12%)",
                muted: "hsl(210 20% 98.04%)",
                "muted-foreground": "hsl(220 8.94% 46.08%)",
                accent: "hsl(207.69 46.43% 89.02%)",
                "accent-foreground": "hsl(224.44 64.29% 32.94%)",
                destructive: "hsl(0 84.24% 60.2%)",
                "destructive-foreground": "hsl(0 0% 100%)",
                border: "hsl(210 9.37% 87.45%)",
                input: "hsl(220 15.79% 96.27%)",
                ring: "hsl(13.21 73.04% 54.9%)",
                radius: "0.75rem",
                shadow2xs: "0px 1px 3px 0px hsl(0 0% 0% / 0.05)",
                shadowxs: "0px 1px 3px 0px hsl(0 0% 0% / 0.05)",
                shadowsm:
                  "0px 1px 3px 0px hsl(0 0% 0% / 0.1), 0px 1px 2px -1px hsl(0 0% 0% / 0.1)",
                shadow:
                  "0px 1px 3px 0px hsl(0 0% 0% / 0.1), 0px 1px 2px -1px hsl(0 0% 0% / 0.1)",
                approve: "#22c55e",
                reject: "#ef4444",
              },
            },
          },
        }}
      >
        {preview && <Preview>{preview}</Preview>}
        <Body style={main}>
          <Container style={container}>
            {/* <Img
              src={`${baseUrl}/images/logo.png`}
              width="120"
              height="50"
              alt="UniConnect"
              style={logo}
            /> */}

            <Heading
              className="text-primary text-2xl text-center"
              /* style={heading} */
            >
              {headingText}
            </Heading>
            {children}
            <Hr style={hr} />
            <Text className="text-sm text-muted-foreground text-center">
              Cet email a été envoyé depuis UniConnect, la plateforme sociale
              universitaire.
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} UniConnect. Tous droits réservés.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Shared styles
export const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Geist, sans-serif",
  padding: "20px 0",
};

export const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "30px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

// Common email component styles
export const logo = {
  margin: "0 auto 20px",
  display: "block",
};

/* export const heading = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "30px 0",
}; */

export const section = {
  margin: "0 0 15px",
};

export const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#444",
  margin: "16px 0",
};

export const hr = {
  borderColor: "#e5e5e5",
  margin: "30px 0 20px",
};

export const footer = {
  fontSize: "12px",
  color: "#777",
  textAlign: "center" as const,
  margin: "6px 0",
};

export default BaseEmail;

import {
  Tailwind,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface RaycastMagicLinkEmailProps {
  url: string;
  host: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const MagicLinkEmail = ({ url, host }: RaycastMagicLinkEmailProps) => (
  <Tailwind
    config={{
      theme: {
        extend: {
          colors: {
            brand: "#007291",
          },
        },
      },
    }}
  >
    <Html>
      <Head />
      <Body className="bg-white font-sans">
        <Preview>Log in with this magic link.</Preview>
        <Container className="mx-auto px-6 py-12 bg-bottom bg-no-repeat">
          {/*    <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={48}
            height={48}
            alt="Raycast"
            className="mx-auto"
          /> */}
          <Heading className="text-2xl font-bold mt-12 text-center">
            🪄 Your magic link
          </Heading>
          <Section className="my-6">
            <Text className="text-base leading-relaxed">
              <Link href={url} className="text-[#FF6363] underline">
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text className="text-base leading-relaxed">
              If you didn&apos;t request this, please ignore this email.
            </Text>
          </Section>
          <Text className="text-base leading-relaxed">
            Best,
            <br />- Raycast Team
          </Text>
          <Hr className="border-t border-gray-300 mt-12" />
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={32}
            height={32}
            className="grayscale mx-auto my-5"
          />
          <Text className="text-xs text-[#8898aa] ml-1">
            Raycast Technologies Inc.
          </Text>
          <Text className="text-xs text-[#8898aa] ml-1">
            2093 Philadelphia Pike #3222, Claymont, DE 19703
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

/* RaycastMagicLinkEmail.PreviewProps = {
  magicLink: "https://raycast.com",
} as RaycastMagicLinkEmailProps;
 */
export default MagicLinkEmail;

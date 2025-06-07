import { Section, Text } from "@react-email/components";
import { text } from "./base-email";
export const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Section className="text-sm text-muted-foreground">
        <Text className="mb-0 mt-0">Cordialement,</Text>
        <Text className="mb-0 mt-0 text-primary">L&apos;équipe UniConnect</Text>
      </Section>
    </>
  );
};

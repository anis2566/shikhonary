import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BaseLayoutProps {
  previewText: string;
  children: React.ReactNode;
  logoUrl?: string;
  footerText?: string;
}

export const BaseLayout = ({
  previewText,
  children,
  logoUrl = "https://nvewxsj7lc.ufs.sh/f/KBFRuJIDuGZHBb0cKJ5ySXvwoEAmTk8Z1yU5K7HGFsIRjcQf", // Replace with actual logo URL
  footerText = "© 2026 Your Company. All rights reserved.",
}: BaseLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={logoUrl} width="40" height="40" alt="Logo" style={logo} />
          </Section>
          <Section style={content}>{children}</Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerTextStyles}>{footerText}</Text>
            <Text style={footerTextStyles}>
              If you have any questions, feel free to reply to this email or
              contact us at support@example.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const logoSection = {
  padding: "32px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
};

const footerTextStyles = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

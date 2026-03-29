import { Button, Section, Text, Heading, Hr } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface InvitationEmailProps {
  tenantName: string;
  inviterName: string;
  invitationLink: string;
}

export const InvitationEmail = ({
  tenantName,
  inviterName,
  invitationLink,
}: InvitationEmailProps) => {
  return (
    <BaseLayout previewText={`Join ${tenantName} on our platform`}>
      <Section style={mainSection}>
        <Heading style={h1}>You're invited!</Heading>
        
        <Text style={text}>
          <strong>{inviterName}</strong> has invited you to join <strong>{tenantName}</strong> on Shikhonary as an administrator.
        </Text>
        
        <Text style={subText}>
          Accept the invitation to start managing students, orchestrating exams, and growing your academy on a secure modern platform.
        </Text>

        <Section style={btnContainer}>
          <Button style={button} href={invitationLink}>
            Accept Invitation
          </Button>
        </Section>
        
        <Text style={subTextLight}>
          This link will expire in 7 days. If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
        
        <Hr style={divider} />
        
        <Text style={teamText}>
          Welcome aboard,
          <br />
          <strong>The Shikhonary Team</strong>
        </Text>
      </Section>
    </BaseLayout>
  );
};

const mainSection = {
  padding: "20px 0",
};

const h1 = {
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
  letterSpacing: "-0.5px",
};

const text = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
};

const subText = {
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const subTextLight = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const button = {
  backgroundColor: "#0ea5e9", // beautiful modern sky blue
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  boxShadow: "0 4px 10px rgba(14, 165, 233, 0.3)", // subtle glow
};

const divider = {
  borderColor: "#f1f5f9",
  margin: "24px 0",
};

const teamText = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

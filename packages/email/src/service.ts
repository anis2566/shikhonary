import { Resend } from "resend";
import { render } from "@react-email/render";
import * as React from "react";
import { WelcomeEmail } from "./components/welcome-email";
import { InvitationEmail } from "./components/invitation-email";
import { VerificationEmail } from "./components/verification-email";
import { PasswordResetEmail } from "./components/password-reset-email";
import { SubscriptionEmail } from "./components/subscription-email";
import { PaymentReceiptEmail } from "./components/payment-receipt-email";
import { TenantWelcomeEmail } from "./components/tenant-welcome-email";
import { ExamNotificationEmail } from "./components/exam-notification-email";
import { addEmailToQueue } from "./queue";

import { config } from "dotenv";
import { resolve } from "node:path";

// Load environment variables
config({ path: resolve(process.cwd(), "../../.env") });

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

// Helper to queue if Redis is configured, otherwise send directly
const queueOrSend = async (data: {
  to: string | string[];
  subject: string;
  html: string;
  from: string;
  text?: string;
}) => {
  const job = await addEmailToQueue(data);
  if (!job) {
    console.log(`[EmailService] Sending email directly to ${data.to}: ${data.subject}`);
    return await resend.emails.send(data);
  }
  return job;
};

export const emailService = {
  welcome: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof WelcomeEmail>,
    ) => {
      const html = await render(React.createElement(WelcomeEmail, props));
      return queueOrSend({
        to,
        subject: "Welcome to our platform!",
        html,
        from,
      });
    },
  },
  invitation: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof InvitationEmail>,
    ) => {
      const html = await render(React.createElement(InvitationEmail, props));
      return queueOrSend({
        to,
        subject: `You've been invited to join ${props.tenantName}`,
        html,
        from,
      });
    },
  },
  verification: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof VerificationEmail>,
    ) => {
      const html = await render(React.createElement(VerificationEmail, props));
      return queueOrSend({
        to,
        subject: "Verify your email address",
        html,
        from,
      });
    },
  },
  passwordReset: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof PasswordResetEmail>,
    ) => {
      const html = await render(React.createElement(PasswordResetEmail, props));
      return queueOrSend({
        to,
        subject: "Reset your password",
        html,
        from,
      });
    },
  },
  subscription: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof SubscriptionEmail>,
    ) => {
      const html = await render(React.createElement(SubscriptionEmail, props));
      return queueOrSend({
        to,
        subject: "Subscription Update",
        html,
        from,
      });
    },
  },
  paymentReceipt: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof PaymentReceiptEmail>,
    ) => {
      const html = await render(
        React.createElement(PaymentReceiptEmail, props),
      );
      return queueOrSend({
        to,
        subject: `Payment Receipt: ${props.receiptNumber}`,
        html,
        from,
      });
    },
  },
  tenantWelcome: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof TenantWelcomeEmail>,
    ) => {
      const html = await render(React.createElement(TenantWelcomeEmail, props));
      return queueOrSend({
        to,
        subject: `Welcome to ${props.tenantName}!`,
        html,
        from,
      });
    },
  },
  examNotification: {
    send: async (
      to: string,
      props: React.ComponentProps<typeof ExamNotificationEmail>,
    ) => {
      const html = await render(
        React.createElement(ExamNotificationEmail, props),
      );
      const subject =
        props.type === "scheduled"
          ? "New Exam Scheduled"
          : "Exam Results Released";
      return queueOrSend({
        to,
        subject,
        html,
        from,
      });
    },
  },

  // Direct send method if needed
  send: async ({
    to,
    subject,
    html,
    text,
    from: customFrom,
  }: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }) => {
    return resend.emails.send({
      from: customFrom || from,
      to,
      subject,
      html,
      text,
    });
  },
};

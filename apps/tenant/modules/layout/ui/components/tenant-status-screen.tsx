import Link from "next/link";
import { ShieldOff, PowerOff, UserX, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

type StatusType = "suspended" | "inactive" | "no-membership";

interface TenantStatusScreenProps {
  type: StatusType;
  tenantName?: string;
}

const STATUS_CONFIG = {
  suspended: {
    icon: ShieldOff,
    accent: "hsl(0 72% 51%)", // Sharp red
    accentMuted: "hsl(0 72% 51% / 0.08)",
    accentBorder: "hsl(0 72% 51% / 0.2)",
    badge: "Account Suspended",
    badgeBg: "hsl(0 72% 51% / 0.1)",
    badgeColor: "hsl(0 72% 51%)",
    headline: "This organization has been suspended.",
    subtext:
      "Access to this workspace has been restricted by the platform administrator. This is usually due to a policy violation or unpaid balance.",
    cta: "Contact Support",
    ctaHref: "mailto:support@shikhonary.com",
    secondaryText: "Return to Sign In",
  },
  inactive: {
    icon: PowerOff,
    accent: "hsl(38 92% 50%)", // Amber
    accentMuted: "hsl(38 92% 50% / 0.08)",
    accentBorder: "hsl(38 92% 50% / 0.2)",
    badge: "Organization Inactive",
    badgeBg: "hsl(38 92% 50% / 0.1)",
    badgeColor: "hsl(38 92% 50%)",
    headline: "This organization is currently inactive.",
    subtext:
      "The workspace has been deactivated. Please contact your platform administrator to restore access.",
    cta: "Contact Support",
    ctaHref: "mailto:support@shikhonary.com",
    secondaryText: "Return to Sign In",
  },
  "no-membership": {
    icon: UserX,
    accent: "hsl(215 20% 65%)", // Slate
    accentMuted: "hsl(215 20% 65% / 0.08)",
    accentBorder: "hsl(215 20% 65% / 0.2)",
    badge: "No Access",
    badgeBg: "hsl(215 20% 65% / 0.1)",
    badgeColor: "hsl(215 20% 65%)",
    headline: "You don't have access to any organization.",
    subtext:
      "Your account isn't linked to an active organization. Ask your administrator to send you an invitation link.",
    cta: "Contact Administrator",
    ctaHref: "mailto:support@shikhonary.com",
    secondaryText: "Return to Sign In",
  },
};

export function TenantStatusScreen({
  type,
  tenantName,
}: TenantStatusScreenProps) {
  const config = STATUS_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sharp geometric background elements — no mesh gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Top-left hard diagonal slash */}
        <div
          className="absolute -top-32 -left-24 w-[480px] h-[480px] rotate-12 opacity-[0.03]"
          style={{ background: config.accent, borderRadius: "0" }}
        />
        {/* Bottom-right counter-slash */}
        <div
          className="absolute -bottom-40 -right-20 w-[520px] h-[520px] -rotate-12 opacity-[0.03]"
          style={{ background: config.accent, borderRadius: "0" }}
        />
        {/* Fine grid lines */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(var(--foreground)) 39px, hsl(var(--foreground)) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(var(--foreground)) 39px, hsl(var(--foreground)) 40px)`,
          }}
        />
      </div>

      {/* Content card — asymmetric left-heavy layout, no centered-hero cliché */}
      <div className="relative z-10 w-full max-w-2xl mx-4 md:mx-auto">
        {/* Top accent bar */}
        <div
          className="h-[3px] w-full mb-0"
          style={{ background: config.accent }}
        />

        <div
          className="border border-border bg-card p-8 md:p-12"
          style={{ borderTop: "none", borderRadius: "0 0 2px 2px" }}
        >
          {/* Badge + Icon row — staggered, not centered */}
          <div className="flex items-start gap-5 mb-8">
            <div
              className="flex-shrink-0 w-14 h-14 flex items-center justify-center"
              style={{
                background: config.accentMuted,
                border: `1px solid ${config.accentBorder}`,
                borderRadius: "2px",
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: config.accent }}
                strokeWidth={1.5}
              />
            </div>

            <div className="flex-1 pt-1">
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase px-2 py-1 mb-3"
                style={{
                  background: config.badgeBg,
                  color: config.badgeColor,
                  border: `1px solid ${config.accentBorder}`,
                  borderRadius: "2px",
                  letterSpacing: "0.12em",
                }}
              >
                {config.badge}
              </span>

              {tenantName && (
                <p
                  className="text-xs font-mono text-muted-foreground"
                  style={{ letterSpacing: "0.05em" }}
                >
                  ORG: {tenantName.toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Headline — typographic brutalism, left-aligned, large */}
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight mb-4 tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {config.headline}
          </h1>

          {/* Divider line — breaks visual weight */}
          <div
            className="w-12 h-[2px] mb-6"
            style={{ background: config.accent }}
          />

          <p className="text-muted-foreground leading-relaxed mb-10 max-w-prose text-[15px]">
            {config.subtext}
          </p>

          {/* Action row — left-aligned, sharp buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a href={config.ctaHref} className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto gap-2 font-semibold h-11 px-6"
                style={{
                  background: config.accent,
                  color: "#fff",
                  borderRadius: "2px",
                  border: "none",
                }}
              >
                <Mail className="w-4 h-4" />
                {config.cta}
              </Button>
            </a>

            <Link href="/auth/sign-in" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 font-medium h-11 px-6"
                style={{ borderRadius: "2px" }}
              >
                <ArrowLeft className="w-4 h-4" />
                {config.secondaryText}
              </Button>
            </Link>
          </div>

          {/* Footer rule */}
          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground font-mono">
              If you believe this is an error, reference your organization
              name and contact{" "}
              <a
                href="mailto:support@shikhonary.com"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                style={{ color: config.accent }}
              >
                support@shikhonary.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

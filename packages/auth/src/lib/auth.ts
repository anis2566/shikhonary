import { betterAuth, type Auth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getAuthConfig } from "./auth-config";

const config = getAuthConfig();

/**
 * Better Auth Server Instance
 */
export const auth = betterAuth({
  ...config,
  plugins: [nextCookies()],
  emailAndPassword: {
    ...config.emailAndPassword,
    enabled: true,
  },
  emailVerification: {
    ...config.emailVerification,
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

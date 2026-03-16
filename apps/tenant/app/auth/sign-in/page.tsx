import type { Metadata } from "next";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export const metadata: Metadata = {
  title: "Sign In | Shikhonary",
  description: "Sign in to your Shikhonary tenant dashboard",
};

export default function SignInPage() {
  return <SignInView />;
}

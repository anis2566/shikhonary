import type { Metadata } from "next";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

export const metadata: Metadata = {
  title: "Sign Up | Shikhonary",
  description: "Create an account for Shikhonary",
};

export default function SignUpPage() {
  return <SignUpView />;
}

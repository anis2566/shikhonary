"use client";

import Link from "next/link";
import { useState } from "react";

import { SignInForm } from "../form/sign-in-form";

export const SignInView = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="font-display text-xl text-primary-foreground font-bold">
                S
              </span>
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Shikhonary
            </span>
          </Link>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card rounded-2xl p-6 sm:p-8">
          <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="link-primary font-medium">
            Sign up
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Need help?{" "}
          <Link
            href="/support"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

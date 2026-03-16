"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Mail, Lock } from "lucide-react";
import z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/shared/form-input";

import { authClient } from "@workspace/auth/client";

import { GoogleButton } from "../components/google-button";

interface SignInProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const schema = z.object({
  email: z.string().email("required"),
  password: z.string().min(8, "required"),
});

type SignInFormValues = z.infer<typeof schema>;

export const SignInForm = ({ isLoading, setIsLoading }: SignInProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);

      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        console.error("Sign in error:", result.error);
        toast.error(result.error.message);
        return;
      }

      if (result.data?.user) {
        toast.success("Signed in successfully!");
        const callbackUrl = searchParams.get("callbackUrl") || "/";
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <GoogleButton isLoading={isLoading} />

      <div className="divider-text my-6">
        <span>or sign in with email</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormInput
            name="email"
            placeholder="Email address"
            icon={Mail}
            className="h-12"
            label="Email"
          />

          <FormInput
            name="password"
            type="password"
            placeholder="Create password"
            icon={Lock}
            showPasswordToggle
            minLength={8}
            className="h-12"
            label="Password"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 h-12 gradient-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Mail, Lock, User } from "lucide-react";
import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/shared/form-input";

import { authClient } from "@workspace/auth/client";

import { GoogleButton } from "../components/google-button";

interface SignUpProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const schema = z.object({
  name: z.string().min(3, "required"),
  email: z.string().email("required"),
  password: z.string().min(8, "required"),
});

type SignUpFormValues = z.infer<typeof schema>;

export const SignUpForm = ({ isLoading, setIsLoading }: SignUpProps) => {
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);

      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        console.error("Sign up error:", result.error);
        toast.error(result.error.message);
        return;
      }

      if (result.data?.user) {
        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <GoogleButton isLoading={isLoading} />

      <div className="divider-text my-6">
        <span>or sign up with email</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormInput
            name="name"
            placeholder="Full name"
            icon={User}
            className="h-12"
            label="Name"
          />

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
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{""}
            <Link href="/terms" className="link-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="link-primary">
              Privacy Policy
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

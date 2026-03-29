"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import {
  Loader2,
  XCircle,
  Clock,
  User,
  Mail,
  Lock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { toast } from "sonner";

import { useValidateInvitation, useAcceptInvitation } from "@workspace/api-client";
import { authClient } from "@workspace/auth/client";

// Schema for new user registration
const newUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Schema for existing user confirmation
const existingUserSchema = z.object({
  password: z.string().min(1, "Please enter your password to confirm"),
});

type NewUserFormValues = z.infer<typeof newUserSchema>;
type ExistingUserFormValues = z.infer<typeof existingUserSchema>;

export const AcceptInvitationView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    data: validationResult,
    isLoading: isValidating,
    error: validationError,
  } = useValidateInvitation(token);

  const acceptMutation = useAcceptInvitation();

  const newUserForm = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: { name: "", password: "", confirmPassword: "" },
  });

  const existingUserForm = useForm<ExistingUserFormValues>({
    resolver: zodResolver(existingUserSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    if (validationResult?.data?.name) {
      newUserForm.setValue("name", validationResult.data.name);
    }
  }, [validationResult, newUserForm]);

  const onNewUserSubmit = async (data: NewUserFormValues) => {
    if (!validationResult?.data) return;
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: validationResult.data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        setIsSubmitting(false);
        return;
      }

      await acceptMutation.mutateAsync({ token });

      setIsSuccess(true);
      toast.success("Welcome aboard! 🎉 Your account has been created.");

      setTimeout(() => router.push("/?message=account-created"), 2000);
    } catch (e: any) {
      toast.error(e.message || "Error accepting invitation");
      setIsSubmitting(false);
    }
  };

  const onExistingUserSubmit = async (data: ExistingUserFormValues) => {
    if (!validationResult?.data) return;
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email: validationResult.data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        setIsSubmitting(false);
        return;
      }

      await acceptMutation.mutateAsync({ token });

      setIsSuccess(true);
      toast.success(
        `Invitation accepted! 🎉 You now have admin access to ${validationResult.data.tenantName}.`,
      );

      setTimeout(() => router.push("/"), 2000);
    } catch (e: any) {
      toast.error(e.message || "Error accepting invitation");
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (!token || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse" />
            </div>
            <p className="mt-6 text-muted-foreground font-medium">
              Validating your invitation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitation = validationResult?.data;

  // Invalid / Not Found State
  if (validationError || !invitation || invitation.status !== "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Invalid Invitation</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              This invitation link is invalid or has already been used. Please
              contact your administrator for a new invitation.
            </p>
            <Button
              onClick={() => router.push("/auth/sign-in")}
              size="lg"
              className="gap-2"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expired State
  if (new Date(invitation.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-amber-500/5">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <Clock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Invitation Expired</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              This invitation has expired. Please reach out to{" "}
              <span className="font-medium text-foreground">
                {invitation.invitedBy}
              </span>{" "}
              for a new invitation.
            </p>
            <Button
              onClick={() => router.push("/auth/sign-in")}
              size="lg"
              className="gap-2"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mt-6 mb-3">
              {invitation.userExists ? "Welcome Back!" : "Account Created!"}
            </h2>
            <p className="text-muted-foreground mb-2">
              You are now an admin of{" "}
              <span className="font-semibold text-foreground">
                {invitation.tenantName}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to dashboard...
            </p>
            <div className="mt-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid State - Main Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm opacity-90">You're invited to join</p>
              <h1 className="text-2xl font-bold">{invitation.tenantName}</h1>
            </div>
          </div>
          <p className="text-sm opacity-90">
            <span className="font-medium">
              {invitation.invitedBy || "An Admin"}
            </span>{" "}
            has invited you to be a Tenant Administrator
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Your Role</p>
              <p className="text-xs text-muted-foreground">
                Full administrative access
              </p>
            </div>
            <Badge className="capitalize">Admin</Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={invitation.email}
                disabled
                className="pl-10 bg-muted/50 border-muted"
              />
            </div>
          </div>

          {invitation.userExists ? (
            <Form {...existingUserForm}>
              <form
                onSubmit={existingUserForm.handleSubmit(onExistingUserSubmit)}
                className="space-y-4"
              >
                <Alert className="border-primary/20 bg-primary/5">
                  <User className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    We found an existing account with this email. Enter your
                    password to confirm and accept the invitation.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={existingUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Accept Invitation <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...newUserForm}>
              <form
                onSubmit={newUserForm.handleSubmit(onNewUserSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={newUserForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter your full name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={newUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Min 8 chars with uppercase, lowercase & number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={newUserForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Re-enter your password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account & Accept <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => router.push("/auth/sign-in")}
            >
              Already have an account?{" "}
              <span className="font-medium">Sign in</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@workspace/ui/components/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import NextTopLoader from "nextjs-toploader";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { DeleteConfirmModal } from "@workspace/ui/shared/delete-confirm-modal";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Shikhonary Tenant",
  description: "The tenant dashboard for Shikhonary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <NuqsAdapter>
          <TRPCReactProvider>
            <Providers>
              {children}
              <NextTopLoader showSpinner={false} />
              <Toaster position="top-right" />
              <DeleteConfirmModal />
            </Providers>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

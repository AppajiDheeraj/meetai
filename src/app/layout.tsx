import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet.AI",
  description: "Build and interact with powerful AI agents effortlessly.",
  keywords: ["AI agents", "Meet.AI", "AI platform", "chatbot builder", "open source AI"],
  authors: [{ name: "Dheeraj Appaji" }],
  icons: {
    icon: "/logo.svg", // Update with your favicon path if different
  },
  openGraph: {
    title: "Meet.AI",
    description: "Create and interact with custom AI agents in seconds.",
    url: "https://meetai.yoursite.com", // Replace with your real URL
    siteName: "Meet.AI",
    images: [
      {
        url: "/logo.svg", // Make sure this image exists in your public/ folder
        width: 1200,
        height: 630,
        alt: "Meet.AI - AI Agent Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${inter.className} antialiased`} suppressHydrationWarning
          >
            <Toaster richColors />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
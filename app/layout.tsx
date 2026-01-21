import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import FooterComponent from "@/components/footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LazyPing",
  description: "Keep your servers alive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative `}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="top-center" />
            {children}
            <FooterComponent />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

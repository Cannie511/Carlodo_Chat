import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import Loading from "./Loading";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carlodo",
  description: "Free app for connect people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-[background-color,color,border-color] duration-300`}
      >
        <TooltipProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
          <Suspense fallback={<Loading />}>
            <Toaster richColors/>
            <div className="min-h-screen w-full relative">
            {/* Radial Gradient Background */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
              }}
            />
            {children}
          </div>
          </Suspense>
        </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import { Suspense } from "react";
import { AppProvider } from "@/components/providers/app-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { FullLoadingProvider } from "@/components/providers/full-loading-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div></div>}>
          <FullLoadingProvider>
            <AppProvider>
              <div className="container">{children}</div>
            </AppProvider>
          </FullLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}

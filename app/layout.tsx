import "./globals.css";
import { Suspense } from "react";
import { AppProvider } from "@/components/providers/app-provider";
import {
  Bodoni_Moda,
  IBM_Plex_Sans_Thai,
  JetBrains_Mono,
  Manrope,
} from "next/font/google";
import { FullLoadingProvider } from "@/components/providers/full-loading-provider";
import { AlertModalProvider } from "@/components/providers/alert-modal-provider";
import { ScannerModalProvider } from "@/components/providers/scanner-modal-provider";
import { ReceiptCameraModalProvider } from "@/components/providers/receipt-camera-modal-provider";
import { Viewport } from "next";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansThai.variable} antialiased`}>
        <Suspense fallback={<div></div>}>
          <FullLoadingProvider>
            <AlertModalProvider>
              <ScannerModalProvider>
                <ReceiptCameraModalProvider>
                  <AppProvider>
                    <div className="container">{children}</div>
                  </AppProvider>
                </ReceiptCameraModalProvider>
              </ScannerModalProvider>
            </AlertModalProvider>
          </FullLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}

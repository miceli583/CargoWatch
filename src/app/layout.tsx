import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Navigation } from "./_components/navigation";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Cargo Watch - America's Freight Protection Network",
  description: "A collaborative community technology platform for the US maritime, intermodal, and trucking community. Share real-time alerts, report incidents, and protect America's freight network together.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-brand-navy text-white antialiased">
        <TRPCReactProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import AuthDebug from "@/components/AuthDebug";
import { constructMetadata } from "@/lib/utils";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className} suppressHydrationWarning={true}>
        <Providers>
          <ClientNavbar />

          <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
            <div className="flex-1 flex flex-col h-full">{children}</div>
            <Footer />
          </main>

          <Toaster />
          <AuthDebug />
        </Providers>
      </body>
    </html>
  );
}

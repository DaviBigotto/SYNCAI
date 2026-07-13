import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "SyncAI - AI Content Distribution",
  description: "Automated TikTok to Instagram Reels synchronization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("dark", inter.variable, sora.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased text-foreground bg-background min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

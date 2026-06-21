import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MobileNavBar from "@/components/MobileNavBar";
import { FavouritesProvider } from "@/lib/favourites/context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rivervalley Rangers AFC | 2026 Redesign",
  description: "Swords' premier football club. Bold, energetic, and community-first since 1981.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal">
        <FavouritesProvider>
          <div className="flex-1 pb-28 md:pb-0">
            {children}
          </div>
          <MobileNavBar />
        </FavouritesProvider>
      </body>
    </html>
  );
}

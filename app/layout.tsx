import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MobileNavBar from "@/components/MobileNavBar";
import { FavouritesProvider } from "@/lib/favourites/context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rivervalleyrangers.ie"),
  title: {
    default: "Rivervalley Rangers AFC",
    template: "%s",
  },
  description: "Swords' premier football club. Bold, energetic, and community-first since 1981.",
  applicationName: "Rivervalley Rangers AFC",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    siteName: "Rivervalley Rangers AFC",
    title: "Rivervalley Rangers AFC",
    description:
      "Swords community football club for youth, senior, inclusive, and Over 35s football.",
    images: [
      {
        url: "/river-valley-rangers-logo-pack-v2/rvr-crest-1024.png",
        width: 1024,
        height: 1024,
        alt: "Rivervalley Rangers AFC crest",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Rivervalley Rangers AFC",
    description:
      "Swords community football club for youth, senior, inclusive, and Over 35s football.",
    images: ["/river-valley-rangers-logo-pack-v2/rvr-crest-1024.png"],
  },
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

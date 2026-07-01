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
    default: "Rivervalley Rangers AFC | Swords Football Club",
    template: "%s | Rivervalley Rangers AFC",
  },
  description:
    "Rivervalley Rangers AFC — Swords' community football club since 1981. Youth academy, DDSL boys and girls teams U7–U17, senior, Over 35s, walking football, and inclusive programmes.",
  keywords: [
    "Rivervalley Rangers AFC",
    "Swords football club",
    "North Dublin football",
    "DDSL youth football",
    "football academy Swords",
    "junior football Dublin",
    "FAI Club Mark",
    "walking football Swords",
    "football for all Dublin",
    "community football Ireland",
  ],
  applicationName: "Rivervalley Rangers AFC",
  authors: [{ name: "1Zero9Studio", url: "https://www.1zero9.com" }],
  creator: "1Zero9Studio",
  publisher: "Rivervalley Rangers AFC",
  alternates: {
    canonical: "https://rivervalleyrangers.ie",
  },
  appleWebApp: {
    capable: true,
    title: "RVR AFC",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://rivervalleyrangers.ie",
    siteName: "Rivervalley Rangers AFC",
    title: "Rivervalley Rangers AFC | Swords Football Club",
    description:
      "Community football club in Swords, North Dublin. Academy, DDSL youth, senior, Over 35s, walking football, and inclusive programmes since 1981.",
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
    site: "@rvrfc1981",
    title: "Rivervalley Rangers AFC",
    description:
      "Community football club in Swords, North Dublin. Academy, DDSL youth, senior, Over 35s, and inclusive football since 1981.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsClub",
              name: "Rivervalley Rangers AFC",
              alternateName: "RVR AFC",
              sport: "Soccer",
              url: "https://rivervalleyrangers.ie",
              logo: "https://rivervalleyrangers.ie/river-valley-rangers-logo-pack-v2/rvr-crest-1024.png",
              image: "https://rivervalleyrangers.ie/river-valley-rangers-logo-pack-v2/rvr-crest-1024.png",
              description:
                "Community football club in Swords, North Dublin. Youth academy, DDSL boys and girls teams U7–U17, senior, Over 35s, walking football, and inclusive programmes since 1981.",
              foundingDate: "1981",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Rivervalley Park",
                addressLocality: "Swords",
                addressRegion: "County Dublin",
                addressCountry: "IE",
              },
              sameAs: [
                "https://www.instagram.com/rvrfc1981",
              ],
              memberOf: {
                "@type": "SportsOrganization",
                name: "Dublin & District Schoolboys/Girls League",
                alternateName: "DDSL",
              },
            }),
          }}
        />
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

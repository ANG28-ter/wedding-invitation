import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lostar = localFont({
  src: "../../public/jawa_modern/font/Lostar.ttf",
  variable: "--font-lostar",
});

const upakarti = localFont({
  src: "../../public/jawa_modern/font/upakarti.ttf",
  variable: "--font-upakarti",
});

export const metadata: Metadata = {
  title: {
    default: "AkaDev Invitation — Undangan Digital Premium",
    template: "%s | AkaDev Invitation",
  },
  description:
    "Platform undangan digital premium untuk hari spesial Anda. Elegan, personal, dan berkesan selamanya. RSVP digital, galeri foto, amplop online, dan guestbook.",
  keywords: ["undangan digital", "wedding invitation", "undangan online", "undangan nikah digital", "akadev"],
  authors: [{ name: "AkaDev" }],
  creator: "AkaDev",
  icons: {
    icon: [
      { url: "/logo/logo-with-background.png" },
      { url: "/logo/logo-with-background.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/logo-with-background.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo/logo-with-background.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "AkaDev Invitation — Undangan Digital Premium",
    description: "Platform undangan digital premium untuk hari spesial Anda.",
    siteName: "AkaDev Invitation",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/logo/logo-with-background.png" }],
  },
  twitter: {
    card: "summary",
    title: "AkaDev Invitation",
    description: "Platform undangan digital premium untuk hari spesial Anda.",
    images: ["/logo/logo-with-background.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bonheur+Royale&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Great+Vibes&family=Lora:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${lostar.variable} ${upakarti.variable}`}>{children}</body>
    </html>
  );
}

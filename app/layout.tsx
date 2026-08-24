import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const repository = process.env.GITHUB_REPOSITORY?.split("/");
const repositoryName = repository?.[1] ?? "";
const deployedUrl = repository
  ? `https://${repository[0]}.github.io${repositoryName.endsWith(".github.io") ? "" : `/${repositoryName}`}`
  : "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(deployedUrl),
  title: "Majestic Creations | Apps, Games, Worlds & Ideas",
  description: "Independent multidisciplinary studio creating apps, Unreal Engine projects, Unity experiences, and original creative work.",
  openGraph: {
    title: "Majestic Creations | Apps, Games, Worlds & Ideas",
    description: "Independent apps, games, immersive worlds, and creative experiments.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Majestic Creations — Apps, Games, Worlds, Ideas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Majestic Creations | Apps, Games, Worlds & Ideas",
    description: "Independent apps, games, immersive worlds, and creative experiments.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

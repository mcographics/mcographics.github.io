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
    type: "website",
    url: deployedUrl,
    siteName: "Majestic Creations",
    title: "Majestic Creations | Apps, Games, Worlds & Ideas",
    description: "Independent apps, games, immersive worlds, and creative experiments.",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Majestic Creations — Apps, Games, Worlds & Ideas",
      type: "image/png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Majestic Creations | Apps, Games, Worlds & Ideas",
    description: "Independent apps, games, immersive worlds, and creative experiments.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("majestic-creations-theme")==="light"){document.documentElement.dataset.theme="light";document.documentElement.style.colorScheme="light"}const a=JSON.parse(localStorage.getItem("majestic-creations-accessibility")||"null");if(a){const r=document.documentElement;r.dataset.textSize=a.textSize||"default";if(a.contrast)r.setAttribute("data-high-contrast","");const v=a.colorVision===true?"deuteranopia":a.colorVision;if(v&&v!=="none")r.dataset.colorVision=v;if(a.linkUnderline)r.setAttribute("data-link-underline","");if(a.motion)r.setAttribute("data-reduce-motion","")}}catch{}` }} />
        <link rel="alternate" type="application/rss+xml" title="Majestic Creations Journal" href="/rss.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <svg className="accessibility-color-filters" aria-hidden="true" focusable="false"><defs><filter id="color-filter-protanopia" colorInterpolationFilters="sRGB"><feColorMatrix values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0" /></filter><filter id="color-filter-deuteranopia" colorInterpolationFilters="sRGB"><feColorMatrix values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0" /></filter><filter id="color-filter-tritanopia" colorInterpolationFilters="sRGB"><feColorMatrix values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0" /></filter></defs></svg>
        <div id="main-content" tabIndex={-1}>{children}</div>
      </body>
    </html>
  );
}

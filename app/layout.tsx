import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, IBM_Plex_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-num",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_NAME = "TEDORI";
const SITE_DESC =
  "副業・フリーランスの手取りを試算。売上・経費・申告区分から、所得税・住民税・社会保険料を概算し、手取り額がわかる無料ツール。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TEDORI｜手取り試算",
    template: "%s｜TEDORI",
  },
  description: SITE_DESC,
  keywords: [
    "手取り",
    "副業",
    "フリーランス",
    "所得税",
    "住民税",
    "確定申告",
    "試算",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: "TEDORI｜手取り試算",
    description: SITE_DESC,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "TEDORI｜手取り試算", description: SITE_DESC },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${notoSerifJP.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_NAME = "TEDORI";
const SITE_DESC =
  "副業・フリーランスの手取りを2シナリオで比較。青色申告と白色の差、税金・社保控除後の手取りを無料試算。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TEDORI｜手取りのもしも比較",
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
    title: "TEDORI｜手取りのもしも比較",
    description: SITE_DESC,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "TEDORI｜手取りのもしも比較", description: SITE_DESC },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { CompareDashboard } from "@/components/CompareDashboard";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "副業・フリーランスの手取り比較シミュレーター",
  description:
    "副業・独立の手取りを2シナリオで比較。青色申告と白色の差、税金・社会保険を差し引いた手取りを無料試算。2025年分概算。",
  alternates: { canonical: SITE_URL },
  keywords: ["副業 手取り 計算", "フリーランス 手取り", "手取り シミュレーション", "青色申告 比較"],
};

export default function HomePage() {
  return <CompareDashboard />;
}

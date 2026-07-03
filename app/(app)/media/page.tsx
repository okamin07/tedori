import { MediaIndex } from "@/components/MediaIndex";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "読みもの｜副業・フリーランスの税金と手取り",
  description:
    "副業の税金、20万ルール、住民税、青色申告65万控除、確定申告ソフト選びなど。検索意図別の解説記事一覧。",
  alternates: { canonical: `${SITE_URL}/media` },
  keywords: ["副業 税金", "確定申告 副業", "青色申告", "フリーランス 社会保険"],
};

export default function MediaPage() {
  return <MediaIndex />;
}

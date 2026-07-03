import { parseArticleMarkup } from "./article-markup";

let failed = 0;

function assert(name: string, ok: boolean) {
  if (!ok) {
    failed++;
    console.error(`✗ ${name}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

const bold = parseArticleMarkup("**限界税率**で計算");
assert("bold parse", bold.some((s) => s.type === "bold" && s.content === "限界税率"));

const mixed = parseArticleMarkup("See [20万ルール](/media/fukugyo-20man-rule) here");
assert(
  "internal link",
  mixed.some((s) => s.type === "link" && s.href === "/media/fukugyo-20man-rule")
);

const ext = parseArticleMarkup("[e-Tax](https://www.e-tax.nta.go.jp/)");
assert("external link", ext.some((s) => s.type === "link" && s.href.startsWith("https://")));

assert("reject unsafe link", !parseArticleMarkup("[x](javascript:alert(1))").some((s) => s.type === "link"));

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("\nAll markup assertions passed");

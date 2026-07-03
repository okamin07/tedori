import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TEDORI｜手取りのもしも比較";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
              <div style={{ width: 8, height: 20, background: "#6366f1", borderRadius: 3, opacity: 0.5 }} />
              <div style={{ width: 8, height: 28, background: "#6366f1", borderRadius: 3 }} />
            </div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>TEDORI</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#0f172a", lineHeight: 1.15 }}>
            2つのシナリオを、
          </span>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#4f46e5", lineHeight: 1.15 }}>
            並べて比較
          </span>
        </div>
        <span style={{ fontSize: 22, color: "#64748b" }}>
          レーダーチャート · 差分表 · 無料
        </span>
      </div>
    ),
    { ...size }
  );
}

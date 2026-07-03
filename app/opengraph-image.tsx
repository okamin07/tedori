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
          background: "#f8f9fb",
          padding: "64px 72px",
        }}
      >
        <div style={{ fontSize: 22, color: "#1d9bf0", fontWeight: 700 }}>TEDORI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#0f1419", lineHeight: 1.2 }}>
            もしもを並べて、
          </span>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#0f1419", lineHeight: 1.2 }}>
            手取りの差で決める
          </span>
        </div>
        <span style={{ fontSize: 24, color: "#536471" }}>
          副業・独立のシナリオ比較 · 無料
        </span>
      </div>
    ),
    { ...size }
  );
}

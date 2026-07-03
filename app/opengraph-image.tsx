import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TEDORI｜手取り試算";
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
          background: "#f6f3ec",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 22, color: "#7a7268", letterSpacing: "0.15em" }}>
          TEDORI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: "#161514", lineHeight: 1.2 }}>
            売上から手取りまで、
          </span>
          <span style={{ fontSize: 56, fontWeight: 700, color: "#161514", lineHeight: 1.2 }}>
            一度に試算する。
          </span>
        </div>
        <span style={{ fontSize: 24, color: "#7a7268" }}>
          副業・フリーランス向け · 無料
        </span>
      </div>
    ),
    { ...size }
  );
}

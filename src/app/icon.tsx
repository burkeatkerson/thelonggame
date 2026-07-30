import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the accent tick over the dark ground — the horizon mark, tiny. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#161826",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 5,
          }}
        >
          <div style={{ width: 7, height: 14, background: "#423a6a", display: "flex" }} />
          <div style={{ width: 7, height: 24, background: "#796cbf", display: "flex" }} />
          <div style={{ width: 7, height: 36, background: "#9184d9", display: "flex" }} />
        </div>
      </div>
    ),
    size,
  );
}

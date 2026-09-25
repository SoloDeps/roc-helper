import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

import { BRAND_COLOR, OG_IMAGE_SIZE, PAGES, SITE_NAME, type PageKey, type PageSeo } from "@/lib/seo";

// ============================================================
// Images de partage (Open Graph / X) — générées AU BUILD par
// `app/og/[image]/route.tsx`, jamais au runtime (export statique).
//
// Satori (moteur de `next/og`) ne lit ni le WebP ni le WOFF2 : les visuels
// passent par `sharp` (→ PNG) et la police est une copie TTF de
// `public/fonts/font-canv.woff2` (Canva Sans), dans `lib/og/fonts/`.
// ============================================================

const fontRegular = readFile(join(process.cwd(), "lib/og/fonts/canva-sans-regular.ttf"));
const fontBold = readFile(join(process.cwd(), "lib/og/fonts/canva-sans-bold.ttf"));

async function publicImageAsPngDataUrl(publicPath: string, maxSize: number): Promise<string> {
  const png = await sharp(join(process.cwd(), "public", publicPath))
    .resize(maxSize, maxSize, { fit: "inside" })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

export function renderPageOgImage(key: PageKey): Promise<ImageResponse> {
  return renderOgImage(PAGES[key]);
}

export async function renderOgImage(page: PageSeo): Promise<ImageResponse> {
  const grid = page.illustrations.length > 1;
  const [regular, bold, logo, ...illustrations] = await Promise.all([
    fontRegular,
    fontBold,
    publicImageAsPngDataUrl("/web-app-manifest-512x512.png", 96),
    ...page.illustrations.map((path) => publicImageAsPngDataUrl(path, grid ? 200 : 420)),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Canva Sans",
          color: "white",
          backgroundColor: BRAND_COLOR,
          backgroundImage:
            "radial-gradient(circle at 78% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%), linear-gradient(135deg, #3a8ab3 0%, #307498 45%, #1b4660 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 700,
            padding: "64px 0 56px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- JSX Satori, pas du DOM */}
            <img src={logo} width={72} height={72} alt="" />
            <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.5 }}>{SITE_NAME}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {page.eyebrow && (
              <span
                style={{
                  fontSize: page.eyebrow.length > 36 ? 20 : 24,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#ffd98a",
                  marginBottom: -8,
                }}
              >
                {page.eyebrow}
              </span>
            )}
            <span style={{ fontSize: page.headline.length > 30 ? 56 : 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
              {page.headline}
            </span>
            <span style={{ fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.85)" }}>
              {page.summary ?? page.description}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24 }}>
            <span
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: "rgba(0,0,0,0.25)",
              }}
            >
              roc-helper.com
            </span>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>Rise of Cultures</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexWrap: "wrap",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            gap: grid ? 24 : 0,
            paddingRight: 40,
          }}
        >
          {illustrations.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- JSX Satori, pas du DOM
            <img
              key={index}
              src={src}
              alt=""
              style={
                grid
                  ? { width: 190, height: 190, objectFit: "contain" }
                  : { maxWidth: 420, maxHeight: 460, objectFit: "contain" }
              }
            />
          ))}
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: "Canva Sans", data: regular, style: "normal", weight: 400 },
        { name: "Canva Sans", data: bold, style: "normal", weight: 700 },
      ],
    },
  );
}

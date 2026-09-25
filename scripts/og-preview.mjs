// ============================================================
// Aperçu local des partages (Discord, X, Google) — outil de dev, hors app.
//
//   pnpm build && pnpm og:preview && pnpm start
//   → http://localhost:3000/og-preview.html
//
// Lit les balises <meta> de chaque page HTML de `out/` et les rend comme les
// cartes Discord / X et un résultat Google, avec les points à surveiller
// (longueurs, image manquante). Les images absolues (https://roc-helper.com/…)
// sont servies depuis `out/`, donc visibles AVANT déploiement.
//
// Écrit `out/og-preview.html` : jamais déployé, la CI refait `next build` sur
// un `out/` vierge.
// ============================================================

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = join(process.cwd(), "out");
const SKIP = new Set(["404.html", "_not-found.html", "og-preview.html"]);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") && !SKIP.has(name) ? [path] : [];
  });
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

function readMeta(html) {
  const head = html.slice(0, html.indexOf("</head>"));
  const meta = {};
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/g)) {
    const key = /(?:property|name)="([^"]+)"/.exec(tag)?.[1];
    const content = /content="([^"]*)"/.exec(tag)?.[1];
    if (key && content !== undefined && !(key in meta)) meta[key] = decode(content);
  }
  meta.title = decode(/<title>([^<]*)<\/title>/.exec(head)?.[1] ?? "");
  meta.canonical = /<link rel="canonical" href="([^"]+)"/.exec(head)?.[1] ?? "";
  return meta;
}

function localImage(url) {
  if (!url) return "";
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function checks(m) {
  const issues = [];
  if (!m["og:image"]) issues.push("Pas de og:image");
  if (!m["og:description"]) issues.push("Pas de og:description");
  if (m.title.length > 70) issues.push(`<title> long (${m.title.length} car., Google coupe vers 60)`);
  if ((m.description ?? "").length > 160)
    issues.push(`description longue (${m.description.length} car., Google coupe vers 155)`);
  if (m["twitter:card"] !== "summary_large_image") issues.push("Carte X non « large image »");
  return issues;
}

const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const pages = htmlFiles(OUT)
  .map((file) => {
    const meta = readMeta(readFileSync(file, "utf8"));
    const path = "/" + relative(OUT, file).replace(/(index)?\.html$/, "").replace(/\/$/, "");
    return { path: path === "/" ? "/" : path, meta };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const cards = pages
  .map(({ path, meta: m }) => {
    const image = localImage(m["og:image"]);
    const host = m.canonical ? new URL(m.canonical).host : "";
    const issues = checks(m);
    return `
<section class="page" data-path="${esc(path)}">
  <header>
    <a href="${esc(path)}" target="_blank"><code>${esc(path)}</code></a>
    ${issues.length ? issues.map((i) => `<span class="warn">⚠ ${esc(i)}</span>`).join("") : '<span class="ok">✓ OK</span>'}
  </header>
  <div class="row">
    <div>
      <h3>Discord</h3>
      <div class="discord" style="border-left-color:${esc(m["theme-color"] ?? "#202225")}">
        <div class="d-site">${esc(m["og:site_name"])}</div>
        <div class="d-title">${esc(m["og:title"])}</div>
        <div class="d-desc">${esc(m["og:description"])}</div>
        ${image ? `<img src="${esc(image)}" alt="">` : ""}
      </div>
    </div>
    <div>
      <h3>X / Twitter</h3>
      <div class="x">
        ${image ? `<div class="x-img"><img src="${esc(image)}" alt=""><span>${esc(m["twitter:title"] ?? m["og:title"])}</span></div>` : ""}
        <div class="x-host">From ${esc(host)}</div>
      </div>
      <h3>Google</h3>
      <div class="g">
        <div class="g-host">${esc(host)} › ${esc(path.slice(1))}</div>
        <div class="g-title">${esc(m.title)}</div>
        <div class="g-desc">${esc(m.description)}</div>
      </div>
    </div>
  </div>
</section>`;
  })
  .join("\n");

writeFileSync(
  join(OUT, "og-preview.html"),
  `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aperçus de partage – RoC Helper</title>
<style>
  body{margin:0;background:#1e1f22;color:#dbdee1;font:14px/1.4 system-ui,sans-serif}
  main{max-width:1200px;margin:0 auto;padding:24px 16px}
  input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1px solid #3f4147;background:#2b2d31;color:inherit;font:inherit;margin-bottom:16px}
  .page{background:#2b2d31;border-radius:12px;padding:16px;margin-bottom:16px}
  .page header{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}
  .page header a{color:#00a8fc}
  .warn{background:#5c3b00;color:#ffd27a;padding:2px 8px;border-radius:6px;font-size:12px}
  .ok{background:#0b3d23;color:#7ee2a8;padding:2px 8px;border-radius:6px;font-size:12px}
  .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:24px}
  h3{margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#949ba4}
  .discord{background:#2b2d31;border:1px solid #1e1f22;border-left:4px solid;border-radius:4px;padding:8px 16px 16px 12px;max-width:432px;background:#232428}
  .d-site{font-size:12px;color:#b5bac1;margin-top:8px}
  .d-title{color:#00a8fc;font-weight:600;margin-top:8px}
  .d-desc{font-size:14px;margin-top:8px;color:#dbdee1}
  .discord img{display:block;width:100%;border-radius:4px;margin-top:16px}
  .x{max-width:504px;margin-bottom:16px}
  .x-img{position:relative;border:1px solid #2f3336;border-radius:16px;overflow:hidden}
  .x-img img{display:block;width:100%}
  .x-img span{position:absolute;left:12px;bottom:12px;background:rgba(0,0,0,.77);color:#fff;padding:0 4px;border-radius:4px;font-size:13px;max-width:90%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .x-host{color:#71767b;font-size:13px;margin-top:4px}
  .g{background:#fff;border-radius:8px;padding:12px 16px;max-width:600px;font-family:arial,sans-serif}
  .g-host{color:#202124;font-size:12px}
  .g-title{color:#1a0dab;font-size:20px;margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .g-desc{color:#4d5156;font-size:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style></head>
<body><main>
<h1>Aperçus de partage (${pages.length} pages)</h1>
<input type="search" placeholder="Filtrer par chemin… (ex. vault)" oninput="for(const s of document.querySelectorAll('.page'))s.hidden=!s.dataset.path.includes(this.value)">
${cards}
</main></body></html>
`,
);

console.log(`✓ out/og-preview.html — ${pages.length} pages`);

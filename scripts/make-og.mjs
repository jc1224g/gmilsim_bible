// 기본 공유 이미지(public/og-default.png, 1200×630) 만들기 — `npm run og`
// 쇼츠 영상과 같은 남색·미색·금색. 글꼴은 Pretendard(OFL, 로컬 파일).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SITE } from '../site.config.mjs';

const font = readFileSync(
  fileURLToPath(new URL('../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2', import.meta.url)),
).toString('base64');

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
@font-face{font-family:P;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#16233a;font-family:P;color:#f7f2e8;position:relative;overflow:hidden}
.glow{position:absolute;right:-180px;top:-200px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,#1f3150 0%,rgba(31,49,80,0) 70%)}
.inner{position:absolute;left:96px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.eyebrow{color:#e8b65a;font-size:34px;font-weight:700;letter-spacing:.02em}
h1{font-size:112px;font-weight:900;letter-spacing:-.02em;margin:18px 0 22px;line-height:1.1}
.bar{width:120px;height:8px;background:#e8b65a;border-radius:4px;margin-bottom:30px}
p{font-size:38px;color:#c9d2e0;font-weight:500}
.star{position:absolute;right:120px;bottom:96px;width:150px;height:150px}
</style></head><body><div class="glow"></div>
<div class="inner"><div class="eyebrow">${SITE.church}</div><h1>${SITE.name}</h1><div class="bar"></div><p>${SITE.series} · 10대·20대를 위한 성경 이야기</p></div>
<svg class="star" viewBox="0 0 64 64"><path d="M32 4l6 22 22 6-22 6-6 22-6-22-22-6 22-6z" fill="#e8b65a"/></svg>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL('../public/og-default.png', import.meta.url)) });
await browser.close();
console.log('public/og-default.png 생성');

// 기본 공유 이미지(public/og-default.png, 1200×630) 만들기 — `npm run og`
// 교회 홈과 같은 미색·갈색. 제목은 Noto Serif KR, 나머지는 Pretendard (둘 다 OFL, 로컬 파일).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SITE } from '../site.config.mjs';

const nm = new URL('../node_modules/', import.meta.url).href;
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="${nm}@fontsource/noto-serif-kr/700.css">
<style>
@font-face{font-family:P;src:url(${nm}pretendard/dist/web/variable/woff2/PretendardVariable.woff2) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#faf8f4;font-family:P;color:#24211d;position:relative;overflow:hidden}
.inner{position:absolute;left:96px;right:96px;top:0;bottom:120px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{color:#6b4a2b;font-size:32px;font-weight:500}
h1{font-family:'Noto Serif KR',serif;font-size:116px;font-weight:700;margin:20px 0 28px;line-height:1.15}
p{font-size:36px;color:#5c574f;font-weight:400}
.band{position:absolute;left:0;right:0;bottom:0;height:120px;background:#2f2620;color:#f4ede4;display:flex;align-items:center;padding:0 96px;font-size:30px;gap:28px}
.band b{font-family:'Noto Serif KR',serif;font-weight:700;color:#d9b48c}
</style></head><body>
<div class="inner"><div class="eyebrow">${SITE.church}</div><h1>${SITE.name}</h1><p>설교를 청소년·청년·장년이 읽기 좋게 풀어 쓴 글</p></div>
<div class="band"><b>${SITE.series}</b><span>성경 전체를 꿰는 한 단어, 하나님 나라</span></div>
</body></html>`;
const tmp = new URL('../node_modules/.cache/og/', import.meta.url);
mkdirSync(fileURLToPath(tmp), { recursive: true });
const file = new URL('og.html', tmp);
writeFileSync(fileURLToPath(file), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(file.href);
await page.evaluate(async () => { await document.fonts.load("700 116px 'Noto Serif KR'", '쉽게 배우는 성경하나님 나라 100강'); await document.fonts.ready; });
await page.screenshot({ path: fileURLToPath(new URL('../public/og-default.png', import.meta.url)) });
await browser.close();
console.log('public/og-default.png 생성');

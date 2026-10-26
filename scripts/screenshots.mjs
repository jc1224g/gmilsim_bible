// 로컬 화면 점검용 스크린샷 — 먼저 `npm run build && npm run build:preview` 후 `npm run shots`
// dist(운영)와 dist-preview(미리보기)를 각각 로컬 http 서버로 띄워 390px·1440px, 밝은/어두운 모드로 찍습니다.
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'screenshots');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

function serve(dir, port) {
  return new Promise((res) => {
    const s = http.createServer(async (req, rsp) => {
      let p = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      try { if ((await stat(p)).isDirectory()) p = join(p, 'index.html'); } catch {}
      try {
        const body = await readFile(p);
        rsp.writeHead(200, { 'Content-Type': types[extname(p)] || 'application/octet-stream' });
        rsp.end(body);
      } catch {
        rsp.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        rsp.end(await readFile(join(dir, '404.html')));
      }
    }).listen(port, () => res(s));
  });
}

const shots = [
  { base: 'prod', path: '/', name: 'prod-home' },
  { base: 'preview', path: '/', name: 'preview-home' },
  { base: 'preview', path: '/lessons/1/', name: 'preview-lesson1' },
  { base: 'preview', path: '/lessons/999/', name: 'preview-lesson999-test', only: true },
  { base: 'prod', path: '/nope/', name: 'prod-404', only: true },
];

await mkdir(out, { recursive: true });
const servers = { prod: await serve(join(root, 'dist'), 4321), preview: await serve(join(root, 'dist-preview'), 4322) };
const ports = { prod: 4321, preview: 4322 };
const browser = await chromium.launch();
for (const s of shots) {
  for (const width of [390, 1440]) {
    for (const scheme of s.only ? ['light'] : ['light', 'dark']) {
      if (s.only && width === 1440) continue;
      const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: width === 390 ? 2 : 1 });
      const page = await ctx.newPage();
      const requests = [];
      page.on('request', (r) => { if (!r.url().startsWith('http://localhost')) requests.push(r.url()); });
      await page.goto(`http://localhost:${ports[s.base]}${s.path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      const file = `${s.name}-${width}-${scheme}.png`;
      await page.screenshot({ path: join(out, file), fullPage: true });
      console.log(file, overflow ? '가로 넘침!' : '', requests.length ? `외부요청: ${requests.join(', ')}` : '');
      await ctx.close();
    }
  }
}
await browser.close();
Object.values(servers).forEach((s) => s.close());

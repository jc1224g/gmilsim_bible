// 배포 전 점검 — `npm run build` 뒤 `npm run check:public`
// dist(운영 빌드)에서 공개하면 안 되는 것을 찾습니다. 걸리면 멈추고 사람이 확인하세요.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const checks = [
  { name: '휴대폰 번호', re: /01[016789]-?\d{3,4}-?\d{4}/g },
  { name: '전화번호', re: /\b0\d{1,2}-\d{3,4}-\d{4}\b/g },
  { name: '계좌번호 모양', re: /\b\d{3,6}-\d{2,6}-\d{2,8}\b/g },
  { name: '주민번호 모양', re: /\b\d{6}-[1-4]\d{6}\b/g },
  { name: '확인필요 표시', re: /\[!?확인필요[^\]]*\]/g },
  { name: '초안/테스트 글', re: /초안 — 공개 전|class="test-flag"/g },
];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(html|xml|txt)$/.test(e.name)) yield p;
  }
}

let problems = 0;
for await (const file of walk(dist)) {
  const text = (await readFile(file, 'utf8')).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  for (const c of checks) {
    const found = text.match(c.re);
    if (found) {
      problems++;
      console.log(`! ${file.replace(dist, 'dist')}: ${c.name} → ${[...new Set(found)].slice(0, 5).join(', ')}`);
    }
  }
}
console.log(problems ? `\n${problems}건 확인 필요 (위 목록). 사람 확인 전에는 배포하지 마세요.` : '문제 없음');
process.exit(problems ? 1 : 0);

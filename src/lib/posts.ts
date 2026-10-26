import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../../site.config.mjs';

export type Post = CollectionEntry<'posts'>;

/** PREVIEW=1 로 빌드하면 초안까지 보여 주는 미리보기 모드 */
export const isPreview = process.env.PREVIEW === '1';

/** 공개 조건: 승인됐고(approved: true) 초안이 아닌 글(draft가 true가 아님) */
export const isPublic = (p: Post) => p.data.approved === true && p.data.draft !== true;

/** 판(독자층) — 탭 순서이기도 해요. */
export const EDITIONS = [
  { key: 'teen', label: '청소년', note: '10대' },
  { key: 'young', label: '청년', note: '대학생·20~30대' },
  { key: 'adult', label: '장년', note: '40대 이상' },
] as const;
export type Edition = (typeof EDITIONS)[number]['key'];
export const editionLabel = (e: Edition) => EDITIONS.find((x) => x.key === e)!.label;

/** 편 번호 (part가 없으면 1) */
export const partOf = (p: Post) => p.data.part ?? 1;

/** 편 이름: "① 질문편" (partTitle이 없으면 "① 1편") */
const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩';
export const partLabel = (p: Post) => {
  const n = partOf(p);
  const mark = n <= CIRCLED.length ? CIRCLED[n - 1] : `${n}.`;
  return `${mark} ${p.data.partTitle ?? `${n}편`}`;
};

/** 모든 판의 글 (미리보기가 아니면 공개된 것만) */
export async function getAllEditions(): Promise<Post[]> {
  const all = await getCollection('posts');

  // 같은 번호·같은 판이 두 번 쓰이면 주소가 겹치므로 빌드를 멈춥니다.
  const seen = new Map<string, string>();
  for (const p of all) {
    const key = `${p.data.no}/${p.data.edition}/${partOf(p)}`;
    const prev = seen.get(key);
    if (prev) throw new Error(`[posts] no: ${p.data.no} (${p.data.edition}, ${partOf(p)}편) 가 두 파일에 있어요: ${prev}, ${p.id}`);
    seen.set(key, p.id);
    // 파일 이름 앞 번호와 no가 다르면 실수일 가능성이 높아요.
    const m = p.id.match(/^(\d+)/);
    if (m && Number(m[1]) !== p.data.no) {
      throw new Error(`[posts] 파일 이름(${p.id})의 번호와 no: ${p.data.no} 가 달라요.`);
    }
  }

  const order = (e: Edition) => EDITIONS.findIndex((x) => x.key === e);
  return all
    .filter((p) => isPreview || isPublic(p))
    .sort((a, b) => a.data.no - b.data.no || order(a.data.edition) - order(b.data.edition) || partOf(a) - partOf(b));
}

/** 강마다 대표 글 하나 (청소년 → 청년 → 장년 순으로 있는 것). 목록·RSS용 */
export async function getPosts(): Promise<Post[]> {
  const seen = new Set<number>();
  return (await getAllEditions()).filter((p) => !seen.has(p.data.no) && seen.add(p.data.no));
}

/** 강 주소. 대표 글은 /lessons/1/, 그 밖의 판은 /lessons/1/young/ 처럼. 2편부터는 /lessons/1/2/, /lessons/1/young/2/ */
export const postUrl = (p: Post, primary = true) =>
  `/lessons/${p.data.no}/` + (primary ? '' : `${p.data.edition}/`) + (partOf(p) > 1 ? `${partOf(p)}/` : '');

/** 같은 강·같은 판의 편 수 (목록에 "N편" 표시용) */
export const partCount = (all: Post[], p: Post) =>
  all.filter((x) => x.data.no === p.data.no && x.data.edition === p.data.edition).length;
export const seasonUrl = (s: number) => `/seasons/${s}/`;
export const seasonName = (s: number) => {
  const name = (SITE.seasons as Record<number, string>)[s];
  return name ? `시즌 ${s} · ${name}` : `시즌 ${s}`;
};

export function groupBySeason(posts: Post[]) {
  const map = new Map<number, Post[]>();
  for (const p of posts) {
    const list = map.get(p.data.season) ?? [];
    list.push(p);
    map.set(p.data.season, list);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

export const fromList = (p: Post) => (Array.isArray(p.data.from) ? p.data.from : [p.data.from]);

export const formatDate = (d: Date) =>
  `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

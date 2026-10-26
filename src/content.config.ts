import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 글(강) 하나의 front matter 규칙. 규칙에 안 맞으면 빌드가 멈추고 어느 파일·어느 칸이 틀렸는지 알려 줍니다.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string().min(1),
      no: z.number().int().positive(),
      date: z.coerce.date(),
      summary: z.string().min(1),
      // 바탕 설교/강의: 한 줄 또는 목록
      from: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
      season: z.number().int().positive(),
      // 판: teen(청소년) · young(청년) · adult(장년). 같은 강(no)의 판마다 파일 하나씩.
      edition: z.enum(['teen', 'young', 'adult']).default('teen'),
      // 한 강을 여러 편으로 나눌 때만: part(1부터) + partTitle(예: "질문편"). 없으면 편 없는 보통 글.
      part: z.number().int().min(1).optional(),
      partTitle: z.string().min(1).optional(),
      draft: z.boolean().default(false),
      approved: z.boolean().default(false),
      // 유튜브 쇼츠 영상 ID (11자리). 주소 전체가 아니라 ID만.
      shorts: z
        .string()
        .regex(/^[A-Za-z0-9_-]{11}$/, '유튜브 영상 ID(11자리)만 적어 주세요. 예: dQw4w9WgXcQ')
        .optional(),
      tags: z.array(z.string()).optional(),
      // 3줄 요약 (최대 3줄)
      tldr: z.array(z.string().min(1)).min(1).max(3).optional(),
      // 단어 카드
      words: z
        .array(z.object({ word: z.string().min(1), meaning: z.string().min(1) }))
        .optional(),
      // O/X 퀴즈
      quiz: z
        .array(
          z.object({
            q: z.string().min(1),
            answer: z.enum(['O', 'X']),
            explain: z.string().optional(),
          }),
        )
        .optional(),
      // 다음 강 예고
      next: z.string().optional(),
      // 테스트용 글 표시 (실제 콘텐츠가 아님)
      test: z.boolean().default(false),
    })
    .strict(),
});

export const collections = { posts };

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import remarkLessonBlocks from './src/plugins/remark-lesson-blocks.mjs';
import { unified } from '@astrojs/markdown-remark';
import { SITE_URL } from './site.config.mjs';

export default defineConfig({
  site: SITE_URL,
  base: '/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    // 본문 안 :::tmi 상자 문법을 쓰려고 remark(unified) 처리기를 씁니다.
    // 원고의 따옴표 등을 그대로 두기 위해 smartypants(곧은 따옴표→둥근 따옴표 자동 변환)는 끕니다.
    processor: unified({ smartypants: false, remarkPlugins: [remarkDirective, remarkLessonBlocks] }),
  },
});

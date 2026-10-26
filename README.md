# 「쉽게 배우는 성경」 블로그 (정적 사이트)

광명일심교회 「쉽게 배우는 성경」(10대·20대, 해요체, 하나님 나라 52강) 블로그입니다.
[Astro](https://astro.build)로 만든 정적 사이트이고, 주소는 `https://bible.gmilsim.org`(GitHub Pages)로 정해졌습니다.
주보·홈 화면은 지금처럼 Apps Script 웹앱을 계속 씁니다.

> 아직 배포하지 않았습니다. 저장소 만들기, push, DNS 설정은 아래 「배포 전 할 일」을 마친 뒤에 합니다.

## 준비

```bash
cd blog
npm ci          # 처음 한 번 (Node 24)
```

## 글 추가하기

1. `src/content/posts/` 에 파일을 만듭니다. 파일 이름은 `번호-제목.md` (예: `002-왕이신-하나님.md`).
   파일 이름 앞 번호와 `no:`는 같아야 합니다(다르면 빌드가 멈춰요).
2. 맨 위에 front matter를 적고, 그 아래에 본문을 Markdown으로 씁니다.
3. `npm run dev` 로 띄워 휴대폰 폭에서 확인합니다(초안도 보여요).

```markdown
---
title: 왕이신 하나님이 세상을 지으셨어요
no: 2
season: 1
date: 2026-11-04
draft: true
approved: false
summary: 카톡 미리보기와 목록에 나오는 한두 문장 소개.
from:
  - "[SER] 창 1.1-5 ○○○.docx"
tldr:
  - 첫째 줄 요약
  - 둘째 줄 요약
  - 셋째 줄 요약
words:
  - word: 창조
    meaning: 하나님이 없던 것을 있게 하신 것
quiz:
  - q: 세상은 우연히 생겼다.
    answer: X
    explain: 짧은 해설(선택)
shorts: 유튜브영상ID11
next: 다음 강 예고 한두 문장
tags: [하나님 나라, 창세기]
---

본문을 여기에 씁니다. ## 소제목, > 성경 인용, **굵게**, - 목록을 그대로 쓸 수 있어요.

:::tmi[바실레이아가 뭐예요?]
본문 중간에 넣는 TMI 상자예요. :::tmi[제목] 으로 열고 ::: 로 닫아요. 제목은 생략 가능.
:::
```

### front matter 칸

| 칸 | 필수 | 설명 |
|---|---|---|
| `title` | ✔ | 제목 |
| `no` | ✔ | 강 번호(정수). 주소가 됩니다: `/lessons/2/` |
| `season` | ✔ | 시즌 번호(정수). 시즌 이름은 `site.config.mjs`의 `seasons`에 |
| `date` | ✔ | 날짜 `YYYY-MM-DD` |
| `summary` | ✔ | 한두 문장 소개(카톡·검색 미리보기, 목록). `tldr`가 없으면 글 위에 대신 보여요 |
| `from` | ✔ | 바탕 설교·강의. 한 줄 또는 목록. 글 맨 끝에 보여요 |
| `part` |  | 한 강을 여러 편으로 나눌 때만: 편 번호(1 이상 정수). 비우면 편 없는 보통 글 |
| `partTitle` |  | 편 이름. 예: `"질문편"`, `"답편"`. 화면에는 「① 질문편」처럼 나와요 |
| `draft` |  | `true`면 초안(기본 `false`) |
| `approved` |  | 목사 승인 표시(기본 `false`). **`true`여야 공개** |
| `tldr` |  | 3줄 요약(최대 3줄) |
| `words` |  | 단어 카드 목록 (`word`, `meaning`) |
| `quiz` |  | O/X 퀴즈 목록 (`q`, `answer: O` 또는 `X`, `explain` 선택). 답은 어디에도 저장·전송하지 않아요. 자바스크립트가 꺼져 있어도 「정답 보기」로 답이 보여요 |
| `shorts` |  | 유튜브 쇼츠 **영상 ID 11자리**(주소 전체 아님). 재생을 누를 때만 youtube-nocookie에서 불러와요 |
| `next` |  | 다음 강 예고 |
| `tags` |  | 태그 목록 |
| `test` |  | 테스트용 가짜 글 표시(`999-테스트.md` 전용) |

- 칸 이름을 잘못 쓰거나(예: `sources`) 형식이 틀리면 **빌드가 멈추고 어느 파일·어느 칸인지 알려 줍니다.**
- `[`로 시작하는 값이나 `:`가 들어간 값은 큰따옴표로 감싸세요: `- "[SER] …"`.
- 글 순서(이전·다음 강)는 `no` 순서입니다.
- **한 강을 여러 편으로 나누기**: 같은 `no`로 파일을 편마다 하나씩 만들고 `part: 1`·`part: 2`, `partTitle`을 적습니다(파일 이름 예: `001-하나님-나라-상편.md`, `001-하나님-나라-하편.md`). 주소는 1편이 기존 그대로(`/lessons/1/`, `/lessons/1/young/`), 2편부터 `/lessons/1/2/`, `/lessons/1/young/2/`. 글 위에 편 이동 표시, 글 끝에 「다음 편 →」이 생기고, 목록·RSS에는 강 하나(1편 주소)로 나오며 목록에 「2편」 표시가 붙어요. 판 탭은 같은 편 번호의 다른 판으로 가고, 없으면 그 판의 1편으로 가요. 같은 강·같은 판·같은 편 번호가 겹치면 빌드가 멈춥니다.

## 미리보기 빌드와 운영 빌드

| 명령 | 결과 | 들어가는 글 |
|---|---|---|
| `npm run dev` | 로컬 개발 서버(미리보기 모드) | 전부(초안 포함) |
| `npm run build` | **운영 빌드** → `dist/` | `approved: true` 이고 `draft`가 `true`가 아닌 글만 |
| `npm run build:preview` | 미리보기 빌드 → `dist-preview/` | 전부. 화면 위 줄무늬 띠, 글마다 「초안 — 공개 전」 표시, 검색엔진 차단(noindex, robots Disallow) |
| `npm run serve` / `npm run serve:preview` | 빌드 결과를 로컬에서 열기 (`npx astro preview stop`으로 끄기) | |
| `npm run check:public` | `dist/`에서 전화번호·계좌번호 모양, `[확인필요]`, 초안·테스트 글 흔적 찾기 | |
| `npm run shots` | `screenshots/`에 390px·1440px, 밝은/어두운 화면 저장 | |
| `npm run og` | 기본 공유 이미지 `public/og-default.png` 다시 만들기 | |

**`dist-preview/`는 절대 배포하지 마세요.** 배포는 언제나 `npm run build`(운영 빌드)만.

## 주소 규칙

- 글: `/lessons/1/`, `/lessons/2/` … (강 번호). 한글 주소는 카톡·문자로 보낼 때 `%ED%95%98…`처럼 길게 깨져 보여서 숫자로 했어요. 제목을 고쳐도 주소가 안 바뀝니다.
- 시즌: `/seasons/1/` · 소개: `/about/` · RSS: `/rss.xml` · 사이트맵: `/sitemap-index.xml`
- 사이트 주소는 `site.config.mjs`의 `SITE_URL` 한 곳에서 바꿉니다(canonical·OG·RSS·사이트맵이 모두 따라감).

## 지키는 것

- 분석 도구·쿠키·외부 스크립트 없음. 글꼴(Pretendard, OFL)은 사이트 안에 포함(`public/licenses/`에 라이선스).
- 유튜브는 재생 버튼을 누를 때만 연결.
- 개인정보 3등급 원칙: 🟢 공개 자료만. 전화·계좌·사람 이름은 발행 전 `check:public`과 사람 눈으로 확인.

## 배포 전 할 일

1. **교회 확인**
   - [ ] `소개` 페이지의 `[확인필요]` 교회 소개 문구를 목사 확인 후 채우기
   - [ ] 시즌 이름(`site.config.mjs` `seasons`) 정하기
   - [ ] 바탕 설교 표기 방식 정하기: 지금은 원고의 파일 이름 그대로(`[SER] 막4.1-12 ….hwp`) 보여요. 공개용으로 `막 4:1-12 「하나님 나라의 비유」`처럼 바꿀지
   - [ ] 제1강 신학팀 수정본 반영 후 다시 옮기기(문구는 원본에서만 고치기)
2. **GitHub Pages (권장: GitHub Actions 방식)**
   - [ ] 교회 계정으로 GitHub 저장소 만들기(예: `gmilsim/bible`). 이 `blog/` 폴더를 저장소 맨 위로
   - [ ] Settings → Pages → Source = **GitHub Actions** (`.github/workflows/deploy.yml` 이미 들어 있음).
         gh-pages 브랜치 방식보다 빌드 결과물을 저장소에 커밋하지 않아도 되고, `main`에 승인된 글이 들어가면 자동 배포돼서 권장
   - [ ] Settings → Pages → Custom domain = `bible.gmilsim.org` (`public/CNAME` 이미 들어 있음)
3. **도메인 DNS** (gmilsim.org 관리 화면)
   - [ ] `CNAME` 레코드: 이름 `bible` → 값 `<GitHub 사용자/조직 이름>.github.io`
   - [ ] (권장) GitHub Settings → Pages에서 도메인 소유 확인(TXT 레코드)
4. **HTTPS**
   - [ ] DNS가 퍼지고 인증서가 발급되면 Settings → Pages → **Enforce HTTPS** 켜기
5. **승인·게시 흐름** (구현은 아직 안 함, 아이디어)
   - [ ] 새 글은 `draft: true, approved: false`로 올림 → 에르메스가 미리보기 빌드 링크를 **텔레그램**으로 목사에게 보냄
   - [ ] 목사가 텔레그램에서 **"승인"**으로 답장 → `approved: true`로 바꿈(누가·언제 승인했는지 기록 남기기)
   - [ ] **에르메스 cron**: 평일 저녁(예: **수요일 20:00 KST**)에 승인된 글 중 다음 차례 한 편만 `draft: false`로 바꿔 `main`에 push → Actions가 배포. LLM 없이 스크립트만
   - [ ] 미리보기 링크를 어디에 둘지(로컬/비공개 주소) 정하기 — 미리보기 빌드는 검색 차단이 되어 있지만 공개 주소에 올리지 않는 것이 안전
   - [ ] 배포 직전 `npm run build && npm run check:public` 통과 확인
6. **배포 후 점검**
   - [ ] 휴대폰에서 실제 주소 열기, 카카오톡으로 링크 보내 미리보기(OG) 확인
       (카톡은 미리보기를 캐시하므로 이미지를 바꾸면 카카오 개발자 「공유 디버거」에서 캐시 지우기)
   - [ ] Sites 홈과 기존 `?page=blog` 메뉴에서 새 주소로 연결

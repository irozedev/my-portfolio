# CLAUDE.md

Guidance for Claude Code (and any AI assistant) working in this repo.

## What this is
Personal portfolio for **Stepan Roze** — live at **roze.live**. A single-page
React app. Two audiences via a **view mode** toggle: **Client** (hire me:
services, prices, projects) and **Company** (full CV: experience + skills).
Multilingual (en, uk, nl, ar, es), dark/light theme.

## Stack
- **React 18 + Vite 6 + TypeScript**
- **Tailwind CSS v4**, **Motion** (`motion/react`, the framer-motion successor)
- **react-slick** carousel (services)
- **Supabase** edge function backend (`make-server-a62f57c7`) for chat AI,
  contact form, comments, reactions, auth
- Deploy: **Netlify** (`netlify.toml`). `dist/` is **committed to git**.

## Commands
- Dev server: `npm run dev` → **http://localhost:3000/**
- Build (always verify green after changes): `npx vite build`
- Netlify build command: `npm run build` → publishes `dist/`
- Lint: `npm run lint`
- **Package manager is pnpm** (`pnpm-lock.yaml`). `npm run <script>` works, but
  `npm install <pkg>` **fails** (`Cannot read properties of null (matches)`) due
  to `pnpm.overrides` in package.json. To add a dep use pnpm/corepack, or for a
  throwaway tool install it in an isolated temp dir instead of the project.
- **Do not push unless asked.** Commit when asked; the user often reviews first.

## Where things live
- `src/app/App.tsx` — providers + top-level page routing (hash based)
- `src/app/components/main-page.tsx` — renders sections per view mode
- `src/app/components/hero-ultra-modern.tsx` — hero (client = agency split,
  company = professional profile)
- `src/app/components/services-creative-slider.tsx` — services + **prices**
  (hardcoded array, NOT from translations)
- `src/app/components/how-i-work.tsx` — process + honest part-time timelines
  (self-contained translations via an inline `L()` helper)
- `src/app/components/portfolio-creative-slider.tsx` — projects grid (owned work
  only: marinek.store, roze.live) → opens `project-fullscreen-view.tsx`
- `src/app/components/github-showcase.tsx` — live GitHub feed (@irozedev)
- `src/utils/translations.ts` — **huge** 5-language dictionary. Newer components
  skip it and localize inline with an `L(en,uk,nl,ar,es)` helper.
- `src/app/contexts/view-mode-context.tsx` — `client` | `cv`, `setViewMode`

## The chat assistant (important)
- **The live chat is in `scroll-to-top-button.tsx`.** It also holds the
  scroll-to-top button. This is the ONLY mounted chat.
- `chat-bot.tsx` and `ai-assistant-smart.tsx` are **dead code** — do not edit
  them expecting the site to change.
- The chat is a **sales funnel + smart local assistant, 100% in-browser (zero
  API cost)**:
  - Funnel stages: `intro → budget → timeline → name → email → done`.
    Collects a lead, then POSTs to the `/contact` endpoint (saved server-side +
    emailed via Resend). Quick-reply chips drive each stage.
  - `assistantReply(input, language)` = local intent engine (navigation, site
    guide, view-mode switch, prices, timelines, stack, availability, contact,
    github, CV, experience, location, spoken languages). Returns optional
    **action** buttons (nav-scroll, switch view, open link, start quote).
  - `localAnswer(...)` = shared info knowledge base; returns `""` when nothing
    matches so the funnel treats input as a project description.
- **Real LLM is currently NOT called.** An optional backend exists at Supabase
  `POST .../ai/chat` (Claude Haiku) but is unused. If a hybrid is wanted, call it
  only on `matched:false`, and it needs `ANTHROPIC_API_KEY` set in Supabase
  secrets (paid). Without the key it returns `{model:"fallback"}`.

## Supabase / backend
- Project ref: **`saeohtepfpuzzajfduad`** (note: `...tep...`, an old typo
  `...tef...` appears as a harmless default in the server source).
- Function base path: `/functions/v1/make-server-a62f57c7`
- Secrets (set in Supabase dashboard → Edge Functions):
  - `RESEND_API_KEY` — emails contact/chat leads to **rozedev095@gmail.com**.
    Without it, leads are still saved to the KV store (visible on `#admin`).
  - `ANTHROPIC_API_KEY` — real AI chat (optional, unused right now).
- `src/utils/supabase/info.tsx` holds `projectId` + `publicAnonKey`.

## SEO
Two layers, keep them consistent:
- `index.html` — static meta tags + 5 JSON-LD blocks (crawlers/social scrapers).
- `src/app/components/seo-head.tsx` — runtime meta per language.
- OG image: `public/og-image.jpg` (1200×630). Section anchors: `#hero`,
  `#services`, `#how-i-work`, `#projects`, `#github`, `#about`, `#contact`
  (client), `#experience` (company).

## Facts about Stepan (keep copy truthful — no fabrication)
- **Front-End / JavaScript developer, 8+ years.** React, Vue, Next.js,
  TypeScript, Node.js, Knockout.js, Magento.
- Real clients (Experience only, per NDA): childrensalon.com, vogacloset.com
  (luxury e-commerce), Oschadbank (banking CRM). **Never** put employer/client
  work in the public Projects gallery — only owned projects there.
- Belgium; opening a **bijberoep** (secondary self-employment). Small-business
  **VAT franchise** (no VAT charged under ~€25k/yr).
- Works a main job; builds **mornings 06:00–12:00 CET**, ~20h/week. Takes 1–2
  projects at a time.
- Email **rozedev095@gmail.com** (single canonical email). GitHub **@irozedev**.
- Pricing (starting, no VAT): automation €45/h (or €350/bot), websites €650,
  UI design €400, web apps €60/h, e-commerce €1,200, consulting €55/h.

## Gotchas learned the hard way
- **`backdrop-filter` on an ancestor traps `position:fixed` descendants**
  (mobile menu had to move OUTSIDE the blurred `<nav>`).
- **react-slick `.slick-center`**: with `centerMode:false` no center class is
  added, so blur/dim CSS leaves all cards dimmed. (Fixed by using a plain grid.)
- **Global `keydown` handlers must ignore typing.** `use-slider-navigation.ts`
  called `preventDefault()` on Space/arrows globally and ate spaces in every
  input; it now bails when the target is input/textarea/select/contenteditable.
- Fullscreen project view: no per-frame `setState` on scroll (janky on mobile);
  no parallax transform on the hero image (left a black gap).

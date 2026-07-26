# CLAUDE.md

Guidance for Claude Code (and any AI assistant) working in this repo.

## What this is
Personal portfolio for **Stepan Roze** — live at **roze.live**. A single-page
React app. Two audiences via a **view mode** toggle: **Client** (hire me:
services, prices, projects) and **Company** (full CV: experience + skills).
Multilingual (en, uk, nl, ar, es), dark/light theme.

## Stack
- **React 19 + Vite 8 + TypeScript 5.9**
- **Tailwind CSS v4.3**, **Motion** (`motion/react`, the framer-motion successor)
- Services carousel is **CSS scroll-snap**, not a library (react-slick is gone)
- **Supabase** edge function backend (`make-server-a62f57c7`) for chat AI,
  contact form, comments, reactions, auth
- Deploy: **Netlify** (`netlify.toml`). `dist/` is **committed to git**.

**Vite 8 bundles with rolldown**, so build config is `build.rolldownOptions`
(not `rollupOptions`) and chunking uses `output.advancedChunks.groups`.
`esbuild` is an explicit devDependency only because `@tailwindcss/node` still
imports it and pnpm does not hoist it.

## Commands
- Dev server: `npm run dev` → **http://localhost:3000/** (another project may
  already hold that port — pass `--port` if the page looks like someone else's)
- `npm run check` = typecheck + lint + build. **All three must be green**;
  they are as of the 2026-07 cleanup, so any error you see is yours.
- Lint is at **0 errors / 32 warnings**, and `--max-warnings 32` is a ratchet:
  the count may go down, never up. The remainder is 20 `any`, 9
  `exhaustive-deps` and 2 non-null assertions — each needs a judgement call at
  its own call site, so do not silence them in bulk.
- Netlify build command: `npm run build` → publishes `dist/`
- **Package manager is pnpm** (`pnpm-lock.yaml`); install via
  `corepack pnpm install`. pnpm 11 no longer reads the `pnpm` field from
  package.json — **overrides and build-script approvals live in
  `pnpm-workspace.yaml`**. `@types/react` is pinned there: transitive peers pull
  their own copy, and two copies of the React types make every component
  "not a valid JSX element type".
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
- `src/app/hooks/use-modal-a11y.ts` — Escape, focus trap and focus restore for
  dialogs. **Every modal must use it**; none of them had any of this before.

## Design tokens
- Weight scale and fluid type scale are Tailwind v4 `@theme` variables in
  `src/styles/tailwind.css`. `font-bold` deliberately emits 600 and
  `font-black` 700 — the design wants everything a notch lighter. Set it there,
  never with `!important` overrides in `fonts.css` (that is what the old code
  did, and a class always beat those element selectors anyway).
- Light-theme accents are darker than the dark-theme cyan **because they must
  clear 4.5:1 on white**. `#0891b2` was 3.68:1 and failed AA; do not "restore"
  the brighter cyan for light mode.
- Always-on cyan glow is capped at `rgba(0,217,255,0.18)` / 24px blur.
  Hover-only glow can be stronger — interaction feedback, not decoration.

## The chat assistant (important)
- **The live chat is in `scroll-to-top-button.tsx`.** It also holds the
  scroll-to-top button. This is the ONLY mounted chat.
- The old duplicate chats (`chat-bot.tsx`, `ai-assistant-smart.tsx`) were
  deleted in the 2026-07 cleanup along with 98 other unreachable files.
  Before adding a component, check it is actually reached from `src/main.tsx`.
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
- **Global `keydown` handlers must ignore typing.** A slider hook once called
  `preventDefault()` on Space/arrows globally and ate spaces in every input.
  The services carousel now scopes its arrow handling to the focused track.
- **Keyboard focus is a single global rule** in `index.css`
  (`:focus-visible` + `!important`). 68 buttons had no focus style at all; do
  not go back to per-component focus rings.
- **`react-hooks/rules-of-hooks` is an error, not a warning.**
  `project-fullscreen-view.tsx` had `if (!project) return null` above two
  effects, which crashes with "Rendered more hooks than during the previous
  render" the moment the prop flips. Guards go after every hook.
- Fullscreen project view: no per-frame `setState` on scroll (janky on mobile);
  no parallax transform on the hero image (left a black gap).
- **Theme is driven by `data-theme` on `<html>`**, set by `theme-context.tsx`
  and pre-applied by an inline script in `index.html` (no flash). Do **not**
  go back to `root.style.setProperty(...)` for the palette — inline styles on
  `<html>` outrank every stylesheet, so a partial inline palette leaves the
  vars it doesn't cover stuck on their dark values. The full palettes live in
  `src/styles/theme.css` (`:root` = dark, `[data-theme="light"]` = light).
  `theme-context.tsx` also owns the `theme-color` meta — don't set it elsewhere.
- **Arabic is cursive.** `letter-spacing`, `word-spacing` and a Latin-only font
  (Inter, Manrope, generic `monospace`) all break letter joining or render
  tofu. `src/styles/fonts.css` loads Noto Sans/Naskh Arabic and neutralises
  those properties under `*:lang(ar)`.
- **`?lang=` is real.** `language-context.tsx` reads it on load (priority:
  URL > localStorage > browser) and `handleSetLanguage` mirrors the choice back
  into the URL. `index.html`, `public/sitemap.xml` and `seo-head.tsx` all
  publish hreflang alternates built on it — keep the three in sync. Ukrainian
  is published as `?lang=ua`, English as the bare origin `/` (also x-default).
- **Never inline a Supabase key as an env fallback in the edge function.**
  `supabase/functions/server/index.tsx` used to default to the real
  `service_role` key; the repo is public. Supabase injects `SUPABASE_URL`,
  `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` automatically.
- `#admin` is gated on the owner Supabase account (`OWNER_EMAIL` in
  `admin-page.tsx`), not a hardcoded password. It only edits localStorage, so
  it is not a security boundary — anything sensitive needs a server-side check.
- `src/app/components/projects-section.tsx` is dead code with **pre-existing
  syntax errors**; it fails `tsc --noEmit` for the whole project. Vite never
  bundles it, so builds stay green. Delete it or fix it before relying on tsc.

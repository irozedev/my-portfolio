# roze.live — Stepan Roze Portfolio

Personal portfolio for **Stepan Roze**, Front-End / JavaScript Developer.
Single-page React app, live at **[roze.live](https://roze.live)**.

[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646cff?style=flat&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Edge-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)

---

## What it is

Two audiences, one page, switched by a **view mode** toggle:

- **Client** — services, pricing, process, owned projects, contact
- **Company** — full CV: experience timeline and skills

Five languages (`en`, `uk`, `nl`, `ar`, `es`) with RTL support for Arabic, and a
dark/light theme. A local, zero-cost chat assistant doubles as a lead funnel.

## Stack

- **React 19 + Vite 8 + TypeScript 5.9**, **Tailwind CSS v4.3**
- **Motion** (`motion/react`) for animation
- **Supabase** — OAuth sign-in (Google / GitHub) and an edge function
  (`make-server-a62f57c7`) backing the contact form, comments and reactions
- Services carousel is CSS `scroll-snap`, not a library
- Deployed on **Netlify** (`netlify.toml`); `dist/` is committed to the repo

**Vite 8 bundles with rolldown**, so build config lives under
`build.rolldownOptions` and chunking under `output.advancedChunks.groups`.

> Auth is **Supabase**, not Firebase. Earlier revisions of this file said
> Firebase — that dependency is gone.

## Commands

```bash
npm run dev         # dev server → http://localhost:3000
npm run build       # production build → dist/
npm run preview     # serve the built output
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run check       # typecheck + lint + build
```

**The package manager is pnpm** (`pnpm-lock.yaml`). `npm run <script>` is fine,
but install with `corepack pnpm install`. Overrides and build-script approvals
live in `pnpm-workspace.yaml` — pnpm 11 no longer reads the `pnpm` field from
`package.json`.

## Layout

```
src/
  app/
    App.tsx              providers + hash-based page routing
    components/          one file per section; main-page.tsx composes them
    contexts/            theme, language, auth, view-mode, availability
    hooks/
  styles/                index.css imports fonts / tailwind / theme
  utils/                 translations, supabase client, scroll helpers
supabase/functions/      Deno edge function (contact, comments, chat)
docs/                    setup and reference guides
```

Section anchors: `#hero`, `#services`, `#how-i-work`, `#projects`, `#github`,
`#about`, `#contact` (client) and `#experience` (company).

## Configuration

The edge function reads its secrets from the Supabase dashboard
(Edge Functions → Secrets). Never inline them in source — this repo is public.

| Secret | Purpose |
| --- | --- |
| `RESEND_API_KEY` | emails contact/chat leads; without it leads are still stored in the KV store |
| `ANTHROPIC_API_KEY` | optional real-LLM chat (currently unused) |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected
into edge functions automatically.

## Admin

`/#admin` is gated on the owner Supabase account (`OWNER_EMAIL` in
`src/app/components/admin-page.tsx`). It edits localStorage only, so it is not a
security boundary — anything sensitive needs a server-side check too.

## Docs

| Guide | |
| --- | --- |
| [Env setup](docs/ENV_SETUP.md) | environment variables, and where secrets actually live |
| [OAuth sign-in](docs/GOOGLE_AUTH_SETUP.md) | Google and GitHub provider configuration |
| [SEO setup](docs/SEO_SETUP.md) | meta, JSON-LD, sitemap, hreflang, GA4 |

Seven other guides used to sit here. They documented Firebase, `recharts`,
`react-router`, Cloudflare, Vercel and React 18 — none of which this project uses
— and gave instructions that actively broke things: the wrong env-var name for
GA4, an OAuth redirect path that does not exist, port 5173, and a `gtag` snippet
to paste into `index.html` that would have bypassed cookie consent. They were
deleted rather than translated, because a confidently wrong guide costs more than
no guide at all.

`CLAUDE.md` holds the working notes that remain accurate, including the gotchas
that cost real debugging time.

## License

Personal project — all rights reserved. One remaining UI primitive
(`src/app/components/ui/button.tsx`) derives from
[shadcn/ui](https://ui.shadcn.com/); the other 45 were removed in the 2026-07
cleanup. See [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

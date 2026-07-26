# roze.live — Stepan Roze Portfolio

Personal portfolio for **Stepan Roze**, Front-End / JavaScript Developer.
Single-page React app, live at **[roze.live](https://roze.live)**.

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff?style=flat&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Edge-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)

---

## What it is

Two audiences, one page, switched by a **view mode** toggle:

- **Client** — services, pricing, process, owned projects, contact
- **Company** — full CV: experience timeline and skills

Five languages (`en`, `uk`, `nl`, `ar`, `es`) with RTL support for Arabic, and a
dark/light theme. A local, zero-cost chat assistant doubles as a lead funnel.

## Stack

- **React 18 + Vite 6 + TypeScript**, **Tailwind CSS v4**
- **Motion** (`motion/react`) for animation
- **Supabase** — OAuth sign-in (Google / GitHub) and an edge function
  (`make-server-a62f57c7`) backing the contact form, comments and reactions
- Deployed on **Netlify** (`netlify.toml`); `dist/` is committed to the repo

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
| [Quick start](docs/QUICK_START.md) | get running in 5 minutes |
| [Developer guide](docs/DEVELOPER_GUIDE.md) | architecture and conventions |
| [Content updates](docs/CONTENT_UPDATE_GUIDE.md) | change copy without touching components |
| [Features](docs/FEATURES.md) | full feature list |
| [SEO setup](docs/SEO_SETUP.md) | meta, JSON-LD, sitemap, hreflang |
| [Google auth](docs/GOOGLE_AUTH_SETUP.md) | OAuth configuration |
| [Env setup](docs/ENV_SETUP.md) | environment variables |
| [Deployment](docs/DEPLOYMENT_CHECKLIST.md) · [DNS](docs/DNS_SETUP.md) | going live |
| [Performance](docs/PERFORMANCE_TIPS.md) | budgets and techniques |

`CLAUDE.md` holds working notes for AI assistants, including the gotchas that
cost real debugging time.

## License

Personal project — all rights reserved. UI primitives from
[shadcn/ui](https://ui.shadcn.com/), see [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

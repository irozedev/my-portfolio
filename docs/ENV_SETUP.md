# Environment variables

Short version: this site needs **one** build-time variable, and it is optional.

## What the app actually reads

Exactly one variable is read anywhere in `src/`:

| Variable | Read by | Required | Purpose |
|---|---|---|---|
| `VITE_GA_ID` | [`src/app/components/analytics.tsx`](../src/app/components/analytics.tsx) | No | GA4 measurement id, e.g. `G-XXXXXXXXXX`. Without it no analytics script is ever injected. |

Confirm that claim yourself at any time:

```bash
grep -rn "import.meta.env" src/
```

An earlier revision of this file told you to set `VITE_GA_MEASUREMENT_ID`. The
code has always read `VITE_GA_ID`, so following that instruction created a
variable nothing looks at and analytics that silently never loaded. The same
revision documented six `VITE_FIREBASE_*` variables; Firebase was removed in the
2026-07 cleanup and is no longer a dependency.

## Where to set it

Netlify UI → **Site configuration → Environment variables**, or from the CLI:

```bash
netlify env:set VITE_GA_ID G-XXXXXXXXXX
```

`VITE_*` values are baked in **at build time**, so a change only takes effect
after a fresh build — not a restart:

```bash
netlify deploy --build --prod
```

For local development put it in `.env.local` (git-ignored):

```
VITE_GA_ID=G-XXXXXXXXXX
```

## Critical: `VITE_` means public

Vite inlines every `VITE_`-prefixed variable into the JavaScript bundle shipped
to the browser. There is no such thing as a private `VITE_` variable.

**Never** put a Supabase `service_role` / `sb_secret_…` key, an OAuth client
secret, or any other credential in a `VITE_` variable, on Netlify or locally. It
becomes readable by every visitor in the page source. For the same reason, do not
put secrets in `netlify.toml` under `[build.environment]` — that file is
committed.

## Supabase credentials

No Supabase value comes from the environment on the client. They are compiled in
from [`src/utils/supabase/info.tsx`](../src/utils/supabase/info.tsx):

- `projectId` — the project ref
- `publicAnonKey` — the publishable / anon key

Both are public by design. The anon key grants only what Row Level Security
allows, so committing it is safe. A modern `sb_publishable_…` key also exists for
this project and can replace the legacy anon JWT; it rotates independently, which
is the reason to prefer it.

### Server-side secrets

The backend is a **Supabase Edge Function** (`supabase/functions/server`), not a
Netlify Function. Its secrets therefore live in the Supabase dashboard under
**Edge Functions → Secrets**. Netlify never sees this code, so setting them there
accomplishes nothing.

| Secret | How it is provided | Purpose |
|---|---|---|
| `SUPABASE_URL` | Injected by the platform | — |
| `SUPABASE_ANON_KEY` | Injected by the platform | — |
| `SUPABASE_SERVICE_ROLE_KEY` | Injected by the platform | Admin auth calls: `auth.admin.createUser`, `getUser`, `updateUserById` |
| `RESEND_API_KEY` | You set it, optional | Emails contact and chat leads to `rozedev095@gmail.com`. Without it leads are still written to the KV store and visible on `#admin`. |
| `ANTHROPIC_API_KEY` | You set it, optional and currently unused | Real LLM chat. The live assistant runs entirely in-browser and calls no API, so this is not needed. |

The three `SUPABASE_*` values come from the platform; you do not set them by
hand. The function reads them through a `requiredEnv()` helper that throws during
startup if one is missing, which makes that failure loud rather than subtle:

```
Missing required environment variable SUPABASE_SERVICE_ROLE_KEY.
Set it in Supabase dashboard → Edge Functions → Secrets.
```

That gives you a one-request test for whether the secrets resolved:

```bash
curl -s "https://saeohtepfpuzzajfduad.supabase.co/functions/v1/make-server-a62f57c7/health" \
  -H "apikey: <publishable key>"
# {"status":"ok"}  → the function booted, so every required secret was present
```

Never hardcode a `service_role` key as a fallback in the function source. An
earlier revision of `index.tsx` did exactly that in a public repository and the
key had to be rotated.

## Calling the edge function from the client

Two different credentials are involved, and confusing them produces failures that
look like a server outage:

- **`apikey`** — the gateway credential. Always the publishable / anon key.
  Supabase validates it and rejects the request before your handler runs.
- **`Authorization: Bearer …`** — identifies the user. Handlers read it back with
  `auth.getUser(token)`.

Use [`src/utils/supabase/api.ts`](../src/utils/supabase/api.ts) (`edgeHeaders()`)
instead of assembling headers by hand. It always sends `apikey`, and it takes the
user token from `supabase.auth.getSession()` — a call that refreshes an expired
session — rather than from cached React state. Access tokens last about an hour,
and the gateway answers `401 UNAUTHORIZED_LEGACY_JWT` to a stale one. Project
reactions were dead for exactly this reason: they put a cached session JWT in
`Authorization` and sent no `apikey` at all.

## Troubleshooting

**`import.meta.env.VITE_X` is `undefined`**
The name must start with `VITE_`; anything else is stripped from the client
bundle. Locally, restart `npm run dev` after editing `.env.local`. On Netlify,
trigger a rebuild — the value is inlined at build time.

**Analytics still not loading with `VITE_GA_ID` set**
GA4 mounts only after cookie consent. Check that consent was accepted; the
choice is stored in `localStorage`.

**Everything server-backed returns 401**
Check the `apikey` header is present, then check the session is fresh. See
"Calling the edge function" above.

## Checklist

- [ ] `VITE_GA_ID` set on Netlify, if you want analytics at all
- [ ] Rebuilt after changing it — `VITE_*` is build-time, not runtime
- [ ] No secret of any kind in a `VITE_` variable or in `netlify.toml`
- [ ] `/health` returns `{"status":"ok"}`
- [ ] `RESEND_API_KEY` set in Supabase if contact emails should actually arrive

## Reference

- [Vite env variables](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify environment variables](https://docs.netlify.com/environment-variables/overview/)
- [Supabase API keys](https://supabase.com/docs/guides/api/api-keys)

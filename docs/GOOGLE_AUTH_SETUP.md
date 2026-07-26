# OAuth sign-in (Google and GitHub)

Auth is **Supabase Auth**. There is no Firebase and no `react-router` involved —
earlier revisions of this file described both.

## How it works in this app

One call, in [`src/app/contexts/auth-context.tsx`](../src/app/contexts/auth-context.tsx):

```ts
await supabase.auth.signInWithOAuth({
  provider,                                  // 'google' | 'github'
  options: { redirectTo: `${window.location.origin}/` },
});
```

The browser leaves for the provider, returns to Supabase's callback, and Supabase
redirects to `redirectTo` with a session. `AuthProvider` picks it up through
`onAuthStateChange`; [`modern-auth-modal.tsx`](../src/app/components/modern-auth-modal.tsx)
is only the button surface.

Two consequences worth internalising, because both were wrong in the previous
version of this document:

- `redirectTo` is **the site root**, built from `window.location.origin` at
  runtime. It is not `/auth/callback` and not `/dashboard`; those paths do not
  exist in this app, which routes by hash.
- The dev server runs on **port 3000**, not 5173. See `npm run dev`.

## Supabase configuration

**Authentication → URL Configuration**

| Field | Value |
|---|---|
| Site URL | `https://roze.live` |
| Redirect URLs | `https://roze.live/**`, `http://localhost:3000/**` |

If an origin is missing here the provider round-trip succeeds and Supabase then
refuses to redirect back. The symptom is a bounce to the site root with no
session — indistinguishable from "login silently does nothing". Add any Netlify
deploy-preview domain you actually sign in from.

**Authentication → Providers** — enable Google and GitHub, then paste the client
credentials from the sections below.

Both providers need the same callback URL, and it points at Supabase, not at
roze.live:

```
https://saeohtepfpuzzajfduad.supabase.co/auth/v1/callback
```

## Google

1. [Google Cloud Console](https://console.cloud.google.com/) → create or select a
   project.
2. **APIs & Services → OAuth consent screen.** External. Fill in app name,
   support email and developer contact. Scopes: `email`, `profile`, `openid` —
   nothing more is needed, and extra scopes trigger verification.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**,
   type *Web application*.
   - Authorised JavaScript origins: `https://roze.live`, `http://localhost:3000`
   - Authorised redirect URI: the Supabase callback URL above — that one entry,
     nothing else
4. Copy the client ID and secret into Supabase → Providers → Google.

While the consent screen is in **Testing**, only accounts listed under *Test
users* can sign in; everyone else gets `access_denied`. Publish it before
expecting real visitors to sign in.

This app passes `prompt: 'consent'` and `access_type: 'offline'`, so Google shows
the consent screen on every sign-in instead of silently reusing an existing
grant. Deliberate, but worth knowing while testing.

## GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Homepage URL `https://roze.live`; Authorization callback URL = the Supabase
   callback URL above.
3. Generate a client secret, then paste the client ID and secret into
   Supabase → Providers → GitHub.

A GitHub OAuth App accepts exactly **one** callback URL. Because that URL points
at Supabase rather than at your site, a single app still covers production and
local development.

## Verifying

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://saeohtepfpuzzajfduad.supabase.co/auth/v1/health"
```

Then in the browser: open the sign-in dialog, choose a provider, and watch the
Network tab. Expect a redirect to the provider, then `/auth/v1/callback`, then
back to `/`. After landing, `localStorage` holds an `sb-…-auth-token` entry.

## When it breaks

**Returns to the site but not signed in.** The origin is not in Redirect URLs.
By a wide margin the most common cause.

**`redirect_uri_mismatch`.** The provider's callback URL does not match the
Supabase one character for character — check scheme and trailing path.

**`access_denied`, Google only.** Consent screen still in Testing and the account
is not a listed test user.

**Signed in, but every server call returns 401.** Not an OAuth problem. The edge
function needs `apikey` as its gateway credential alongside the user token, and a
token older than roughly an hour is rejected as `UNAUTHORIZED_LEGACY_JWT`. Use
`edgeHeaders()` from [`src/utils/supabase/api.ts`](../src/utils/supabase/api.ts),
which always sends `apikey` and reads a freshly refreshed token from
`getSession()`.

**Session appears to vanish on reload.** `AuthProvider` reads the session
asynchronously and exposes `loading`. UI that concludes "logged out" before
`loading` clears will flash the signed-out state.

## Secrets

Google and GitHub client secrets go **only** into the Supabase dashboard. Never
into this repository, and never into a Netlify `VITE_` variable — Vite inlines
those into the public bundle. See [ENV_SETUP.md](ENV_SETUP.md).

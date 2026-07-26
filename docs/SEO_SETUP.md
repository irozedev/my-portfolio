# SEO and analytics

The domain is **roze.live**. An earlier revision of this file referenced
`ro3e.io`, claimed three languages instead of five, listed a `site.webmanifest`
that does not exist (it is `manifest.json`), advertised aggregate ratings that are
not in the JSON-LD, and told you to hardcode a GA4 id into `index.html` around
lines 163–168. There is no `gtag` snippet there, and adding one would bypass
cookie consent.

## Analytics

GA4 is loaded by [`src/app/components/analytics.tsx`](../src/app/components/analytics.tsx),
and only when **both** conditions hold:

1. `VITE_GA_ID` is set at build time (see [ENV_SETUP.md](ENV_SETUP.md))
2. the visitor accepted cookies — the choice lives in `localStorage`

Nothing is injected otherwise, which is the whole point: no analytics script
exists on the page before consent. Do not "fix" this by putting a `gtag` tag in
`index.html`.

To wire it up, create a GA4 property, take the Measurement ID (`G-XXXXXXXXXX`)
from **Admin → Data streams → your web stream**, then:

```bash
netlify env:set VITE_GA_ID G-XXXXXXXXXX
netlify deploy --build --prod        # VITE_* is inlined at build time
```

Verify in GA4 → **Reports → Realtime**, with the site open in another tab and
cookies accepted. If Realtime stays empty, check in this order: the variable is
set for the *production* context, the site was rebuilt after setting it, consent
was accepted, no ad blocker is running.

## The two SEO layers

Keep these consistent — they describe the same page to different readers:

| Layer | File | Read by |
|---|---|---|
| Static | [`index.html`](../index.html) | crawlers and social scrapers that do not run JS |
| Runtime | [`src/app/components/seo-head.tsx`](../src/app/components/seo-head.tsx) | updates meta per language after hydration |

`index.html` also carries five JSON-LD blocks: `Person`, `WebSite`,
`ProfessionalService`, `LocalBusiness` and `BreadcrumbList`. Geo values are
Antwerp / Flanders / BE (`geo.region = BE-VAN`) and must match `seo-head.tsx`.

`theme-color` is owned by `theme-context.tsx`, which flips it with the theme. Do
not also set it in `seo-head.tsx` — a second writer stomps the live value.

## Languages and hreflang

`?lang=` is real. [`language-context.tsx`](../src/app/contexts/language-context.tsx)
reads it on load with priority **URL > localStorage > browser**, and
`handleSetLanguage` mirrors the choice back into the URL. Three places publish the
alternates and all three must agree:

- `index.html` — `<link rel="alternate" hreflang=…>`
- [`public/sitemap.xml`](../public/sitemap.xml)
- `seo-head.tsx`

| Language | URL |
|---|---|
| English | `https://roze.live/` — also `x-default` |
| Ukrainian | `https://roze.live/?lang=ua` |
| Dutch | `https://roze.live/?lang=nl` — published as `nl-BE` and `nl` |
| Arabic | `https://roze.live/?lang=ar` |
| Spanish | `https://roze.live/?lang=es` |

English is served at the bare origin rather than `?lang=en`, otherwise `/` and
`/?lang=en` are two URLs with identical content. Ukrainian is `ua` in the URL, not
`uk` — the context aliases it.

The canonical tag is **self-referencing**: it must point at the current URL. A
canonical hardcoded to the origin on every language cancels the entire hreflang
cluster, which is exactly what it used to do.

## robots.txt

[`public/robots.txt`](../public/robots.txt) uses a single `User-agent: *` group on
purpose. A crawler obeys exactly one group, so adding per-agent
`User-agent: Googlebot` / `Allow: /` blocks made Googlebot ignore every `Disallow`
in the `*` group. Do not reintroduce them. Likewise `Disallow: /*.json` blocked
`manifest.json` and broke the PWA manifest.

## Sitemap

Fragment URLs (`/#projects`) do not belong in a sitemap — to a crawler they all
collapse to `/`. Neither do `?region=` variants: nothing in the app reads that
parameter, so they were duplicate content. Priorities are weighted for Belgium and
the EU, with `nl-BE` highest.

## Social previews

`public/og-image.jpg`, 1200×630, referenced by `og:image` and `twitter:image`.
After changing it, re-scrape the URL — both networks cache aggressively:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Section anchors

`#hero`, `#services`, `#how-i-work`, `#projects`, `#github`, `#about`, `#contact`
in client mode; `#experience` in company mode.

## Submitting the site

Google Search Console and Bing Webmaster Tools: verify the domain, then submit
`https://roze.live/sitemap.xml`. Bing can import an existing Search Console
property instead of a fresh verification.

## Checklist

- [ ] `VITE_GA_ID` set for the production context, site rebuilt afterwards
- [ ] Canonical self-referencing on every language
- [ ] hreflang identical across `index.html`, `sitemap.xml` and `seo-head.tsx`
- [ ] `robots.txt` still a single `User-agent: *` group
- [ ] Sitemap free of fragments and `?region=` variants
- [ ] `og-image.jpg` 1200×630 and re-scraped after any change
- [ ] Geo values agree between the JSON-LD blocks and `seo-head.tsx`

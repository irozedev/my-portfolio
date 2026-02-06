# ✅ Deployment Checklist

Use this checklist before deploying your portfolio to production.

## 📋 Pre-Deployment

### Code Quality
- [ ] Run ESLint and fix all errors
  ```bash
  pnpm lint:fix
  ```
- [ ] Build succeeds without errors
  ```bash
  pnpm build
  ```
- [ ] All TypeScript errors resolved
  ```bash
  npx tsc --noEmit
  ```

### Content
- [ ] Update personal information in `/src/utils/translations.ts`
  - [ ] Name and title
  - [ ] About section
  - [ ] Contact information
  - [ ] Social media links
- [ ] Add your projects with real images
- [ ] Add your work experience
- [ ] Add testimonials (if available)
- [ ] Update resume/CV link

### Styling
- [ ] Test dark theme on desktop
- [ ] Test dark theme on mobile
- [ ] Test light theme on desktop
- [ ] Test light theme on mobile
- [ ] Check all sections are responsive
- [ ] Verify all images load correctly
- [ ] Test animations on different devices

### Functionality
- [ ] Navigation works on all sections
- [ ] Smooth scroll works
- [ ] Theme toggle works and persists
- [ ] Language switcher works (all languages)
- [ ] Contact form works (if implemented)
- [ ] Back to Top button appears and works
- [ ] AI Assistant works (if implemented)
- [ ] All links open in correct tabs

### Performance
- [ ] Check Lighthouse score (should be 90+)
  ```bash
  # In Chrome DevTools
  # Open Lighthouse tab and run audit
  ```
- [ ] Test loading speed on 3G network
- [ ] Verify lazy loading works
- [ ] Check bundle size is reasonable
  ```bash
  pnpm build
  # Check dist/ folder size
  ```

### SEO
- [ ] Add proper meta tags in `index.html`
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Create `robots.txt`
- [ ] Create `sitemap.xml`
- [ ] Add Google Analytics (optional)

### Accessibility
- [ ] Test keyboard navigation
- [ ] Check color contrast (WCAG AA)
- [ ] Verify all images have alt text
- [ ] Test with screen reader
- [ ] Check focus indicators are visible

## 🔐 Firebase Setup (If Using Auth)

- [ ] Create Firebase project
- [ ] Enable Google Authentication
- [ ] Add authorized domains
- [ ] Set up environment variables
- [ ] Test sign-in flow
- [ ] Test sign-out flow
- [ ] Verify user persistence works

See `GOOGLE_AUTH_SETUP.md` for details.

## 🌍 Environment Variables

### Development (.env.local)
```bash
VITE_FIREBASE_API_KEY=your_dev_key
VITE_FIREBASE_AUTH_DOMAIN=your_dev_domain
VITE_FIREBASE_PROJECT_ID=your_dev_project
```

### Production
Set these in your hosting platform:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add all VITE_* variables
3. Set for Production environment

**Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add all VITE_* variables

**GitHub Pages:**
Use GitHub Secrets and GitHub Actions

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

**Configuration:**
- Framework Preset: Vite
- Build Command: `pnpm build`
- Output Directory: `dist`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# For production
netlify deploy --prod --dir=dist
```

**netlify.toml:**
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. Add to `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

2. Build and deploy:
```bash
pnpm build
# Push dist folder to gh-pages branch
```

### Option 4: Custom Server

```bash
# Build
pnpm build

# Upload dist/ folder to your server
# Configure web server (nginx/apache) to serve files
```

## 📊 Post-Deployment Checks

### Immediately After Deploy
- [ ] Visit your site URL
- [ ] Test on mobile device
- [ ] Check all sections load
- [ ] Verify auth works (if enabled)
- [ ] Test theme switching
- [ ] Check browser console for errors

### Within 24 Hours
- [ ] Test on different browsers
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test on different devices
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile (iOS)
  - [ ] Mobile (Android)
- [ ] Check analytics setup
- [ ] Test loading speed
- [ ] Share with friends for feedback

### Within 1 Week
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Gather user feedback

## 🐛 Common Issues & Fixes

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
pnpm install
pnpm build
```

### Assets Not Loading
Check `vite.config.ts` base path matches your deployment URL.

### Auth Not Working
- Verify Firebase config is correct
- Check authorized domains in Firebase Console
- Ensure environment variables are set

### 404 Errors on Refresh
Configure your host for SPA routing (see deployment option above).

### Slow Loading
- Check bundle size: `pnpm build`
- Verify lazy loading is working
- Optimize images

## 📱 Mobile Testing

Use these tools:
- Chrome DevTools Device Mode
- Real iOS device
- Real Android device
- BrowserStack (for multiple devices)

Test on:
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 Pro (notch)
- [ ] iPad (tablet)
- [ ] Android phone
- [ ] Landscape orientation

## 🔒 Security Checklist

- [ ] No API keys in code (use .env)
- [ ] `.env` file in `.gitignore`
- [ ] Firebase rules configured
- [ ] HTTPS enabled on production
- [ ] Content Security Policy set (optional)
- [ ] No console.logs in production

## 🎯 Performance Targets

Your portfolio should meet these targets:

| Metric | Target | Priority |
|--------|--------|----------|
| Lighthouse Score | 90+ | High |
| First Contentful Paint | < 1.5s | High |
| Largest Contentful Paint | < 2.5s | High |
| Time to Interactive | < 3s | Medium |
| Cumulative Layout Shift | < 0.1 | Medium |
| Bundle Size | < 250KB | Low |

## 📈 Analytics Setup (Optional)

### Google Analytics 4

1. Create GA4 property
2. Add tracking code to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🎉 Launch Day

### Announcements
- [ ] Share on LinkedIn
- [ ] Share on Twitter
- [ ] Share on relevant subreddits
- [ ] Post in Discord/Slack communities
- [ ] Email portfolio link to contacts
- [ ] Update resume with portfolio link

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up performance monitoring
- [ ] Monitor Firebase usage (if using auth)

## 📝 Maintenance Plan

### Weekly
- Check for console errors
- Monitor loading speed
- Review analytics

### Monthly
- Update dependencies
- Review and respond to feedback
- Add new projects
- Update content

### Quarterly
- Major design review
- Performance audit
- SEO check
- Security review

## 🚀 Ready to Deploy?

If you've checked everything above, you're ready to launch! 🎉

```bash
# Final build
pnpm build

# Deploy to your chosen platform
# See deployment options above

# Celebrate! 🎊
```

---

**Good luck with your launch!** 🚀

Remember: A portfolio is never "done" - keep updating it with new projects and improvements!

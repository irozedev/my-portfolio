# 🚀 Performance Tips & Best Practices

## 📊 Current Performance

Your portfolio is already optimized with:
- ✅ Lazy loading (64% bundle reduction)
- ✅ Code splitting
- ✅ Optimized animations
- ✅ Efficient rendering

But there's always room for improvement!

## ⚡ Quick Wins

### 1. Image Optimization

**Current**: Using images as-is  
**Better**: Optimize images before uploading

```bash
# Install image optimizer
npm install -g sharp-cli

# Optimize images
sharp -i input.jpg -o output.webp --webp
```

**In your code:**
```tsx
<img 
  src="/image.webp" 
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
  alt="Description"
/>
```

### 2. Font Loading

**Current**: System fonts (already optimal!)  
**If using custom fonts:**

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* ← Important! */
  font-weight: 400;
}
```

### 3. Preload Critical Assets

Add to `index.html`:
```html
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero-image.webp" as="image">
```

## 🎯 Measuring Performance

### Lighthouse Audit

```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse https://yoursite.com --view
```

**Target scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Web Vitals

Add to your site:
```bash
npm install web-vitals
```

```tsx
// src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  console.log({ name, value, id });
  // Send to analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔧 Advanced Optimizations

### 1. React Optimization

**Use React.memo for expensive components:**
```tsx
import { memo } from 'react';

export const ExpensiveComponent = memo(({ data }) => {
  // Heavy rendering logic
  return <div>{data}</div>;
});
```

**Use useMemo for expensive calculations:**
```tsx
const processedData = useMemo(() => {
  return data.map(item => {
    // Expensive operation
    return transform(item);
  });
}, [data]);
```

**Use useCallback for callbacks:**
```tsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);
```

### 2. Bundle Analysis

Analyze what's in your bundle:

```bash
# Install
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});

# Build and analyze
pnpm build
```

### 3. Code Splitting

**Split by route:**
```tsx
const AdminPage = lazy(() => import('./pages/Admin'));
const BlogPage = lazy(() => import('./pages/Blog'));
```

**Split heavy libraries:**
```tsx
// Instead of
import { Chart } from 'recharts';

// Do this
const Chart = lazy(() => 
  import('recharts').then(m => ({ default: m.Chart }))
);
```

### 4. Animation Performance

**Use GPU-accelerated properties:**
```css
/* ✅ Good: GPU-accelerated */
.animate {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ Avoid: CPU-heavy */
.animate {
  left: 100px;
  background-position: 100px 0;
}
```

**Use will-change sparingly:**
```css
.critical-animation {
  will-change: transform, opacity;
}

/* Remove after animation */
.critical-animation.done {
  will-change: auto;
}
```

### 5. Debounce Scroll Events

```tsx
import { useEffect, useRef } from 'react';

function useDebounce(callback: () => void, delay: number) {
  const timeoutRef = useRef<number>();
  
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  };
}

// Usage
const handleScroll = useDebounce(() => {
  // Scroll logic
}, 100);

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [handleScroll]);
```

### 6. Intersection Observer

Already implemented in lazy loading, but here's how to use it for other purposes:

```tsx
import { useEffect, useRef, useState } from 'react';

export function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);
  
  return [ref, isInView] as const;
}

// Usage
function Component() {
  const [ref, isInView] = useInView();
  
  return (
    <div ref={ref}>
      {isInView && <HeavyComponent />}
    </div>
  );
}
```

## 📦 Reducing Bundle Size

### 1. Tree Shaking

Import only what you need:

```tsx
// ❌ Bad: Imports entire library
import * as Icons from 'lucide-react';

// ✅ Good: Tree-shakeable
import { User, Mail, Phone } from 'lucide-react';
```

### 2. Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove them
npm uninstall unused-package
```

### 3. Use Dynamic Imports

```tsx
// Load on demand
const loadHeavyFeature = async () => {
  const module = await import('./HeavyFeature');
  return module.default;
};

<button onClick={loadHeavyFeature}>
  Load Feature
</button>
```

## 🌐 Network Optimization

### 1. Enable Compression

Most hosting platforms do this automatically, but verify:

```bash
# Check if gzip is enabled
curl -H "Accept-Encoding: gzip" -I https://yoursite.com
```

### 2. Use CDN

Deploy to platforms with global CDN:
- Vercel (automatic)
- Netlify (automatic)
- Cloudflare Pages

### 3. Cache Static Assets

Add cache headers (usually automatic on hosting platforms):

```
Cache-Control: public, max-age=31536000, immutable
```

## 🎨 CSS Optimization

### 1. Remove Unused CSS

Tailwind already does this, but verify:

```bash
# Check CSS file size
ls -lh dist/assets/*.css
```

Should be < 50KB for a portfolio.

### 2. Critical CSS

Extract critical above-the-fold CSS:

```bash
npm install -D critical

# In build script
critical src/index.html --base dist --inline
```

## 🔍 Monitoring in Production

### Setup Monitoring

**1. Vercel Analytics (if using Vercel):**
```tsx
// Add to package.json dependencies
"@vercel/analytics": "^1.0.0"

// In main.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

**2. Google Analytics 4:**
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**3. Sentry (Error Tracking):**
```bash
npm install @sentry/react

# In main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: "production",
});
```

## 📱 Mobile Optimization

### 1. Touch Target Size

Ensure all interactive elements are at least 44x44px:

```css
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
}
```

### 2. Reduce JavaScript for Mobile

```tsx
const isMobile = window.innerWidth < 768;

// Load lighter version for mobile
const Component = lazy(() => 
  import(isMobile ? './ComponentMobile' : './ComponentDesktop')
);
```

### 3. Optimize Images for Mobile

```tsx
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="/image-mobile.webp"
  />
  <source 
    media="(min-width: 769px)" 
    srcSet="/image-desktop.webp"
  />
  <img src="/image-desktop.webp" alt="Description" />
</picture>
```

## 🚀 Deployment Optimization

### Vercel Configuration

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify Configuration

Create `netlify.toml`:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📊 Performance Budget

Set limits to prevent regression:

```js
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor code
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Warn if chunk exceeds size
    chunkSizeWarningLimit: 500,
  },
});
```

## 🎯 Performance Checklist

- [ ] All images optimized (WebP format)
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Critical CSS inlined
- [ ] Fonts optimized
- [ ] Bundle analyzed
- [ ] Animations GPU-accelerated
- [ ] Scroll events debounced
- [ ] Lighthouse score 90+
- [ ] Web Vitals passing
- [ ] Mobile optimized
- [ ] CDN configured
- [ ] Caching enabled
- [ ] Monitoring set up

## 📈 Expected Results

After implementing these optimizations:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Bundle Size | 180KB | 120KB | < 150KB |
| FCP | 1.2s | 0.8s | < 1.0s |
| LCP | 1.8s | 1.2s | < 1.5s |
| TTI | 2.0s | 1.5s | < 2.0s |
| CLS | 0.05 | 0.02 | < 0.1 |

## 🔮 Future Optimizations

Consider these for v3:

1. **Service Worker**: Offline support
2. **HTTP/3**: Faster protocol
3. **Edge Functions**: Dynamic content at edge
4. **Image CDN**: Automatic optimization
5. **Prefetching**: Predict user actions
6. **Web Assembly**: For heavy computations

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Optimization](https://vitejs.dev/guide/performance.html)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)

---

**Remember**: Measure before and after each optimization to see real impact!

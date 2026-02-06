# 👨‍💻 Developer Guide

## 🏗️ Architecture Overview

### Component Structure

```
src/app/
├── App.tsx                    # Main app with lazy loading
├── components/
│   ├── loading-screen.tsx     # Initial page loader
│   ├── navigation.tsx         # Header with theme/lang/auth
│   ├── auth-panel.tsx         # Google sign-in UI
│   ├── hero-section.tsx       # Landing section
│   ├── about-section.tsx      # About me
│   ├── experience-section.tsx # Work timeline
│   ├── projects-section.tsx   # Portfolio showcase
│   ├── testimonials-section.tsx # Client reviews
│   ├── services-section.tsx   # Services offered
│   ├── contact-section.tsx    # Contact form
│   ├── footer.tsx             # Footer with links
│   ├── back-to-top.tsx        # Scroll to top button
│   ├── ai-assistant.tsx       # AI chatbot
│   └── ui/                    # Reusable components
├── contexts/
│   ├── theme-context.tsx      # Dark/Light theme
│   └── language-context.tsx   # i18n support
└── hooks/
    └── useAuth.ts             # Firebase auth logic
```

## 🎨 Theme System

### Using Theme Context

```tsx
import { useTheme } from "@/app/contexts/theme-context";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Theme Variables

All components use CSS variables for theming:

```css
/* Use in your components */
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.accent-button {
  background: var(--accent-primary);
}
```

### Adding Theme-Aware Components

```tsx
export function ThemedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] p-6 rounded-xl">
      {children}
    </div>
  );
}
```

## 🌍 Language System

### Using Language Context

```tsx
import { useLanguage } from "@/app/contexts/language-context";

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t("mySection.title")}</h1>
      <p>{t("mySection.description")}</p>
    </div>
  );
}
```

### Adding New Translations

Edit `/src/utils/translations.ts`:

```typescript
export const translations = {
  en: {
    mySection: {
      title: "My Title",
      description: "My Description",
    },
  },
  ru: {
    mySection: {
      title: "Мой Заголовок",
      description: "Моё Описание",
    },
  },
  // ... other languages
};
```

## 🔐 Authentication

### Using Auth Hook

```tsx
import { useAuth } from "@/app/hooks/useAuth";

function MyComponent() {
  const { user, loading, error, signInWithGoogle, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return user ? (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  ) : (
    <button onClick={signInWithGoogle}>Sign In</button>
  );
}
```

### Protected Content

```tsx
function ProtectedFeature() {
  const { user } = useAuth();
  
  if (!user) {
    return <p>Please sign in to access this feature</p>;
  }
  
  return <div>Secret content for {user.email}</div>;
}
```

## ⚡ Lazy Loading

### Adding a New Lazy-Loaded Section

1. Create your component with a named export:
```tsx
// /src/app/components/my-section.tsx
export function MySection() {
  return <div>My Content</div>;
}
```

2. Import it lazily in App.tsx:
```tsx
const MySection = lazy(() => 
  import("./components/my-section").then(m => ({ 
    default: m.MySection 
  }))
);
```

3. Wrap with Suspense:
```tsx
<Suspense fallback={<SectionLoader />}>
  <MySection />
</Suspense>
```

### When NOT to Lazy Load

Don't lazy load:
- Critical above-the-fold content
- Small components (< 10KB)
- Components used on every page

## 🎭 Animations

### Using Motion

```tsx
import { motion } from "motion/react";

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Card Content
    </motion.div>
  );
}
```

### Performance Tips

1. Use `will-change` sparingly
2. Prefer `transform` and `opacity` over other properties
3. Use `useReducedMotion` for accessibility
4. Debounce scroll events

```tsx
import { useReducedMotion } from "motion/react";

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ 
        scale: shouldReduceMotion ? 1 : [1, 1.2, 1] 
      }}
    >
      Content
    </motion.div>
  );
}
```

## 🎨 Styling Best Practices

### Tailwind Classes

```tsx
// ✅ Good: Use design tokens
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)]" />

// ❌ Avoid: Hardcoded colors
<div className="bg-black text-white" />

// ✅ Good: Responsive design
<div className="text-sm md:text-base lg:text-lg" />

// ✅ Good: Hover states
<button className="hover:bg-[var(--accent-primary)] transition-colors" />
```

### Custom Components

Create reusable styled components in `/src/app/components/ui/`:

```tsx
// /src/app/components/ui/card.tsx
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "glass" | "bordered";
}

export function Card({ children, variant = "default" }: CardProps) {
  const variants = {
    default: "bg-[var(--bg-secondary)]",
    glass: "backdrop-blur-xl bg-[var(--bg-secondary)]/50",
    bordered: "border-2 border-[var(--accent-primary)]",
  };
  
  return (
    <div className={`p-6 rounded-xl ${variants[variant]}`}>
      {children}
    </div>
  );
}
```

## 📱 Responsive Design

### Breakpoints

```tsx
// Mobile First Approach
<div className="
  w-full          // Mobile: 100% width
  md:w-1/2        // Tablet: 50% width
  lg:w-1/3        // Desktop: 33% width
  xl:w-1/4        // Large: 25% width
">
  Content
</div>
```

### Mobile-Specific Components

```tsx
function ResponsiveNav() {
  return (
    <>
      {/* Desktop */}
      <nav className="hidden lg:flex">
        Desktop Navigation
      </nav>
      
      {/* Mobile */}
      <nav className="lg:hidden">
        Mobile Navigation
      </nav>
    </>
  );
}
```

## 🧪 Testing Components

### Basic Component Test

```tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./my-component";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

### Testing with Context

```tsx
import { ThemeProvider } from "@/app/contexts/theme-context";

test("renders with theme", () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
  // assertions
});
```

## 🐛 Debugging

### React DevTools

Use React DevTools to:
- Inspect component props and state
- Profile performance
- Check context values

### Console Logging

```tsx
// Development only
if (import.meta.env.DEV) {
  console.log("Debug info:", data);
}
```

### Common Issues

**Issue: Component not re-rendering**
```tsx
// ❌ Bad: Mutating state
state.push(newItem);

// ✅ Good: Create new array
setState([...state, newItem]);
```

**Issue: Infinite useEffect loop**
```tsx
// ❌ Bad: Missing dependencies
useEffect(() => {
  doSomething(value);
}, []); // ESLint will warn

// ✅ Good: Proper dependencies
useEffect(() => {
  doSomething(value);
}, [value]);
```

## 🚀 Performance Optimization

### Memoization

```tsx
import { useMemo, useCallback } from "react";

function ExpensiveComponent({ data }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);
  
  // Memoize callbacks
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);
  
  return <div onClick={handleClick}>{processedData}</div>;
}
```

### Image Optimization

```tsx
// Use modern formats
<img 
  src="/image.webp" 
  loading="lazy"
  decoding="async"
  alt="Description"
/>
```

### Code Splitting

```tsx
// Split by route
const AdminPanel = lazy(() => import("./AdminPanel"));

// Split by feature
const HeavyFeature = lazy(() => import("./HeavyFeature"));
```

## 📦 Building for Production

```bash
# Build
pnpm build

# Preview build
pnpm preview

# Check bundle size
pnpm build --analyze
```

### Environment Variables

```bash
# Development
VITE_FIREBASE_API_KEY=dev_key

# Production
VITE_FIREBASE_API_KEY=prod_key
```

## 🔒 Security

### Never Expose Secrets

```tsx
// ❌ Bad: Hardcoded API key
const apiKey = "sk_live_abc123";

// ✅ Good: Use environment variables
const apiKey = import.meta.env.VITE_API_KEY;
```

### Sanitize User Input

```tsx
import DOMPurify from "dompurify";

function UserContent({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

## 📚 Resources

- [React Docs](https://react.dev)
- [Motion Docs](https://motion.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Contributing

When adding new features:

1. Follow existing code style
2. Add TypeScript types
3. Test in both themes
4. Test on mobile devices
5. Update documentation
6. Run ESLint before committing

```bash
# Format and lint
pnpm lint:fix
```

---

Happy coding! 🚀

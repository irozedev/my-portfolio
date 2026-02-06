# ⚡ Quick Start Guide

Get your portfolio running in 5 minutes!

## 1️⃣ Install Dependencies

```bash
pnpm install
# or
npm install
```

## 2️⃣ Start Development Server

```bash
pnpm dev
```

Your portfolio will be available at `http://localhost:5173`

## 3️⃣ Customize Content

### Update Personal Info

Edit `/src/utils/translations.ts`:

```typescript
export const translations = {
  en: {
    hero: {
      greeting: "Hi, I'm",
      name: "Your Name",  // ← Change this
      title: "Your Title", // ← Change this
      // ...
    },
    // ...
  },
};
```

### Change Theme Colors

Edit `/src/styles/theme.css`:

```css
:root {
  --accent-primary: #00d9ff; /* ← Your brand color */
  --accent-secondary: #0099ff;
  /* ... */
}
```

## 4️⃣ Optional: Setup Google Sign-In

### Quick Setup (2 minutes)

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Get Firebase credentials:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Google Authentication
   - Copy config to `.env`

3. Done! Auth will work automatically.

**Detailed guide**: See [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)

> 💡 **Note**: The app works perfectly without Firebase. Auth features will simply be disabled.

## 5️⃣ Build for Production

```bash
pnpm build
```

Files will be in `/dist` folder. Deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting

## 🎨 Common Customizations

### Add Your Projects

Edit `/src/utils/translations.ts`:

```typescript
projects: {
  items: [
    {
      title: "Your Project",
      description: "Project description",
      tags: ["React", "TypeScript"],
      image: "/path/to/image.jpg",
      // ...
    },
  ],
}
```

### Change Profile Photo

Replace images in `/src/imports/` or use Unsplash URLs.

### Update Social Links

Edit contact section in `/src/utils/translations.ts`:

```typescript
contact: {
  email: "your.email@example.com",
  linkedin: "your-linkedin-username",
  github: "your-github-username",
  // ...
}
```

## 📱 Preview on Mobile

1. Find your local IP:
```bash
# On Mac/Linux
ipconfig getifaddr en0

# On Windows
ipconfig
```

2. Open `http://YOUR_IP:5173` on your phone

## 🚀 Deploy

### Vercel (Easiest)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

## 🎯 What's Next?

- 📖 Read [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) for performance tips
- 👨‍💻 Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for advanced features
- 🔐 Setup [Google Auth](./GOOGLE_AUTH_SETUP.md) for user authentication
- 📝 Review [CHANGELOG.md](./CHANGELOG.md) to see what's new

## 🆘 Need Help?

### The site is not loading
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build is failing
```bash
# Check for TypeScript errors
npx tsc --noEmit
```

### Styles look wrong
Make sure Tailwind CSS is properly configured:
```bash
# Check if postcss.config.mjs exists
ls postcss.config.mjs
```

## 🎉 You're Done!

Your modern portfolio is ready. Customize it, add your projects, and share it with the world!

---

**Pro Tips:**
- Use dark mode for development (easier on eyes)
- Test on real mobile devices
- Deploy early, update often
- Share your portfolio and get feedback

Happy building! 🚀

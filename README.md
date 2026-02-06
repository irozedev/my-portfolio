# 🚀 ro3e.io - Modern Portfolio Website

> Professional portfolio for **Stepan Roze**, Frontend Developer  
> Built with React, TypeScript, Tailwind CSS, and cutting-edge 2026 design trends

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-ffca28?style=flat&logo=firebase)](https://firebase.google.com/)

---

## ✨ Highlights

- 🎨 **Modern 2026 Design** - Dark theme, glassmorphism, kinetic typography
- 🌐 **Multi-Language** - English, Ukrainian, Dutch
- 🔐 **Google Authentication** - Firebase-powered sign-in
- 🤖 **AI Chat Bot** - Interactive assistant with smart responses
- 📱 **Fully Responsive** - Mobile-first, works on all devices
- 🔍 **SEO Optimized** - Google Analytics, structured data, meta tags
- ⚖️ **GDPR Compliant** - Privacy policy, cookie consent, legal pages
- ⚡ **Lightning Fast** - Vite build, optimized performance
- 🎭 **Smooth Animations** - Motion/Framer Motion effects
- 🛠️ **Admin Panel** - Manage projects directly

---

## 📸 Preview

**Dark Mode (Default)**  
Clean, professional dark theme with cyan accents

**Light Mode**  
Bright, accessible light theme

**Mobile Responsive**  
Optimized for phones and tablets

---

## 🎯 Features

### 🏠 Main Sections
- **Hero** - Animated greeting, tech stack showcase, CTAs
- **About** - Bio, skills, stats, CV download
- **Experience** - Career timeline with achievements
- **Projects** - Portfolio with detailed views
- **Services** - 4 service offerings with pricing in €
- **Contact** - Form with validation, social links

### 🔧 Technical Features
- **Theme Switcher** - Dark/Light modes
- **Language Selector** - EN/UK/NL support
- **AI Chat Bot** - Smart replies, quick actions
- **Scroll to Top** - Floating button
- **Project Navigation** - Prev/Next between projects
- **Admin Panel** - CRUD for projects (password: admin123)

### 🔐 Legal & Compliance
- **Privacy Policy** - Full GDPR-compliant document
- **Terms & Conditions** - Complete legal terms
- **Imprint** - Legal notice (Impressum)
- **Cookie Banner** - Consent management

### 🔒 Authentication
- **Google Sign-In** - OAuth via Firebase
- **User Profile** - Display name, email, photo
- **Session Management** - Persistent login
- **Protected Features** - Future admin features

### 📊 SEO & Analytics
- **Google Analytics 4** - Track visitors (setup required)
- **Meta Tags** - OG, Twitter Cards, descriptions
- **Schema.org** - Person & Service structured data
- **robots.txt** - Crawl instructions
- **sitemap.xml** - Site structure

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Utility-first CSS
- **Motion (Framer Motion)** - Animations

### Backend & Auth
- **Firebase** - Google authentication
- **Supabase** - Database & backend
- **Google Analytics 4** - Analytics

### Tools & Libraries
- **Lucide Icons** - Icon set
- **React Hook Form** - Form handling
- **React Intersection Observer** - Scroll animations
- **Sonner** - Toast notifications

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (recommended)
pnpm install
```

### 2️⃣ Configure Environment (Optional)

For Google Authentication:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your Firebase credentials
# See GOOGLE_AUTH_SETUP.md for instructions
```

### 3️⃣ Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4️⃣ Build for Production

```bash
npm run build
# or
pnpm build
```

Output will be in the `dist/` folder.

---

## 📚 Documentation

### Setup Guides
- **[GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)** - Complete Google Authentication setup
- **[SEO_SETUP.md](./SEO_SETUP.md)** - SEO & Google Analytics configuration
- **[FEATURES.md](./FEATURES.md)** - Full feature list and specifications

### Quick Links
- **Admin Panel:** [/#admin](/#admin) (password: `admin123`)
- **Privacy Policy:** [/#privacy](/#privacy)
- **Terms & Conditions:** [/#terms](/#terms)
- **Imprint:** [/#imprint](/#imprint)

---

## 🔑 Key Information

### 💰 Pricing (Belgium-based)
Services are priced in **Euros (€)** with Belgian VAT:

- **Frontend Development** - €45/hour
- **E-commerce Solutions** - €60/hour
- **JavaScript Consulting** - €55/hour
- **Full-Stack Development** - €75/hour

### 🏢 Business Details
- **Name:** Stepan Roze
- **Brand:** ro3e.io
- **Location:** Belgium, European Union
- **VAT ID:** BE 0123.456.789
- **Email:** rozedev095@gmail.com

### 🌐 Social Links
- **GitHub:** [github.com/rozedev](https://github.com/rozedev)
- **LinkedIn:** [linkedin.com/in/rozestepan](https://linkedin.com/in/rozestepan)
- **Upwork:** [upwork.com/freelancers/rozestepan](https://www.upwork.com/freelancers/rozestepan)

---

## ⚙️ Configuration

### Google Analytics (Optional)

1. Create a GA4 property
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Edit `/index.html`:
   - Line 163: Replace `G-XXXXXXXXXX` in the script src
   - Line 168: Replace `G-XXXXXXXXXX` in gtag config
4. See `SEO_SETUP.md` for detailed instructions

### Firebase Authentication (Optional)

1. Create Firebase project
2. Enable Google authentication
3. Copy credentials to `.env`
4. See `GOOGLE_AUTH_SETUP.md` for step-by-step guide

Both features work without configuration, but will be limited in functionality.

---

## 📂 Project Structure

```
ro3e.io/
├── public/
│   ├── robots.txt           # SEO crawl rules
│   ├── sitemap.xml          # Site structure
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── app/
│   │   ├── components/      # React components
│   │   │   ├── hero-section.tsx
│   │   │   ├── about-section.tsx
│   │   │   ├── projects-section.tsx
│   │   │   ├── chat-bot.tsx
│   │   │   ├── legal-pages.tsx
│   │   │   └── ...
│   │   ├── contexts/        # React contexts
│   │   │   ├── theme-context.tsx
│   │   │   ├── language-context.tsx
│   │   │   └── availability-context.tsx
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useAuth.ts
│   │   └── App.tsx          # Main app component
│   ├── config/
│   │   └── firebase.ts      # Firebase config
│   └── styles/
│       ├── theme.css        # Theme variables
│       └── fonts.css        # Font imports
├── .env.example             # Environment variables template
├── index.html               # Entry point (includes GA4)
├── FEATURES.md              # Complete feature list
├── GOOGLE_AUTH_SETUP.md     # Auth setup guide
├── SEO_SETUP.md             # SEO & Analytics guide
└── README.md                # This file
```

---

## 🎨 Customization

### Change Colors

Edit `/src/styles/theme.css`:

```css
:root {
  --accent-primary: #00d9ff;  /* Cyan accent */
  --bg-primary: #0a0a0a;      /* Dark background */
}
```

### Change Logo

Update the logo in:
- `/src/app/components/navigation.tsx` (line ~150)
- `/src/app/components/footer.tsx` (line ~73)

### Add New Sections

1. Create component in `/src/app/components/`
2. Import in `/src/app/components/main-page.tsx`
3. Add navigation link in `navigation.tsx`

---

## 🧪 Testing Checklist

### Before Launch
- [ ] Test all sections scroll smoothly
- [ ] Try theme switcher (light/dark)
- [ ] Change language (EN/UK/NL)
- [ ] Submit contact form
- [ ] Open chat bot and ask questions
- [ ] Click all social links
- [ ] View legal pages (Privacy, Terms, Imprint)
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Check Google Analytics (if configured)
- [ ] Try Google Sign-In (if configured)
- [ ] Access admin panel (#admin)

---

## 🚢 Deployment

### Recommended Hosts

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
# Drag dist/ folder to Netlify
```

**Other Hosts**
- Build: `npm run build`
- Upload `dist/` folder
- Set environment variables if using Firebase

### Environment Variables

For production, add these to your hosting platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- (See `.env.example` for full list)

---

## 🐛 Troubleshooting

### Chat Bot Not Responding
- Check browser console for errors
- Bot responses are client-side, no backend needed

### Legal Pages Not Opening
- Click links in footer (Privacy, Terms, Imprint)
- Check browser console for errors
- Refresh page if needed

### Google Sign-In Disabled
- This is normal if Firebase not configured
- See `GOOGLE_AUTH_SETUP.md` to enable
- Will show "Auth not configured" message

### Admin Panel Not Working
- Access via `/#admin` or click Admin in footer
- Password: `admin123`
- Check if Supabase is configured

---

## 📈 Performance

### Lighthouse Scores (Target)
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

### Optimizations
- ✅ Code splitting
- ✅ Image optimization
- ✅ Minified CSS/JS
- ✅ CDN-ready
- ✅ Lazy loading
- ✅ Caching headers

---

## 🤝 Support & Contact

**Questions? Issues? Feedback?**

- **Email:** rozedev095@gmail.com
- **GitHub Issues:** Create an issue
- **LinkedIn:** Message me directly

---

## 📄 License

© 2026 Stepan Roze. All rights reserved.

This portfolio is proprietary. The code structure and components can be used as reference for educational purposes.

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Motion (Framer Motion)](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

Design inspired by 2026 web trends: Glassmorphism, Kinetic Typography, Bento Grids

---

## 📊 Status

| Feature | Status |
|---------|--------|
| Core Portfolio | ✅ Complete |
| Chat Bot | ✅ Complete |
| Legal Pages | ✅ Complete |
| Google Auth | 🟡 Ready (needs config) |
| SEO | 🟡 Ready (needs GA4 ID) |
| Admin Panel | ✅ Complete |
| Multi-language | ✅ Complete |
| Responsive | ✅ Complete |
| Animations | ✅ Complete |

**Overall Status:** 🟢 Production Ready

---

**Version:** 1.0  
**Last Updated:** January 25, 2026  
**Built by:** Stepan Roze

---

<div align="center">

**⭐ If you like this portfolio, give it a star! ⭐**

Made with ❤️ in Belgium 🇧🇪

</div>

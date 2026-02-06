# 🔥 Firebase Authentication - Quick Setup

## Current Status
✅ **Authentication is OPTIONAL and disabled by default**
- Your portfolio works perfectly without Firebase
- No errors will appear if Firebase is not configured
- Auth button will show "Authentication not configured" message

## Why Enable Authentication?
- User accounts and personalization
- Protected content/features
- Analytics and tracking
- Comments and interactions

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it (e.g., "portfolio-stepan-roze")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Google Sign-In
1. In your project, go to **Authentication** → **Sign-in method**
2. Click **Google** → **Enable**
3. Add your email as support email
4. Click **Save**

### 3. Register Web App
1. Go to **Project Overview** (gear icon) → **Project settings**
2. Scroll down to "Your apps"
3. Click **</>** (Web platform)
4. Register app name (e.g., "Portfolio Web")
5. Copy the `firebaseConfig` values

### 4. Add to Your Project
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase values in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyAbc123...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### 5. Add Authorized Domain (for Production)
1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your domain (e.g., `portfolio.stepanroze.com`)

## Testing
1. Click the sign-in icon in the header
2. Click "Sign in with Google"
3. Choose your Google account
4. You should see your profile picture and name

## Troubleshooting

### Error: "auth/api-key-not-valid"
- Check that all values are copied correctly from Firebase
- Make sure `.env` file is in the root directory
- Restart your dev server after adding `.env`

### Error: "auth/unauthorized-domain"
- Add `localhost` to Authorized domains in Firebase Console
- For production, add your live domain

### Button says "Auth Disabled"
- `.env` file is missing or has no values
- Values are incorrect or incomplete
- Server needs restart after adding `.env`

## Security Notes
- Never commit `.env` file to git (already in `.gitignore`)
- Never share your API keys publicly
- For production, consider adding security rules
- API keys in client code are safe (they're restricted by Firebase)

## Want to Skip Authentication?
**No problem!** Your portfolio works great without it:
- No setup needed
- No errors will show
- Auth button simply shows "not configured" message
- You can always enable it later

---

For detailed setup with screenshots, see `GOOGLE_AUTH_SETUP.md`

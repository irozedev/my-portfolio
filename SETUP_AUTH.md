# Firebase Authentication Setup Guide

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the wizard
3. Name it "stepan-portfolio" or any name you prefer

### 2. Enable Google Sign-In
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on "Google" provider
3. Toggle "Enable"
4. Set a project support email
5. Click "Save"

### 3. Register Web App
1. In Project Overview, click the **Web** icon (`</>`)
2. Register your app (nickname: "Portfolio Website")
3. Copy the Firebase configuration object

### 4. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 5. Test Authentication
1. Run your app: `npm run dev`
2. Click "Sign In" button in the header
3. Sign in with your Google account
4. You should see your profile picture in the header

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add your domain (localhost is already authorized)

### Sign-in popup doesn't appear
- Check browser's popup blocker settings
- Try allowing popups for your domain

## Security Notes

✅ **Never commit .env file to version control!**  
✅ Firebase API key is safe for client-side use  
✅ Firebase Security Rules protect your data  
✅ All authentication happens through Firebase's secure servers  

## Features Included

- ✨ Google Sign-In with popup
- 👤 User profile display (avatar + name)
- 🔐 Secure authentication flow
- 🚪 Sign out functionality
- 📱 Responsive auth UI

## Next Steps (Optional)

- Add more auth providers (GitHub, Email/Password)
- Implement user profiles in Firestore
- Add protected routes/features
- Store user preferences

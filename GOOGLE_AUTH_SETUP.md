# 🚀 Portfolio - Google OAuth Setup Instructions

## ⚠️ IMPORTANT: Google OAuth Configuration Required

Your portfolio now includes **Google Sign-In** and a **Personal Cabinet** feature! To enable this functionality, you must configure Google OAuth in your Supabase dashboard.

### 📋 Setup Steps

#### 1. Go to Supabase Dashboard
Visit: `https://supabase.com/dashboard/project/saeohtepfpuzzajfduad`

#### 2. Navigate to Authentication Settings
- Click on **"Authentication"** in the left sidebar
- Go to **"Providers"** tab
- Find **"Google"** in the list

#### 3. Enable Google Provider
- Toggle **"Enable Sign in with Google"** to ON

#### 4. Get Google OAuth Credentials

You need to create OAuth credentials in Google Cloud Console:

**A. Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select an existing one

**B. Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

**C. Create OAuth Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add these Authorized redirect URIs:
     ```
     https://saeohtepfpuzzajfduad.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - Copy your **Client ID** and **Client Secret**

#### 5. Add Credentials to Supabase
- Go back to Supabase Dashboard > Authentication > Providers > Google
- Paste your **Client ID**
- Paste your **Client Secret**
- Click **"Save"**

### ✅ Testing

After setup:
1. Click the **"Sign In"** button in the navigation
2. You'll be redirected to Google login
3. After successful login, you'll see your profile avatar
4. Click on your avatar to access the **Personal Cabinet**

### 🎯 Features Enabled

Once configured, users can:
- ✨ Sign in with Google
- ❤️ Save favorite projects to their wishlist
- 💬 Request quotes for new projects
- 📊 Track quote request status
- 📈 View activity dashboard

### 🔒 Security Note

- Never commit your Google Client Secret to version control
- Keep your Supabase service role key private
- The current setup uses secure OAuth flow with redirects

### 📚 Full Documentation

For detailed instructions, visit:
- Supabase Auth Guide: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2

---

**Need Help?** If you encounter any issues during setup, check the browser console for error messages and ensure all redirect URIs are correctly configured.

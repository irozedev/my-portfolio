# 🔐 Google Authentication Setup для roze.live

## ✅ Код вже готовий! Треба тільки налаштувати Supabase + Google Cloud

---

## 📋 **КРОК 1: Google Cloud Console**

### 1.1 Створити OAuth 2.0 Credentials

1. **Перейди на:** https://console.cloud.google.com/apis/credentials
2. **Вибери проект** або створи новий
3. **Клік на "Create Credentials"** → **"OAuth client ID"**
4. **Application type:** `Web application`
5. **Name:** `roze.live Portfolio Auth`

### 1.2 Додати Authorized Redirect URIs

**⚠️ ВАЖЛИВО:** Додай ВСІ ці URLs:

```
https://<YOUR-SUPABASE-PROJECT-ID>.supabase.co/auth/v1/callback
https://roze.live/auth/callback
https://roze.live/dashboard
http://localhost:5173/auth/callback
http://localhost:5173/dashboard
```

**Як знайти свій Supabase Project ID:**
- Перейди на https://supabase.com/dashboard/project/<project-id>/settings/api
- URL містить твій project ID
- Або знайди в `.env` файлі в `VITE_SUPABASE_URL`

### 1.3 Authorized JavaScript Origins

Додай:
```
https://roze.live
http://localhost:5173
https://<YOUR-SUPABASE-PROJECT-ID>.supabase.co
```

### 1.4 Скопіюй Credentials

Після створення отримаєш:
- **Client ID:** `12345678-abcdefg.apps.googleusercontent.com`
- **Client Secret:** `GOCSPX-xxxxxxxxxxxxxxxxx`

**⚠️ ЗБЕРЕЖИ ЦІ ДАНІ - ВОНИ ПОТРІБНІ ДЛЯ SUPABASE!**

---

## 📋 **КРОК 2: Supabase Dashboard**

### 2.1 Увімкнути Google Provider

1. **Перейди на:** https://supabase.com/dashboard/project/<project-id>/auth/providers
2. **Знайди "Google"** в списку providers
3. **Клік "Enable"**

### 2.2 Вставити Google Credentials

В Supabase Google Provider settings:

1. **Google Client ID:** `<твій Client ID з кроку 1.4>`
2. **Google Client Secret:** `<твій Client Secret з кроку 1.4>`
3. **Authorized Client IDs:** (залиш порожнім якщо не потрібно)
4. **Skip nonce check:** ❌ (залиш вимкнено)

### 2.3 Налаштувати Redirect URLs

В Supabase Auth Settings → URL Configuration:

**Site URL:**
```
https://roze.live
```

**Redirect URLs:** (додай всі)
```
https://roze.live
https://roze.live/dashboard
https://roze.live/auth/callback
http://localhost:5173
http://localhost:5173/dashboard
```

### 2.4 Увімкнути Email Confirmations (опціонально)

Якщо хочеш щоб юзери підтверджували email:
1. Auth → Settings → Email Auth
2. **Confirm email:** ✅ Enable

**Але для швидкого тесту можна залишити вимкненим!**

---

## 📋 **КРОК 3: Netlify Environment Variables**

### 3.1 Перевір .env файл локально

Переконайся що є:
```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<твій anon key>
```

### 3.2 Додати в Netlify

1. **Перейди на:** https://app.netlify.com/sites/roze-live/settings/env
2. **Додай змінні:**

```
VITE_SUPABASE_URL = https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY = <anon key з Supabase>
```

**Де знайти Anon Key:**
- Supabase Dashboard → Settings → API
- Скопіюй `anon public` key

### 3.3 Додати Custom Domain Redirect Rules

✅ **ВЖЕ ГОТОВО!** Файл `/public/_redirects` створено:

```
/auth/callback  /  200
/dashboard      /  200
/profile        /  200
/*  /index.html  200
```

І `netlify.toml` вже має правильні налаштування!

---

## 📋 **КРОК 4: Тестування (Код вже готовий!)**

✅ **Код вже повністю готовий!** 

### 4.1 Що вже є в коді:

✅ **AuthContext** - `/src/app/contexts/auth-context.tsx`
✅ **Google OAuth** - функція `signInWithProvider('google')`
✅ **GitHub OAuth** - функція `signInWithProvider('github')`
✅ **Sign Out** - функція `signOut()`
✅ **Auto session management** - автоматичне відслідковування сесії
✅ **ModernAuthModal** - красивий модал для логіну
✅ **User Profile** - показується в Navigation після логіну
✅ **Redirect URL** - `window.location.origin` (головна сторінка)

---

## 🧪 **КРОК 5: Тестування**

### 5.1 Локальний тест

```bash
npm run dev
```

1. Відкрий http://localhost:5173
2. Клікни на кнопку **"Sign In"** (право вгорі)
3. Вибери **"Continue with Google"**
4. Має відкритись Google OAuth popup
5. Вибери Google аккаунт
6. Після успішного логіна має редіректнути назад

### 5.2 Production тест

1. Зайди на https://roze.live
2. Клікни **"Sign In"**
3. Вибери **"Continue with Google"**
4. Логінься через Google
5. Має редіректнути на https://roze.live/dashboard або головну

---

## ⚠️ **МОЖЛИВІ ПОМИЛКИ**

### ❌ "Provider is not enabled"

**Рішення:**
- Перевір що Google Provider увімкнено в Supabase Dashboard
- Перевір що Client ID та Client Secret правильні

### ❌ "Redirect URI mismatch"

**Рішення:**
- Додай точні redirect URLs в Google Cloud Console
- Формат: `https://<project-id>.supabase.co/auth/v1/callback`
- Без trailing slash `/`

### ❌ "Invalid client"

**Рішення:**
- Перевір Client ID та Client Secret
- Скопіюй знову з Google Cloud Console
- Вставити в Supabase без пробілів

### ❌ Redirect не працює на Netlify

**Рішення:**
- Додай `_redirects` файл в `/public/`
- Або налаштуй `netlify.toml`
- Редеплой сайт

---

## 📊 **СТРУКТУРА AUTHENTICATION FLOW**

```
1. User клікає "Sign In with Google"
   ↓
2. `signInWithProvider('google')` викликається
   ↓
3. Supabase редіректить на Google OAuth
   ↓
4. User обирає Google account
   ↓
5. Google редіректить назад на Supabase callback
   ↓
6. Supabase обробляє токен
   ↓
7. Редірект на `redirectTo` URL (твій сайт)
   ↓
8. AuthContext оновлює user state
   ↓
9. UI показує user profile
```

---

## 🎯 **ГОТОВІ FEATURES В КОДІ:**

✅ **Google OAuth** - готово, треба тільки налаштувати
✅ **GitHub OAuth** - готово, треба налаштувати аналогічно
✅ **Auto session management** - AuthContext автоматично
✅ **Sign out** - готова функція
✅ **User profile** - показується в Navigation
✅ **Protected routes** - можна додати (див. нижче)

---

## 🔒 **ДОДАТКОВО: Protected Routes (опціонально)**

Якщо хочеш щоб деякі сторінки були доступні тільки після логіну:

### Створи Protected Component

```typescript
// /src/app/components/protected-route.tsx
import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

### Використання:

```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

---

## 📝 **CHECKLIST:**

- [ ] Google Cloud Console - OAuth Client створено
- [ ] Redirect URIs додані в Google Console
- [ ] Client ID та Secret скопійовані
- [ ] Supabase - Google Provider увімкнено
- [ ] Client ID та Secret вставлені в Supabase
- [ ] Supabase - Redirect URLs налаштовані
- [ ] Netlify - Environment variables додані
- [ ] Netlify - Redirect rules налаштовані
- [ ] Локальний тест пройдено ✅
- [ ] Production тест пройдено ✅

---

## 🆘 **ПІДТРИМКА:**

Якщо щось не працює:

1. **Перевір Console:** Відкрий DevTools → Console
2. **Перевір Network:** DevTools → Network → фільтр "auth"
3. **Перевір Supabase Logs:** Dashboard → Logs → Auth Logs
4. **Документація:** https://supabase.com/docs/guides/auth/social-login/auth-google

---

## 🎉 **ВСЕ ГОТОВО!**

Після налаштування всіх кроків, твій Google Auth має працювати на:
- ✅ http://localhost:5173 (локально)
- ✅ https://roze.live (production)

**УДАЧІ! 🚀**
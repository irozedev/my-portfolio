# 🔐 ENVIRONMENT VARIABLES SETUP

## 📋 ВИКОРИСТАНІ СЕРВІСИ:

✅ **Supabase** - для авторизації, бази даних, storage
- Не потрібні додаткові env variables!
- Конфігурація зберігається в `/utils/supabase/info.tsx`
- Автоматично згенерована Figma Make

❌ **Firebase** - НЕ використовується (package встановлено, але не налаштовано)

---

## ✅ ЩО ВЖЕ НАЛАШТОВАНО:

### 1. Supabase Configuration
```tsx
// /utils/supabase/info.tsx
export const projectId = "saeohtepfpuzzajfduad"
export const publicAnonKey = "eyJhbG..."
```

### 2. Supabase Client
```tsx
// /utils/supabase/client.tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase = createClient(supabaseUrl, publicAnonKey);
```

---

## 🚀 NETLIFY DEPLOYMENT - НЕ ПОТРІБНІ ENV VARIABLES!

**ВАЖЛИВО:** Для базового функціоналу твого портфоліо **не потрібно налаштовувати env variables на Netlify!**

Всі Supabase credentials вже захардкоджені в коді:
- ✅ Project ID
- ✅ Anon Key (публічний, безпечно показувати)

---

## ⚙️ ОПЦІОНАЛЬНІ ENV VARIABLES (якщо хочеш додати):

### Якщо хочеш додати Google Analytics:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Якщо хочеш додати Firebase (для додаткових функцій):
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

---

## 🔧 ЯК ДОДАТИ ENV VARIABLES НА NETLIFY (якщо знадобиться):

### Варіант 1: Через Netlify UI

1. **Відкрий свій сайт на Netlify:**
   - Іди на https://app.netlify.com
   - Обери свій проект (roze.live)

2. **Site settings → Environment variables:**
   ```
   Site settings → Build & deploy → Environment variables
   ```

3. **Натисни "Add a variable":**
   ```
   Key: VITE_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX
   ```

4. **Збережи і передеплой:**
   ```
   Deploys → Trigger deploy → Deploy site
   ```

---

### Варіант 2: Через netlify.toml

Додай в `netlify.toml`:

```toml
[build.environment]
  VITE_GA_MEASUREMENT_ID = "G-XXXXXXXXXX"
```

**⚠️ НЕ ДОДАВАЙ СЕКРЕТНІ КЛЮЧІ В netlify.toml!**
- Тільки публічні ключі (GA ID, Supabase Anon Key)
- Секретні ключі додавай через Netlify UI!

---

## 🔍 ЯК ВИКОРИСТОВУВАТИ В КОДІ:

### У Vite проекті:

```tsx
// ✅ Правильно
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

// ❌ Неправильно
const gaId = process.env.VITE_GA_MEASUREMENT_ID; // Це для Node.js!
```

### Перевірка чи змінна існує:

```tsx
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  console.log('Google Analytics enabled');
} else {
  console.log('Google Analytics disabled');
}
```

---

## 🎯 ПОТОЧНИЙ СТАН:

### ✅ ЩО ПРАЦЮЄ БЕЗ ENV:
- Авторизація через Google (Supabase Auth)
- База даних (KV Store)
- Contact form
- Testimonials
- Comments
- Reactions
- User profiles
- Dashboard

### 📊 ЩО МОЖНА ДОДАТИ ЧЕРЕЗ ENV:
- Google Analytics (VITE_GA_MEASUREMENT_ID)
- Firebase (якщо потрібен)
- Інші сторонні сервіси

---

## 🚀 ШВИДКИЙ СТАРТ:

### 1. Локально (.env для розробки):

```bash
# Створи .env файл
touch .env

# Додай змінні (опціонально)
echo "VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX" > .env
```

### 2. На Netlify:

**НЕ ПОТРІБНО НІЧОГО РОБИТИ!** 🎉

Просто push в GitHub:
```bash
git push origin main
```

Netlify автоматично задеплоїть з існуючими Supabase credentials!

---

## ⚠️ ВАЖЛИВІ НОТАТКИ:

### 1. Публічні vs Приватні ключі:

**✅ МОЖНА показувати:**
- Supabase Project ID
- Supabase Anon Key
- Google Analytics ID
- Firebase API Key (якщо налаштовані правила безпеки)

**❌ НЕ МОЖНА показувати:**
- Supabase Service Role Key
- Private API keys
- Database passwords
- OAuth Client Secrets

### 2. Prefix `VITE_`:

Vite вимагає щоб **всі env variables для фронтенду** починалися з `VITE_`:

```bash
# ✅ Працює
VITE_API_KEY=abc123

# ❌ НЕ працює
API_KEY=abc123
```

### 3. .gitignore:

Перевір що `.env` додано в `.gitignore`:

```bash
# Local .env files
.env
.env.local
.env.*.local
```

---

## 🔍 TROUBLESHOOTING:

### Проблема: "import.meta.env.VITE_XXX is undefined"

**Рішення 1:** Перевір що змінна починається з `VITE_`

**Рішення 2:** Перезапусти dev server:
```bash
npm run dev
```

**Рішення 3:** На Netlify - trigger re-deploy після додавання env variables

---

### Проблема: "Env variables не працюють на Netlify"

**Рішення 1:** Перевір що додав їх в правильному місці:
```
Site settings → Build & deploy → Environment variables
```

**Рішення 2:** Trigger новий деплой:
```
Deploys → Trigger deploy → Clear cache and deploy site
```

---

## 📚 КОРИСНІ ПОСИЛАННЯ:

- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/initializing)

---

## ✅ ПІДСУМОК:

**ДЛЯ БАЗОВОГО ДЕПЛОЮ НА NETLIFY:**
- ✅ НЕ потрібні env variables
- ✅ Просто push в GitHub
- ✅ Netlify автоматично все задеплоїть

**ДЛЯ ДОДАТКОВИХ ФУНКЦІЙ:**
- 📊 Додай Google Analytics через Netlify UI
- 🔥 Налаштуй Firebase (якщо потрібен)
- 🔐 Ніколи не комітуй секретні ключі!

---

**READY TO DEPLOY! 🚀**

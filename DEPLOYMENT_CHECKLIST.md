# ✅ DEPLOYMENT CHECKLIST - ROZE.LIVE

## 🎯 ШВИДКИЙ ЧЕКЛИСТ (5 хвилин!)

---

## ☑️ КРОК 1: GIT PUSH

```bash
git add .
git commit -m "fix: Production ready - Netlify config + Supabase client"
git push origin main
```

**Статус:** ⬜ Не зроблено | ✅ Готово

---

## ☑️ КРОК 2: NETLIFY BUILD

### Автоматично після push:

1. **Netlify підхопить зміни з GitHub**
2. **Запустить:** `npm install`
3. **Збілдить:** `npm run build`
4. **Опублікує:** `dist/` папку

### Де дивитись:
```
https://app.netlify.com
→ Твій сайт
→ Deploys
```

### Що має бути в логах:
```
✔ Build succeeded
✔ Published to: https://твій-сайт.netlify.app
```

**Статус:** ⬜ В процесі | ✅ Build пройшов

---

## ☑️ КРОК 3: ПЕРЕВІР НА NETLIFY URL

**Відкрий тимчасовий Netlify URL:**
```
https://твій-сайт.netlify.app
```

### Перевір:
- [ ] Сайт відкривається (не чорний екран!)
- [ ] Стилі застосовуються (темна тема, cyan акценти)
- [ ] Навігація працює
- [ ] Анімації працюють
- [ ] Console (F12) без критичних помилок

**Статус:** ⬜ Не перевірено | ✅ Все працює

---

## ☑️ КРОК 4: ДОДАЙ CUSTOM DOMAIN

### В Netlify Dashboard:

1. **Site settings → Domain management**
2. **Add custom domain**
3. **Введи:** `roze.live`
4. **Netlify покаже DNS записи** (запиши їх!)

**Приклад:**
```
A Record:
Name: @
Value: 75.2.60.5

CNAME:
Name: www
Value: твій-сайт.netlify.app
```

**Статус:** ⬜ Не додано | ✅ Domain додано

---

## ☑️ КРОК 5: НАЛАШТУЙ DNS

### У свого провайдера домену:

**Де ти купив `roze.live`?**
- Namecheap?
- Cloudflare?
- GoDaddy?
- Google Domains?

### Додай DNS записи:

**A Record:**
```
Type: A
Name/Host: @
Value: 75.2.60.5
TTL: Automatic
```

**CNAME (для www):**
```
Type: CNAME
Name: www
Value: твій-сайт.netlify.app
TTL: Automatic
```

### ⚠️ ВАЖЛИВО:
- ❌ **Видали старі** записи на Figma Sites!
- ✅ Збережи зміни

**Статус:** ⬜ Не налаштовано | ✅ DNS налаштовано

---

## ☑️ КРОК 6: ЧЕКАЙ DNS PROPAGATION

### Скільки чекати:
- ⏱️ **Зазвичай:** 5-30 хвилин
- 🕐 **Іноді:** 2-6 годин
- 🐌 **Максимум:** 48 годин

### Перевір на:
```
https://dnschecker.org
```
**Введи:** `roze.live`
**Дивись:** A Record має показувати `75.2.60.5`

### Або в терміналі:
```bash
dig roze.live
```

**Статус:** ⬜ Чекаю | ✅ DNS оновився

---

## ☑️ КРОК 7: VERIFY DNS В NETLIFY

### Коли DNS оновився:

1. **Netlify → Domain settings**
2. **Check DNS configuration**
3. **Має бути:** ✅ DNS configured correctly

**Якщо помилка:**
- Зачекай ще 10-30 хвилин
- Спробуй знову

**Статус:** ⬜ Не перевірено | ✅ DNS verified

---

## ☑️ КРОК 8: НАЛАШТУЙ SSL (HTTPS)

### В Netlify автоматично:

1. **Domain settings → HTTPS**
2. **Provision certificate** (автоматично)
3. **Зачекай 1-5 хвилин**
4. **Увімкни:** Force HTTPS

### Має бути:
```
✅ Let's Encrypt certificate installed
✅ HTTPS enabled
✅ HTTP → HTTPS redirect enabled
```

**Статус:** ⬜ Не налаштовано | ✅ SSL працює

---

## ☑️ КРОК 9: ФІНАЛЬНА ПЕРЕВІРКА

### Відкрий свій домен:
```
https://roze.live
```

### Перевір ВСЕ:

#### Загальне:
- [ ] Сайт відкривається на `roze.live`
- [ ] HTTPS працює (замочок в браузері)
- [ ] Немає попереджень SSL
- [ ] Стилі завантажуються
- [ ] Шрифти завантажуються
- [ ] Іконки відображаються

#### Навігація:
- [ ] Scroll to sections працює
- [ ] Мобільне меню працює
- [ ] Перемикач мов працює (EN/UA/NL/AR/ES)
- [ ] Theme toggle працює (light/dark)

#### Функціонал:
- [ ] Contact form працює (надсилає дані)
- [ ] Google Sign-In працює
- [ ] Projects відкриваються
- [ ] Comments працюють
- [ ] Reactions працюють

#### Performance:
- [ ] Сайт швидко завантажується (< 3 сек)
- [ ] Анімації плавні
- [ ] Немає layout shifts
- [ ] Images оптимізовані

#### Console (F12):
- [ ] Немає критичних помилок
- [ ] Бачиш лого: `🚀 [ROZE.LIVE] main.tsx LOADED`
- [ ] Всі API calls успішні (200/201)

**Статус:** ⬜ Є проблеми | ✅ ВСЕ ПРАЦЮЄ!

---

## ☑️ КРОК 10: POST-DEPLOYMENT

### Після успішного деплою:

1. **[ ] Очисти DNS кеш** на своєму комп'ютері
   ```bash
   # Mac
   sudo dscacheutil -flushcache
   
   # Windows
   ipconfig /flushdns
   ```

2. **[ ] Тестуй на різних пристроях:**
   - Desktop (Chrome, Firefox, Safari)
   - Mobile (iOS, Android)
   - Tablet

3. **[ ] Тестуй з різних країн** (VPN або попроси друзів)

4. **[ ] Додай до Google Search Console:**
   ```
   https://search.google.com/search-console
   ```

5. **[ ] Налаштуй Google Analytics** (опціонально)

6. **[ ] Налаштуй мониторінг** (Netlify Analytics або інше)

7. **[ ] Backup коду на GitHub** ✅ (вже є)

---

## 📊 ФІНАЛЬНИЙ СТАТУС

```
🎯 Проект: Stepan Roze Portfolio
🌐 Domain: roze.live
🚀 Hosting: Netlify
💾 Database: Supabase
🔐 Auth: Supabase (Google/GitHub)
```

### Всі системи готові:
- [ ] Git repository
- [ ] Netlify build config
- [ ] Environment variables (не потрібні!)
- [ ] Custom domain
- [ ] DNS records
- [ ] SSL certificate
- [ ] Суpabase integration
- [ ] Frontend code
- [ ] Backend server
- [ ] Database (KV store)

---

## 🎉 ГОТОВО!

**Якщо всі чекбокси ✅ - ВІТАЮ!**

Твоє портфоліо live на:
```
🌍 https://roze.live
```

---

## 🆘 ЯКЩО ЩОСЬ НЕ ТАК:

### 1. Build failed на Netlify:
- Подивись логи білду
- Покажи мені помилки
- Перевір `package.json` та `netlify.toml`

### 2. DNS не оновлюється:
- Перевір що записи правильні
- Зачекай ще
- Використай `dnschecker.org`

### 3. SSL не працює:
- Verify DNS в Netlify
- Re-provision certificate
- Перевір Cloudflare proxy (має бути DNS only)

### 4. Сайт не працює:
- Відкрий Console (F12)
- Скопіюй помилки
- Покажи мені - я допоможу!

---

## 📚 ДОКУМЕНТАЦІЯ:

- `/NETLIFY_FIX.md` - Netlify setup
- `/DNS_SETUP.md` - DNS налаштування (детально!)
- `/ENV_SETUP.md` - Environment variables
- `/DEPLOYMENT_CHECKLIST.md` - Цей файл

**ВСЕ ГОТОВО ДЛЯ ДЕПЛОЮ! УДАЧІ! 🚀**

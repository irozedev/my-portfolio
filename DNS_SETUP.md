# 🌐 DNS SETUP FOR ROZE.LIVE → NETLIFY

## 🎯 ШВИДКИЙ СТАРТ

### ЩО ПОТРІБНО:
1. ✅ Твій домен: `roze.live`
2. ✅ Netlify сайт (вже є)
3. ✅ Доступ до DNS налаштувань домену

### ЧАС ОЧІКУВАННЯ:
- ⏱️ Зазвичай: **5-30 хвилин**
- 🐌 Максимум: **48 годин** (рідко)

---

## 📋 КРОК 1: ОТРИМАЙ NETLIFY DNS ЗАПИСИ

### В Netlify Dashboard:

1. **Іди на:** https://app.netlify.com
2. **Обери свій сайт** (Portfolio)
3. **Domain settings → Add custom domain**
4. **Введи:** `roze.live`
5. **Netlify покаже DNS записи** які треба додати

---

## 🔧 КРОК 2: НАЛАШТУЙ DNS У СВОГО ПРОВАЙДЕРА

### 📍 ДЕ ТИ КУПИВ ДОМЕН `roze.live`?

---

## A) NAMECHEAP

### 1. Залогінься на Namecheap:
```
https://www.namecheap.com/myaccount/login/
```

### 2. Domain List → roze.live → Manage

### 3. Advanced DNS tab

### 4. Додай записи:

**Для roze.live (apex):**
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic
```

**Для www.roze.live:**
```
Type: CNAME Record
Host: www
Value: твій-сайт.netlify.app
TTL: Automatic
```

### 5. Видали старі записи (якщо є):
- ❌ Видали старі A Records на @
- ❌ Видали старі CNAME на www
- ✅ Залиш тільки нові Netlify записи

### 6. Save All Changes

---

## B) CLOUDFLARE

### 1. Залогінься на Cloudflare:
```
https://dash.cloudflare.com/login
```

### 2. Обери домен roze.live

### 3. DNS → Records → Add record

### 4. Додай записи:

**Для roze.live:**
```
Type: A
Name: @
IPv4 address: 75.2.60.5
Proxy status: DNS only (сірий хмара, НЕ orange!)
```

**Для www:**
```
Type: CNAME
Name: www
Target: твій-сайт.netlify.app
Proxy status: DNS only
```

### 5. ⚠️ ВАЖЛИВО - Вимкни Cloudflare Proxy:
- Натисни на помаранчеву хмарку
- Зроби її сірою (DNS only)
- Інакше SSL може не працювати!

### 6. Save

---

## C) GODADDY

### 1. Залогінься на GoDaddy:
```
https://sso.godaddy.com/
```

### 2. My Products → Domains → roze.live → DNS

### 3. Додай записи:

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 600 seconds (або 1 hour)
```

**CNAME:**
```
Type: CNAME
Name: www
Value: твій-сайт.netlify.app
TTL: 1 Hour
```

### 4. Видали старі записи

### 5. Save

---

## D) GOOGLE DOMAINS

### 1. Залогінься:
```
https://domains.google.com
```

### 2. Обери roze.live → DNS

### 3. Custom records:

**A Record:**
```
Host name: @
Type: A
TTL: 1H
Data: 75.2.60.5
```

**CNAME:**
```
Host name: www
Type: CNAME
TTL: 1H
Data: твій-сайт.netlify.app
```

### 4. Save

---

## E) ІНШИЙ ПРОВАЙДЕР

### Загальні інструкції:

1. **Знайди розділ DNS Management:**
   - Може називатися: DNS Settings, DNS Management, Advanced DNS, Zone File

2. **Додай A Record для apex домену:**
   ```
   Type/Record Type: A
   Name/Host: @ або залиш порожнім або roze.live
   Value/Points to: 75.2.60.5
   TTL: Automatic або 3600 або 1 hour
   ```

3. **Додай CNAME для www:**
   ```
   Type: CNAME
   Name: www
   Value: твій-сайт.netlify.app (або як Netlify сказав)
   TTL: Automatic або 3600
   ```

4. **Видали старі записи** які вказують на старий Figma Sites

5. **Збережи зміни**

---

## ⏱️ КРОК 3: ЧЕКАЙ PROPAGATION

### Скільки чекати?

- ✅ **Зазвичай: 5-30 хвилин**
- 🕐 Іноді: 2-6 годин
- 🐌 Максимум: 48 годин (дуже рідко)

### Як перевірити:

#### 1. **DNS Checker онлайн:**
```
https://dnschecker.org
```
Введи: `roze.live`
Дивись чи A Record вказує на `75.2.60.5`

#### 2. **Terminal (Mac/Linux):**
```bash
dig roze.live
# Дивись на ANSWER SECTION
```

#### 3. **Command Prompt (Windows):**
```cmd
nslookup roze.live
```

#### 4. **Просто відкрий:**
```
https://roze.live
```
Якщо бачиш свій сайт - працює! 🎉

---

## 🔒 КРОК 4: НАЛАШТУЙ SSL (HTTPS)

### В Netlify:

1. **Domain settings → HTTPS**
2. **Verify DNS configuration**
3. **Provision certificate** (автоматично)
4. **Зачекай 1-5 хвилин**
5. **Force HTTPS** - увімкни!

Netlify автоматично отримає **безкоштовний Let's Encrypt SSL** сертифікат!

---

## ⚠️ ТИПОВІ ПРОБЛЕМИ:

### 1. "DNS validation failed"

**Причина:** DNS записи ще не propagated

**Рішення:**
- Зачекай 30-60 хвилин
- Перевір записи на dnschecker.org
- Спробуй "Verify DNS configuration" знову

---

### 2. "Too many redirects"

**Причина:** Cloudflare Proxy увімкнено

**Рішення:**
- Іди в Cloudflare → DNS
- Натисни на помаранчеву хмарку
- Зроби її сірою (DNS only)

---

### 3. Сайт відкривається але без стилів

**Причина:** Білд Netlify не пройшов або неправильний baseURL

**Рішення:**
- Перевір логи білду в Netlify
- Переконайся що `npm run build` працює
- Перевір `vite.config.ts` → `base: '/'`

---

### 4. "This site can't be reached"

**Причина:** DNS ще не оновився

**Рішення:**
- Зачекай ще
- Перевір що DNS записи правильні
- Спробуй в incognito mode
- Спробуй з мобільного інтернету (інший DNS)

---

## 🎯 ФІНАЛЬНИЙ ЧЕКЛИСТ:

### В DNS провайдері:
- [ ] A Record: @ → 75.2.60.5
- [ ] CNAME: www → твій-сайт.netlify.app
- [ ] Видалено старі записи на Figma Sites
- [ ] Збережено зміни

### В Netlify:
- [ ] Custom domain додано: roze.live
- [ ] DNS verification passed
- [ ] SSL certificate provisioned
- [ ] Force HTTPS увімкнено
- [ ] Сайт відкривається на https://roze.live

---

## 📊 NETLIFY IP АДРЕСИ (якщо треба):

**Load Balancer IP (рекомендовано):**
```
75.2.60.5
```

**Альтернативні (якщо Netlify каже інші):**
```
IPv4:
75.2.60.5
99.83.190.102
3.248.89.170
```

**IPv6 (опціонально):**
```
2600:1f18:2148:bc02:3b36:dea5:6370:2e94
```

---

## 🚀 ШВИДКИЙ ПІДСУМОК:

### 1. **В Netlify:** Додай domain roze.live
### 2. **В DNS:** Додай A record @ → 75.2.60.5
### 3. **Чекай:** 5-30 хвилин
### 4. **Готово!** Сайт на https://roze.live

---

## 💡 КОРИСНІ КОМАНДИ:

### Перевірити DNS:
```bash
# Mac/Linux
dig roze.live
dig www.roze.live

# Windows
nslookup roze.live
nslookup www.roze.live
```

### Очистити DNS кеш локально:
```bash
# Mac
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

---

## 📚 КОРИСНІ ПОСИЛАННЯ:

- [Netlify Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)
- [DNS Checker Tool](https://dnschecker.org)
- [What's My DNS](https://www.whatsmydns.net)
- [Netlify Status](https://www.netlifystatus.com/)

---

## ✅ ГОТОВО!

Якщо все налаштовано правильно:

```
https://roze.live → ВАШ САЙТ! 🎉
```

**ТЕПЕР ПРОСТО ЧЕКАЙ PROPAGATION!** ⏱️

---

## 🆘 ЯКЩО ПРОБЛЕМИ:

1. **Скопіюй скріншот з Netlify** (Domain settings)
2. **Скопіюй скріншот з DNS провайдера** (твої записи)
3. **Покажи мені** - я допоможу!

**УДАЧІ З ДЕПЛОЄМ! 🚀**

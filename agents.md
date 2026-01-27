# Цветочек в Горшочек — Руководство по разработке

## Бренд

**Название:** Цветочек в Горшочек  
**Слоган:** Изысканные букеты и цветочные композиции с доставкой по Москве  
**Тон коммуникации:** Тёплый, заботливый, элегантный. Обращение на "вы". Без излишней официальности, но с уважением к клиенту.

**Ассортимент:**

- Букеты (авторские, сезонные, моно-букеты)
- Корзины с цветами
- Композиции
- Новогодние/праздничные коллекции (еловые ветви, праздничный декор)
- Конфеты, свечи, подарочные наборы

**НЕ продаём:** комнатные растения, горшечные цветы

---

## Цветовая палитра

### Основные цвета (Light Mode)

| Название           | HEX       | CSS-переменная         | Использование                  |
| ------------------ | --------- | ---------------------- | ------------------------------ |
| Background         | `#faf8f6` | `--background`         | Основной фон страницы          |
| Foreground         | `#3d3733` | `--foreground`         | Основной текст                 |
| Primary            | `#c9a992` | `--primary`            | Акцентный цвет, кнопки, ссылки |
| Primary Foreground | `#ffffff` | `--primary-foreground` | Текст на primary фоне          |
| Secondary          | `#f5f0ec` | `--secondary`          | Вторичный фон, карточки        |
| Muted              | `#f8f5f2` | `--muted`              | Приглушённый фон               |
| Muted Foreground   | `#8a7e75` | `--muted-foreground`   | Вторичный текст                |
| Accent             | `#ebe4dd` | `--accent`             | Акцентный фон для выделения    |
| Border             | `#e8e2dc` | `--border`             | Границы, разделители           |
| Card               | `#ffffff` | `--card`               | Фон карточек                   |

### Палитра для карточек Bento Grid

Для bento-карточек используй мягкие пастельные тона:

- `#ebe4dd` — бежевый (основной)
- `#e8d4d4` — пудрово-розовый
- `#f0e6dc` — кремовый
- `#dde4e8` — нежно-голубой
- `#e8dcd4` — персиковый

### Правила использования цветов

1. **Никогда не использовать яркие/насыщенные цвета** — только пастельные тона
2. **Зелёный цвет НЕ используется** — даже для растительной тематики
3. **Градиенты только для оверлеев** на изображениях (from-black/40 to-transparent)
4. **Максимум 3-5 цветов** на одном экране

---

## Типографика

### Шрифты

| Шрифт              | CSS-класс    | Использование                               |
| ------------------ | ------------ | ------------------------------------------- |
| Cormorant Garamond | `font-serif` | Заголовки, название бренда, акцентный текст |
| Inter              | `font-sans`  | Основной текст, UI-элементы, навигация      |

### Иерархия заголовков

```
H1: font-serif text-4xl md:text-5xl lg:text-6xl
H2: font-serif text-2xl md:text-3xl
H3: font-serif text-xl md:text-2xl
Body: font-sans text-base
Small: font-sans text-sm
Caption: font-sans text-xs text-muted-foreground
```

### Правила

- Заголовки всегда в `font-serif`
- Курсив (`<em>`) используется для выделения ключевых слов в заголовках
- `uppercase tracking-wider` для меток и категорий
- `text-balance` или `text-pretty` для заголовков

---

## Компоненты

### Кнопки

```tsx
// Primary
<Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">

// Secondary / Outline
<Button variant="outline" className="rounded-full border-foreground/20 bg-transparent">

// Ghost
<Button variant="ghost" className="rounded-full">
```

**Правила:**

- Все кнопки с `rounded-full`
- Padding: `px-6` для стандартных, `px-8` для крупных
- Высота: `h-10` стандартная, `h-12` для CTA

### Карточки

```tsx
<div className="rounded-2xl bg-card p-6 shadow-sm">
```

**Правила:**

- Border-radius: `rounded-2xl` (0.75rem)
- Тени мягкие: `shadow-sm` или без теней
- Hover-эффекты: `transition-transform duration-300 hover:scale-[1.02]`

### Изображения

```tsx
<div className="relative rounded-2xl overflow-hidden">
  <Image
    src="..."
    alt="..."
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-105"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
</div>
```

**Правила:**

- Всегда `rounded-2xl overflow-hidden`
- Hover-эффект: `scale-105` с `duration-700`
- Gradient overlay для текста поверх изображений

### Секции

```tsx
<section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
```

**Правила:**

- Вертикальные отступы: `py-16 md:py-24`
- Горизонтальные отступы: `px-4 md:px-6 lg:px-8`
- Максимальная ширина: `max-w-7xl mx-auto`

---

## Структура страницы

### Главная страница (по порядку)

1. **Header** — фиксированный, с адресом доставки, логотипом, телефоном, корзиной
2. **Hero Slider** — полноэкранный слайдер с акциями (автоскролл 5 сек)
3. **Categories** — горизонтальный скролл категорий
4. **Products** — табы (Акции / Популярное / Новинки)
5. **Custom Order** — CTA индивидуального заказа
6. **Blog** — статьи о коллекциях
7. **App Promo** — промо приложения
8. **Benefits** — 6 преимуществ
9. **Contact Blocks** — контакты + 2 CTA-карточки
10. **FAQ** — аккордеон вопросов
11. **Footer** — 4 колонки + соцсети

### Header

- Два уровня навигации
- Верхний: адрес, логотип (текст "Цветочек в Горшочек"), телефон, иконки
- Нижний: каталог с dropdown, основные ссылки
- Фиксированный: `fixed top-0 z-50 bg-background/80 backdrop-blur-md`

### Footer

- 4 колонки: Контакты, О магазине, Покупателям, Доставка
- Соцсети: VK, Telegram, WhatsApp, Instagram
- Copyright внизу

---

## Анимации

### Transitions

```
duration-300 — UI элементы (кнопки, ссылки)
duration-500 — Средние анимации (карточки, появление)
duration-700 — Медленные анимации (изображения, слайдер)
```

### Hover-эффекты

- Кнопки: `hover:bg-primary/90`
- Карточки: `hover:scale-[1.02]` или `hover:shadow-md`
- Изображения: `group-hover:scale-105`
- Ссылки: `hover:text-primary transition-colors`

### Слайдер

- Автопрокрутка: 5 секунд
- Transition: `opacity duration-700`
- Навигация появляется при hover: `opacity-0 group-hover:opacity-100`

---

## Иконки

Используем **Lucide React**:

```tsx
import {
  ShoppingBag,
  User,
  Search,
  Phone,
  MapPin,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
```

**Размеры:**

- Навигация: `h-5 w-5`
- Кнопки: `h-4 w-4`
- Крупные: `h-6 w-6`

---

## Контент

### Язык

- Весь контент на **русском языке**
- Email: `info@cvetochek.ru`
- Телефон: `8 (495) 120-77-22`
- Города: Москва, Санкт-Петербург

### Категории товаров

- Букеты
- Корзины
- Композиции
- Моно-букеты
- Новый год
- Конфеты
- Свечи

### Ценовой формат

```tsx
{price.toLocaleString("ru-RU")} ₽
// Результат: 5 290 ₽
```

---

## Файловая структура

```
/app
  /page.tsx          — главная страница
  /layout.tsx        — корневой layout
  /globals.css       — глобальные стили, CSS-переменные

/components
  /header.tsx        — шапка сайта
  /footer.tsx        — подвал сайта
  /hero-slider.tsx   — слайдер на главной
  /categories.tsx    — категории товаров
  /products-section.tsx — секция с товарами
  /product-card.tsx  — карточка товара
  /custom-order.tsx  — блок индивидуального заказа
  /blog-section.tsx  — блог
  /app-promo.tsx     — промо приложения
  /benefits.tsx      — преимущества
  /contact-blocks.tsx — контакты
  /faq-section.tsx   — FAQ
  /ui/*              — shadcn/ui компоненты

/public
  /images            — изображения товаров и баннеров
```

---

## Чеклист перед коммитом

- [ ] Все тексты на русском языке
- [ ] Название бренда: "Цветочек в Горшочек" (не "Горшочке")
- [ ] Нет упоминаний комнатных растений
- [ ] Цвета только из палитры (пастельные)
- [ ] Кнопки с `rounded-full`
- [ ] Заголовки в `font-serif`
- [ ] Изображения с hover-эффектом и overlay
- [ ] Адаптивность (mobile-first)

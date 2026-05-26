Build a React screen "Workers Roster" (Картотека исполнителей) for a B2B 
staffing ERP. This is the main screen of the "Workers" module.

═══════════════════════════════════════════════════════
DESIGN SYSTEM (strict — match existing modules)
═══════════════════════════════════════════════════════

Typography:
- Headings: Montserrat (600 weight)
- Body: Nunito Sans (400/500)
- Numbers: SF Mono (tabular figures, for ratings/counts/dates)

Colors:
- Primary: #FF9900 (orange) — accent only, never as page bg
- Secondary: #4877A5 (blue) — secondary actions
- Surface: white #FFFFFF, page bg #FAFAFA, borders #E5E7EB
- Text: primary #111827, secondary #6B7280, tertiary #9CA3AF
- Semantic: green #22C55E, yellow #EAB308, red #EF4444
- Pastel tints for fills: green #F0FDF4, yellow #FEFCE8, red #FEF2F2,
  blue #EFF6FF, orange #FFF7ED, gray #F3F4F6

Style: Linear / Notion / Stripe — minimalist, "show only signal", 
generous whitespace, no decorative gradients, no shadows except 
subtle elevation (0 1px 2px rgba(0,0,0,0.04)).

Icons: ONLY lucide-react. No emojis anywhere.
Radii: 8px cards, 6px buttons, 12px pills.

═══════════════════════════════════════════════════════
LAYOUT
═══════════════════════════════════════════════════════

Master-detail 50/50 split (same as Requests module):
- LEFT: workers list (50% width)
- RIGHT: detail panel for selected worker (50% width, sticky on scroll)
- Vertical divider 1px #E5E7EB between them

═══════════════════════════════════════════════════════
TOP BAR (above the split, full width)
═══════════════════════════════════════════════════════

Row 1 — Page header (48px tall):
- Left: title "Исполнители" (Montserrat 18px/600) + 
  subtitle "2 347 в базе · 184 активных" (Nunito 13px/400 #6B7280)
- Right: button "+ Добавить исполнителя" (primary orange, 36px tall, 
  6px radius, Plus icon left)

Row 2 — Saved views tabs (40px tall, scrollable horizontally):
Pill-style tabs (12px radius, 8px/14px padding, Nunito 13px/500):
- "Все" (active = orange fill #FFF7ED + orange text #FF9900 + orange 
  border 1px)
- "Активные" (inactive = gray border #E5E7EB + #6B7280 text)
- "Новички"
- "Возвращенцы"
- "Координаторы"
- "Без смен >14 дней"
- "Чёрный список"
- "+ Сохранить вид" (dashed border, secondary)

Row 3 — Filter bar (Linear-style command bar, 44px tall):
- Search input (left, 280px wide): Search icon + "Поиск по ФИО, 
  телефону, ID..." placeholder, 6px radius, #E5E7EB border
- Filter chips (inline, expandable popovers on click):
  · "Рейтинг: все" with ChevronDown
  · "Гео: вся Казань" with ChevronDown  
  · "Гендер: все" with ChevronDown
  · "НПД: все" with ChevronDown
  · "Возраст: все" with ChevronDown
  · "+ Фильтр" (Plus icon, dashed border) — opens dropdown 
    with: Навыки, Стаж, Координатор, Верификация, Источник
- Right side: button "Сортировка" (ArrowUpDown icon) + button 
  "Колонки" (Columns icon, ghost style)

Active filters render with orange dot indicator + colored bg #FFF7ED.

═══════════════════════════════════════════════════════
LEFT PANEL — Workers list
═══════════════════════════════════════════════════════

Header row (sticky, 36px, bg #FAFAFA, border-bottom #E5E7EB):
- Checkbox (24px width) for select-all
- "Исполнитель" (flex grow)
- "Рейтинг" (80px, right-aligned)
- "Статус" (110px)
- "Доступность" (120px)

Each row (72px tall, hover bg #F9FAFB, selected bg #FFF7ED + 
left border 3px #FF9900):

Layout per row (left to right):
1. Checkbox (24px)
2. Avatar (40px circle): photo OR initials on colored bg. 
   Initial bg colors rotate: #FEE4D2, #D6E4F3, #DCFCE7, #FEF3C7, 
   #FCE7F3. Text white, Montserrat 600, 14px.
3. Name block (flex grow):
   - Line 1: "Иванов Иван Иванович" (Nunito 14px/600, #111827)
   - Line 2 (Nunito 12px/400, #6B7280): "+7 917 234-56-78 · 
     Казань, Авиастроительный · 32 года" — truncate with ellipsis
4. Rating (80px, right-aligned):
   - Number "0.87" big (SF Mono 16px/600, color by tier:
     ≥0.80 #16A34A, 0.60-0.79 #6B7280, <0.60 #CA8A04)
   - Below: "47 смен" (SF Mono 11px/400 #9CA3AF)
5. Status pill (110px):
   - "Active": bg #DCFCE7, text #16A34A
   - "Returning": bg #FFEDD5, text #EA580C  
   - "New": bg #DBEAFE, text #2563EB
   - "Inactive": bg #F3F4F6, text #6B7280
   - Pill: 6px/10px padding, 12px radius, 11px Nunito 600 uppercase 
     letter-spacing 0.5px
   - If is_verified: small CheckCircle2 icon #22C55E (12px) inline 
     left of pill
6. Availability (120px):
   - If ready_now=true: green dot + "Готов сейчас" (Nunito 12px/600 
     #16A34A)
   - If availability_date today: orange dot + "Сегодня" (#EA580C)
   - If future date: gray Calendar icon + "15 мая" (#6B7280)
   - If none: "—" gray

Bulk action bar (appears at bottom when 1+ rows selected, slides up, 
sticky bottom of list, 56px tall, bg white, border-top #E5E7EB, 
shadow 0 -4px 12px rgba(0,0,0,0.06)):
- Left: "Выбрано: 12" (Nunito 13px/600)
- Right: buttons (8px gap):
  · "Создать рассылку" (Send icon, primary orange)
  · "Изменить статус" (ghost)
  · "Экспорт" (Download icon, ghost)
  · "✕" close icon

Footer of list (40px, below rows): pagination "Показано 1–50 из 2 347" 
+ Previous/Next chevrons.

═══════════════════════════════════════════════════════
RIGHT PANEL — Worker detail (when row selected)
═══════════════════════════════════════════════════════

Empty state (when nothing selected): centered Users icon (48px, 
#E5E7EB) + "Выберите исполнителя из списка" (Nunito 14px/500 #6B7280) 
+ subtitle "Слева — карточка с полной информацией" (12px #9CA3AF).

When selected — HERO BLOCK (top, 180px tall, padding 24px):
- Top row: Avatar 64px circle (photo or initials) + name block + 
  action buttons right
- Name block:
  - "Иванов Иван Иванович" (Montserrat 20px/600 #111827)
  - Below: phone, ID, "Куратор: Алёна П." separated by · (Nunito 
    13px/400 #6B7280)
- Action buttons (right side, 8px gap): "Позвонить" (Phone icon, 
  primary orange), "Чат" (MessageSquare icon, ghost), more menu 
  "⋯" (MoreHorizontal, ghost)
- Below name block: rating block (compact card, 100px tall, bg 
  #FAFAFA, 8px radius, 16px padding):
  - Left: huge number "0.87" (SF Mono 32px/700, colored by tier)
  - Right: 3 stacked mini-metrics (Nunito 11px/500 #6B7280 label 
    above, SF Mono 13px/600 #111827 value):
    · "ShowUp 10 — 100%"
    · "ShowUp all — 94%"  
    · "Quality — +0.2σ"
  - Tooltip on hover over number: "Формула: 0.7×ShowUp10 + 0.2×
    ShowUpAll + 0.1×QualityZ"

TABS BAR (below hero, 44px tall, border-bottom #E5E7EB):
Tabs (Nunito 13px/600, 12px/16px padding, active = #111827 text + 
2px bottom border #FF9900, inactive = #6B7280 text):
1. Обзор (default active)
2. Смены
3. Документы
4. Мнения
5. Финансы
6. История
7. Контакты

TAB CONTENT — "Обзор" (default visible, padding 24px):

Card 1 — "Ключевые факты" (bg white, 1px border #E5E7EB, 8px radius, 
16px padding):
- Header: title "Ключевые факты" (Montserrat 14px/600) + edit pencil 
  icon right (ghost)
- 2-column grid (label-value pairs, Nunito 12px/500 #6B7280 label, 
  Nunito 13px/600 #111827 value, 8px row gap):
  · Пол: Мужской
  · Возраст: 32 года
  · Гражданство: РФ
  · НПД: Активен (with green dot)
  · Авто: Есть
  · Ночные смены: Да
  · Координатор: Может быть
  · Источник: Telegram

Card 2 — "Последние смены" (same card style):
- Header: "Последние смены" + "Все →" link right
- List of 5 mini-rows (48px tall each, no border between, just 8px gap):
  Each row: date pill (40x40 square, bg #F3F4F6, 6px radius, day 
  number SF Mono 14px/700 top + month 10px below) + object name + 
  client + status icon (CheckCircle2 green if attended, XCircle red 
  if no-show, Clock orange if upcoming)

Card 3 — "Мнения" (same card style):
- Header: "Мнения" + count "12" + "Все →" link right  
- 3 latest opinion rows: source icon (User/UserCog/Crown by source 
  type) + text snippet (Nunito 13px/400, 2-line clamp) + thumbs 
  icon (ThumbsUp green / Minus gray / ThumbsDown red) right

Card 4 — "Финансы" (same card style):
- Header: "Финансы" + "Все →" link right
- 3 mini-rows of recent payments: date + object + amount (SF Mono 
  14px/600, right-aligned) + status pill (small, "Выплачено" green 
  / "К выплате" orange)
- Bottom summary: "К выплате: 12 400 ₽" (Nunito 13px/600 orange #EA580C)

═══════════════════════════════════════════════════════
DEMO DATA
═══════════════════════════════════════════════════════

Generate 15-20 worker rows with realistic Russian names, varied 
ratings (0.45 to 0.95), mix of statuses, some with availability 
today, some scheduled, some none. Mix of avatars: some photos 
(use placeholder /placeholder.svg or initials with rotating colors).

Selected by default: first row (so right panel is populated).

═══════════════════════════════════════════════════════
INTERACTIONS (visual states, no real logic needed)
═══════════════════════════════════════════════════════

- Row hover: bg #F9FAFB
- Row selected: bg #FFF7ED, left 3px orange accent border
- Filter chip click: shows dropdown popover with checkboxes
- Tab click: switches active state
- Empty right panel state when no selection
- Bulk action bar appears when checkboxes selected

DO NOT use emojis anywhere. ONLY lucide-react icons.
DO NOT use shadows beyond subtle elevation.
DO NOT center-align numbers — always right-align for tabular data.
# CaseRussell - E-Commerce платформа за персонализирани телефонни калъфи

## Съдържание

1. [Общ преглед](#общ-преглед)
2. [Технически стек](#технически-стек)
3. [Архитектура на системата](#архитектура-на-системата)
4. [Функционалности](#функционалности)
5. [Структура на проекта](#структура-на-проекта)
6. [База данни](#база-данни)
7. [API Endpoints](#api-endpoints)
8. [Инсталация и настройка](#инсталация-и-настройка)
9. [Разработка](#разработка)
10. [Деплой](#деплой)
11. [Тестване](#тестване)
12. [Заключение](#заключение)

---

## Общ преглед

**CaseRussell** е модерна e-commerce платформа, специализирана в продажбата на персонализирани телефонни калъфи. Платформата позволява на клиентите да качват собствени изображения, да конфигурират различни параметри на калъфа (материал, цвят, завършек) и да направят поръчка чрез интегрирана платежна система.

### Основни характеристики:

- 🎨 **Персонализиране в реално време** - Drag & drop интерфейс за качване на изображения
- 🛒 **Пълна e-commerce функционалност** - Кошница, поръчки, плащания
- 🔐 **Сигурна аутентификация** - Интеграция с Kinde Auth
- 💳 **Платежна система** - Stripe интеграция
- 📱 **Responsive дизайн** - Оптимизиран за всички устройства
- ⚡ **Високо производителност** - Next.js 14 с App Router

---

## Технически стек

### Frontend

- **Next.js 14** - React framework с App Router
- **TypeScript** - Статично типизиране
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Анимации и преходи
- **Radix UI** - Accessible UI компоненти
- **React Query** - Server state management

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Релационна база данни
- **UploadThing** - File upload service

### Външни услуги

- **Kinde Auth** - Аутентификация и авторизация
- **Stripe** - Платежна система
- **Resend** - Транзакционни имейли
- **Sharp** - Image processing

### Инструменти за разработка

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package manager

---

## Архитектура на системата

### Обща архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React         │    │ • Prisma ORM    │    │ • Kinde Auth    │
│ • TypeScript    │    │ • PostgreSQL    │    │ • Stripe        │
│ • Tailwind CSS  │    │ • File Upload   │    │ • UploadThing   │
│ • Framer Motion │    │ • Email Service │    │ • Resend        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Поток на данните

1. **Потребителска аутентификация** → Kinde Auth
2. **Качване на изображения** → UploadThing → Database
3. **Конфигурация на калъф** → Local state → Database
4. **Създаване на поръчка** → Stripe → Database
5. **Изпращане на имейл** → Resend

---

## Функционалности

### 1. Потребителски интерфейс

- **Начална страница** с hero секция и анимации
- **Галерия с примери** на готови калъфи
- **Конфигуратор** за персонализиране
- **Кошница и checkout** процес
- **Dashboard** за управление на поръчки

### 2. Аутентификация и авторизация

- Регистрация и вход чрез Kinde Auth
- Защитени маршрути
- Управление на потребителски сесии

### 3. Персонализиране на калъфи

- Качване на изображения (drag & drop)
- Избор на телефонен модел
- Избор на материал (силикон/поликарбонат)
- Избор на цвят (черен/син/розов)
- Избор на завършек (гладък/текстуриран)
- Preview в реално време

### 4. E-commerce функционалност

- Добавяне в кошница
- Изчисляване на цени
- Checkout процес
- Управление на адреси за доставка
- Статус на поръчки

### 5. Платежна система

- Stripe интеграция
- Безопасни плащания
- Webhook обработка
- Поддръжка на различни валути

### 6. Административен панел

- Управление на поръчки
- Статистики и анализи
- Потребителско управление

---

## Структура на проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Аутентификация endpoints
│   │   ├── uploadthing/   # File upload
│   │   └── webhooks/      # Stripe webhooks
│   ├── configure/         # Конфигуратор страници
│   │   ├── design/        # Дизайн конфигуратор
│   │   ├── preview/       # Preview страница
│   │   └── upload/        # Upload страница
│   ├── dashboard/         # Потребителски dashboard
│   ├── auth-callback/     # Auth callback
│   └── thank-you/         # Благодарствена страница
├── components/            # React компоненти
│   ├── ui/               # Базови UI компоненти
│   ├── emails/           # Email шаблони
│   └── ...               # Други компоненти
├── config/               # Конфигурационни файлове
├── db/                   # Database utilities
├── lib/                  # Utility функции
├── validators/           # Zod валидатори
└── middleware.ts         # Next.js middleware
```

---

## База данни

### Схема на базата данни (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String
  Order     Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Configuration {
  id              String        @id @default(cuid())
  width           Int
  height          Int
  imageUrl        String
  color           CaseColor?
  model           PhoneModel?
  material        CaseMaterial?
  finish          CaseFinish?
  croppedImageUrl String?
  Order           Order[]
}

model Order {
  id              String        @id @default(cuid())
  configurationId String
  configuration   Configuration @relation(fields: [configurationId], references: [id])
  user            User          @relation(fields: [userId], references: [id])
  userId          String
  amount          Float
  isPaid          Boolean       @default(false)
  status          OrderStatus   @default(awaiting_shipment)
  shippingAddress   ShippingAddress?
  billingAddress    BillingAddress?
  createdAt       DateTime      @default(now())
  updated         DateTime      @updatedAt
}

model ShippingAddress {
  id          String  @id @default(cuid())
  name        String
  street      String
  city        String
  postalCode  String
  country     String
  state       String?
  phoneNumber String?
  orders      Order[]
}

model BillingAddress {
  id          String  @id @default(cuid())
  name        String
  street      String
  city        String
  postalCode  String
  country     String
  state       String?
  phoneNumber String?
  orders      Order[]
}
```

### Enums

- **OrderStatus**: fulfilled, shipped, awaiting_shipment
- **PhoneModel**: iphonex, iphone11, iphone12, iphone13, iphone14, iphone15
- **CaseMaterial**: silicone, polycarbonate
- **CaseFinish**: smooth, textured
- **CaseColor**: black, blue, rose

---

## API Endpoints

### Аутентификация

- `GET /api/auth/[kindeAuth]` - Kinde Auth callback
- `GET /api/auth/check-session` - Проверка на сесия
- `GET /api/auth/health` - Health check

### File Upload

- `POST /api/uploadthing` - Качване на файлове
- `GET /api/uploadthing/core` - UploadThing конфигурация

### Webhooks

- `POST /api/webhooks` - Stripe webhook обработка

### Debug

- `GET /api/debug-auth` - Debug информация за аутентификация

---

## Инсталация и настройка

### Предварителни изисквания

- Node.js 18+
- pnpm package manager
- PostgreSQL база данни
- Kinde Auth акаунт
- Stripe акаунт
- UploadThing акаунт
- Resend акаунт

### Стъпки за инсталация

1. **Клониране на репозиторията**

```bash
git clone https://github.com/dynamix12/phone-case-46363.git
cd phone-case-46363
```

2. **Инсталиране на зависимости**

```bash
pnpm install
```

3. **Настройка на environment променливи**

```bash
cp env-template.txt .env
```

4. **Попълване на .env файла**

```env
# Kinde Auth
KINDE_CLIENT_ID='your_kinde_client_id'
KINDE_CLIENT_SECRET='your_kinde_client_secret'
KINDE_ISSUER_URL='https://your-domain.kinde.com'
KINDE_SITE_URL='http://localhost:3000'
KINDE_AUDIENCE='your_kinde_audience'
KINDE_POST_LOGOUT_REDIRECT_URL='http://localhost:3000'
KINDE_POST_LOGIN_REDIRECT_URL='http://localhost:3000/auth-callback'

# Database
DATABASE_URL='postgresql://username:password@localhost:5432/caserussell'

# UploadThing
UPLOADTHING_SECRET='your_uploadthing_secret'
UPLOADTHING_APP_ID='your_uploadthing_app_id'

# Stripe
STRIPE_SECRET_KEY='sk_test_...'
STRIPE_WEBHOOK_SECRET='whsec_...'

# Resend
RESEND_API_KEY='re_...'
```

5. **Настройка на базата данни**

```bash
npx prisma generate
npx prisma db push
```

6. **Стартиране на development сървъра**

```bash
pnpm dev
```

---

## Разработка

### Development workflow

1. **Feature branch създаване**

```bash
git checkout -b feature/new-feature
```

2. **Код промени и тестване**

```bash
pnpm dev
pnpm lint
```

3. **Database миграции**

```bash
npx prisma db push
# или за production
npx prisma migrate dev
```

4. **Commit и push**

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Code style и стандарти

- **TypeScript** за всички файлове
- **ESLint** за code quality
- **Prettier** за форматиране
- **Conventional commits** за commit съобщения

### Компонентна архитектура

- **Atomic Design** принципи
- **Reusable components** в `/components/ui/`
- **Business logic** в `/lib/`
- **Type definitions** в `/types/`

---

## Деплой

### Production build

```bash
pnpm build
pnpm start
```

### Environment променливи за production

- Всички development променливи
- `NODE_ENV=production`
- Production URLs за всички услуги
- SSL сертификати

### Database миграции в production

```bash
npx prisma migrate deploy
```

---

## Тестване

### Unit тестове

```bash
pnpm test
```

### Integration тестове

```bash
pnpm test:integration
```

### E2E тестове

```bash
pnpm test:e2e
```

### Manual тестване

1. **Аутентификация** - Регистрация, вход, изход
2. **File upload** - Качване на различни формати
3. **Конфигуратор** - Всички опции за персонализиране
4. **Checkout** - Пълен процес на поръчка
5. **Плащания** - Stripe интеграция
6. **Responsive** - Различни устройства

---

## Заключение

**CaseRussell** представлява модерна, мащабируема e-commerce платформа, изградена с най-добрите практики в web разработката. Използването на Next.js 14, TypeScript, и Prisma ORM осигурява високо качество на кода и лекота на поддръжка.

### Ключови предимства:

- **Модерен технологичен стек** - Next.js 14, TypeScript, Tailwind CSS
- **Отлична производителност** - Server-side rendering, оптимизирани изображения
- **Сигурност** - Kinde Auth, Stripe, валидация на данни
- **Масштабируемост** - Модулна архитектура, cloud-ready
- **UX/UI** - Responsive дизайн, анимации, интуитивен интерфейс

### Възможности за развитие:

- **Мобилно приложение** - React Native или Flutter
- **AI персонализиране** - Машинно обучение за препоръки
- **Интернационализация** - Поддръжка на множество езици
- **Analytics** - Детайлни анализи за продажби
- **API за партньори** - Външни интеграции

Проектът демонстрира професионален подход към fullstack разработката и може да служи като основа за реални бизнес приложения в e-commerce сектора.

---

_Документацията е създадена за дипломна работа и включва всички технически аспекти на проекта CaseRussell._

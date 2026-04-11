# Gatherly

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <p>A full-stack event management and ticketing platform</p>
  <p><strong>Live:</strong> <a href="https://gatherly.r2k.dev">gatherly.r2k.dev</a></p>
</div>

---

## Table of Contents

- [Gatherly](#gatherly)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Architecture Overview](#architecture-overview)
  - [Data Models](#data-models)
    - [User](#user)
    - [Event](#event)
    - [Booking](#booking)
  - [Authentication \& Middleware](#authentication--middleware)
    - [NextAuth (Credentials Provider)](#nextauth-credentials-provider)
    - [Email Verification Flow](#email-verification-flow)
    - [Middleware — Route Protection](#middleware--route-protection)
  - [API Routes](#api-routes)
    - [Auth](#auth)
    - [Events](#events)
    - [Bookings](#bookings)
    - [Users](#users)
  - [Validation Layer](#validation-layer)
  - [File Uploads](#file-uploads)
  - [Email System](#email-system)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Development Status](#development-status)
  - [License](#license)

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.3.3 |
| Language | TypeScript | ^5 |
| UI Library | React | ^19.0.0 |
| Styling | Tailwind CSS | ^4 |
| UI Primitives | Radix UI + shadcn/ui | Latest |
| Database | MongoDB (Atlas) | — |
| ODM | Mongoose | ^8.15.2 |
| Auth | NextAuth.js | ^4.24.11 |
| Validation | Zod + React Hook Form | ^3.25 / ^7.62 |
| Password Hashing | bcryptjs | ^3.0.2 |
| File Storage | Supabase Storage | ^2.55.0 |
| Email | Resend + React Email | ^4.6.0 |
| HTTP Client | Axios | ^1.11.0 |
| Build Tool | Turbopack (via `next dev --turbopack`) | — |

---

## Architecture Overview

Gatherly is a monolithic Next.js 15 App Router application. There is no separate backend server — API logic lives as [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) under `src/app/api/`. The frontend and backend share a single process, types, and utility modules.

```
Browser → Next.js App Router
                ├── Server Components   (data fetching, SEO)
                ├── Client Components   (interactivity, forms)
                └── Route Handlers      (API endpoints, DB access)
                          └── MongoDB (via Mongoose ODM)
```

**Key design decisions:**
- **App Router only** — no Pages Router. Layouts, loading states, and error boundaries are handled natively.
- **Turbopack** is used for local development (`next dev --turbopack`) for significantly faster HMR.
- **Route groups** separate authenticated app routes `(app)/` from public auth routes `(auth)/`.
- **Middleware** enforces authentication and role-based access at the edge before a request reaches any route handler.
- **Singleton DB connection** — `dbConnect.ts` uses a module-level `connection` object to prevent multiple Mongoose connections during hot reload in development.

---

## Data Models

All models are defined with Mongoose and typed via TypeScript interfaces extending `mongoose.Document`.

### User

```ts
interface User extends Document {
  name: string;
  email: string;           // unique, lowercase
  username: string;        // unique, trimmed
  isOrganizer: boolean;    // role flag — drives access control
  avatar: string;          // Supabase Storage URL
  password: string;        // bcryptjs hashed
  verifyCode: string;      // OTP for email verification
  verifyCodeExpiry: Date;  // OTP TTL
  isVerified: boolean;
  createdAt?: Date;
}
```

### Event

```ts
interface Event extends Document {
  organizer: Types.ObjectId;  // ref → User
  name: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  image: string;              // Supabase Storage URL
  dateCreated: Date;
  dateStarted: Date;
  dateEnded: Date;
  status: EventStatus;        // enum: EVENT_STATUSES constant
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[];
}
```

> `EventStatus` and `EVENT_STATUSES` are defined in `src/constants/eventConstants.ts` and used in both the Mongoose schema enum and frontend rendering logic.

### Booking

Defined in `src/model/Booking.model.ts` — references both `User` and `Event` via `ObjectId` refs.

---

## Authentication & Middleware

### NextAuth (Credentials Provider)

Authentication uses **NextAuth.js v4** with a custom credentials provider. JWT sessions are used (no database adapter). Session data is extended to include `isOrganizer` and `username` via TypeScript declaration merging in `src/types/next-auth.d.ts`.

### Email Verification Flow

1. On sign-up, a random 6-digit `verifyCode` and `verifyCodeExpiry` are generated and stored on the User document.
2. A verification email is sent via **Resend** using a **React Email** template (`emails/` directory).
3. The user submits the OTP at `/verify-code`, which hits `POST /api/verify-code` to validate the code against `verifyCodeExpiry`.
4. On success, `isVerified` is set to `true`.

### Middleware — Route Protection

`src/middleware.ts` uses NextAuth's `getToken()` to read the JWT from the incoming request and applies three layers of protection:

```
Request
  │
  ├── /api/auth/* → Always allowed (NextAuth internals)
  │
  ├── /sign-in, /sign-up, /verify → Redirect to /dashboard if already authenticated
  │
  ├── Protected routes (/dashboard, /events, /booking-page, etc.)
  │       └── No token → Redirect to /sign-in
  │
  └── Organizer routes (/create-event)
          ├── No token → Redirect to /sign-in
          └── token.isOrganizer === false → Redirect to /dashboard
```

The `config.matcher` array explicitly lists all paths the middleware runs on to avoid unnecessary edge function executions.

---

## API Routes

All routes are defined under `src/app/api/` as Next.js Route Handlers.

### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/sign-up` | Register user, hash password, send OTP email |
| `POST` | `/api/verify-code` | Validate OTP, mark user as verified |
| `GET` | `/api/check-username-unique` | Query DB for username uniqueness (debounced on frontend) |

### Events

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/get-events` | Paginated list of all events |
| `GET` | `/api/events/[id]` | Single event by MongoDB `_id` |
| `POST` | `/api/create-event` | Create event (organizer only, validated via session) |

### Bookings

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/book-ticket/[id]` | Book tickets for an event |

### Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/get-user` | Fetch authenticated user's data |
| `GET` | `/api/get-my-events` | Fetch events/bookings associated with the session user |
| `POST` | `/api/update-user` | Update user profile fields |

---

## Validation Layer

Validation is done **at two levels**:

1. **Client-side** — React Hook Form + Zod resolvers (`@hookform/resolvers/zod`) on every form. Errors are shown inline before any network request is made.

2. **Server-side** — Zod schemas are re-evaluated inside Route Handlers to prevent bypassed client validation.

Schemas live in `src/schemas/`:

| File | Validates |
|---|---|
| `signupValidationSchema.ts` | Registration form fields |
| `loginValidationSchema.ts` | Login credentials |
| `verifyValidationSchema.ts` | OTP code format |
| `eventValidationSchema.ts` | Full event creation payload |
| `bookingValidationSchema.ts` | Ticket booking request |
| `updateUserValidationSchema.ts` | Profile update fields |

---

## File Uploads

Event banner images are uploaded directly to **Supabase Storage** (not stored in MongoDB).

- The upload is handled client-side via a custom `useFileUpload` hook (`src/hooks/use-file-upload.ts`) and a `FileUploader` component.
- `src/lib/upload.ts` wraps the Supabase JS client for bucket operations.
- The resulting public URL is stored as a string (`image` field) on the `Event` document.
- Supabase is initialized in `src/lib/supabase.ts` using both the anon key (client-side) and service role key (server-side operations).

---

## Email System

Transactional emails are sent via **Resend** using **React Email** components:

```
src/
└── emails/                         # React Email templates
src/helpers/sendVerificationEmail.ts # Resend API wrapper
src/lib/resend.ts                   # Resend client initialization
```

The OTP verification email is a React component rendered to HTML server-side by Resend's SDK before dispatch. This keeps email templates type-safe and version-controlled.

---

## Project Structure

```
gatherly/
├── emails/                        # React Email templates
├── public/                        # Static assets
└── src/
    ├── app/
    │   ├── (app)/                 # Protected routes (require auth)
    │   │   ├── about/
    │   │   ├── booking-page/
    │   │   ├── create-event/      # Organizer-only
    │   │   ├── dashboard/
    │   │   ├── events/[id]/
    │   │   ├── my-events/
    │   │   ├── profile-page/
    │   │   └── update-user/
    │   ├── (auth)/                # Public auth routes
    │   │   ├── sign-in/
    │   │   ├── sign-up/
    │   │   └── verify-code/
    │   ├── api/                   # Route Handlers (backend logic)
    │   │   ├── auth/
    │   │   ├── book-ticket/[id]/
    │   │   ├── check-username-unique/
    │   │   ├── create-event/
    │   │   ├── events/[id]/
    │   │   ├── get-events/
    │   │   ├── get-my-events/
    │   │   ├── get-user/
    │   │   ├── update-user/
    │   │   └── verify-code/
    │   ├── globals.css
    │   ├── layout.tsx             # Root layout with SessionProvider
    │   └── page.tsx               # Public homepage
    ├── components/
    │   ├── providers/             # SessionProvider wrapper
    │   └── ui/                    # shadcn/ui + custom components
    ├── constants/
    │   └── eventConstants.ts      # EventStatus enum & array
    ├── helpers/
    │   └── sendVerificationEmail.ts
    ├── hooks/
    │   └── use-file-upload.ts
    ├── lib/
    │   ├── dbConnect.ts           # Mongoose singleton connection
    │   ├── resend.ts
    │   ├── supabase.ts
    │   ├── upload.ts
    │   └── utils.ts               # cn() helper (clsx + tailwind-merge)
    ├── model/
    │   ├── Booking.model.ts
    │   ├── Event.model.ts
    │   └── User.model.ts
    ├── schemas/                   # Zod validation schemas
    ├── types/
    │   └── next-auth.d.ts         # Session type augmentation
    └── middleware.ts              # Edge auth + RBAC
```

---

## Environment Variables

Create a `.env.local` in the project root:

```env
# MongoDB
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>

# NextAuth
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=http://localhost:3000
SECRET=<same-or-different-jwt-secret>   # used in middleware getToken()

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Resend
RESEND_API_KEY=re_<key>

# Stripe (not yet implemented)
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

> **Note:** `NEXT_PUBLIC_` prefixed variables are exposed to the browser bundle. Never prefix secrets (service role key, Resend key, Stripe secret) with `NEXT_PUBLIC_`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Supabase project with a storage bucket
- Resend account with a verified sending domain

### Installation

```bash
git clone https://github.com/riteshkrkarn/gatherly.git
cd gatherly
npm install
```

Copy the environment variable template above into `.env.local` and fill in your values.

```bash
npm run dev        # Turbopack dev server → http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

---

## Development Status

| Area | Status |
|---|---|
| Auth (register, login, OTP verify) | ✅ Complete |
| Role-based middleware (attendee / organizer) | ✅ Complete |
| Event creation with image upload | ✅ Complete |
| Ticket booking with availability tracking | ✅ Complete |
| User profile management | ✅ Complete |
| Payment integration (Stripe) | 🔧 In Progress |
| Event reviews & ratings | 🔧 In Progress |
| Ticket cancellation & refunds | 🔧 In Progress |

---

## License

MIT — see [LICENSE](LICENSE).

---

<p align="center">
  <a href="https://x.com/riteshkrkarn">X</a> ·
  <a href="https://linkedin.com/in/riteshkrkarn">LinkedIn</a> ·
  <a href="https://gatherly.r2k.dev">Live Demo</a>
</p>

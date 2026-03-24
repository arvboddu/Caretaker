# CareTaker System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Web Application                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │  React   │  │  Vite    │  │ Tailwind │  │  Zustand │            │    │
│  │  │   SPA    │  │  Bundler │  │   CSS    │  │  State   │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  │                                                                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │React Router│ │ TanStack │  │ Socket.IO│  │  Axios   │            │    │
│  │  │  (Routes) │  │  Query   │  │  Client  │  │ (HTTP)   │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Mobile Application (Future)                     │    │
│  │              React Native + Expo (sharing backend logic)             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTPS / WebSocket
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Node.js + Express Server                        │    │
│  │                                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │    Routes    │  │ Controllers  │  │  Middleware │              │    │
│  │  │  /api/auth   │  │   AuthCtrl   │  │   CORS       │              │    │
│  │  │  /api/users  │  │   UserCtrl   │  │   Helmet     │              │    │
│  │  │  /api/bookings│ │  BookingCtrl │  │   Rate Limit │              │    │
│  │  │  /api/chat   │  │   ChatCtrl   │  │   Validate   │              │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │    │
│  │                                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │   Services   │  │     DB       │  │   Utils     │              │    │
│  │  │  AuthService │  │   Supabase   │  │   JWT       │              │    │
│  │  │ BookingSvc   │  │   Client     │  │   Bcrypt    │              │    │
│  │  │  ChatService │  │             │  │   Errors    │              │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Socket.IO Server                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │   Events     │  │    Rooms     │  │   Presence   │              │    │
│  │  │  connection  │  │  chat:{id}   │  │   Tracking   │              │    │
│  │  │  join_room   │  │  user:{uid}   │  │   Online     │              │    │
│  │  │  send_msg    │  │  booking:{id} │  │   Offline    │              │    │
│  │  │  typing      │  │              │  │              │              │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ REST API / WebSocket
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Supabase                                     │    │
│  │                                                                      │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │    │
│  │  │   PostgreSQL   │  │     Auth       │  │   Storage      │        │    │
│  │  │   Database     │  │   (Email/OAuth)│  │   (Files)      │        │    │
│  │  │                │  │                │  │                │        │    │
│  │  │  - patients    │  │  - Sign up     │  │  - avatars     │        │    │
│  │  │  - caretakers  │  │  - Login       │  │  - documents   │        │    │
│  │  │  - bookings    │  │  - JWT tokens  │  │  - images     │        │    │
│  │  │  - messages    │  │  - Sessions    │  │                │        │    │
│  │  │  - reviews     │  │                │  │                │        │    │
│  │  │  - skills      │  │                │  │                │        │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │    │
│  │                                                                      │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │    │
│  │  │   Real-time    │  │      RLS       │  │   Functions    │        │    │
│  │  │   Subscriptions│  │  (Row Level    │  │  (Edge/Firebase│        │    │
│  │  │                │  │   Security)    │  │   Functions)   │        │    │
│  │  │  - messages    │  │                │  │                │        │    │
│  │  │  - bookings    │  │  - user_id    │  │  - notifications│       │    │
│  │  │  - presence    │  │  - role check │  │  - webhooks    │        │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Architecture

### Frontend Architecture

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   └── icons/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (Button, Input, Card)
│   │   ├── layout/           # Layout components (Header, Footer, Sidebar)
│   │   └── features/        # Feature-specific components
│   │       ├── auth/
│   │       ├── booking/
│   │       ├── chat/
│   │       └── reviews/
│   ├── pages/               # Route pages
│   │   ├── public/          # Public routes (Landing, Login, Signup)
│   │   ├── patient/          # Patient-specific pages
│   │   ├── caretaker/        # Caretaker-specific pages
│   │   └── admin/            # Admin pages
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts (Auth, Theme)
│   ├── services/            # API service modules
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   └── socket.service.ts
│   ├── stores/              # Zustand stores
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   ├── utils/               # Utility functions
│   │   ├── validation.ts    # Zod schemas
│   │   └── helpers.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

### Backend Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── index.ts         # Environment config
│   │   ├── database.ts      # Supabase config
│   │   └── socket.ts        # Socket.IO config
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── patient.routes.ts
│   │   ├── caretaker.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── chat.routes.ts
│   │   └── review.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── patient.controller.ts
│   │   ├── caretaker.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── chat.controller.ts
│   │   └── review.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── patient.service.ts
│   │   ├── caretaker.service.ts
│   │   ├── booking.service.ts
│   │   ├── chat.service.ts
│   │   └── review.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── db/
│   │   └── supabase.ts      # Supabase client
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   └── socket/
│       ├── index.ts
│       ├── chat.handler.ts
│       └── presence.handler.ts
├── package.json
└── .env
```

---

## Data Flow Diagrams

### Authentication Flow
```
┌────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Client │───▶│ Express Auth │───▶│ Supabase Auth│───▶│ PostgreSQL   │
│        │    │   Endpoint   │    │   Service    │    │   users      │
└────────┘    └──────────────┘    └──────────────┘    └──────────────┘
     │                                    │
     │         JWT Token                  │
     ◀────────────────────────────────────┘
```

### Booking Flow
```
┌────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Client │───▶│ Booking API  │───▶│ Booking Svc  │───▶│ PostgreSQL   │
│        │    │              │    │              │    │  bookings    │
└────────┘    └──────────────┘    └──────────────┘    └──────────────┘
     │                                    │
     │         Socket.IO                  │
     │         Notification               │
     ◀────────────────────────────────────┘
```

### Real-time Chat Flow
```
┌────────┐◀══▶┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Client │    │ Socket.IO    │───▶│ Chat Handler │───▶│ PostgreSQL   │
│        │    │   Server     │    │              │    │  messages    │
└────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                      │
                      │ Broadcast to room
                      ▼
               ┌──────────────┐
               │ Other Client │
               └──────────────┘
```

---

## Security Architecture

### Authentication Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
│                                                              │
│  ┌─────────┐         ┌─────────────┐        ┌───────────┐  │
│  │  Login  │────────▶│   Express   │───────▶│ Supabase  │  │
│  │ Request │         │  Middleware │        │    Auth   │  │
│  └─────────┘         └─────────────┘        └─────┬─────┘  │
│                                                      │       │
│  ┌─────────┐         ┌─────────────┐        ┌─────▼─────┐  │
│  │  Store  │◀────────│  Set JWT in  │◀───────│  Return   │  │
│  │   JWT   │         │    Cookie    │        │    JWT    │  │
│  └─────────┘         └─────────────┘        └───────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Request Validation
```
┌─────────────────────────────────────────────────────────────┐
│                  REQUEST VALIDATION FLOW                     │
│                                                              │
│  Request ──▶ Zod Schema ──▶ Controller ──▶ Response        │
│     │           │             │                             │
│     ▼           ▼             ▼                             │
│  Sanitize   Validate     Business                           │
│  Headers    Body/Params   Logic                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Row Level Security (RLS)
```sql
-- Example: Patients can only see their own data
CREATE POLICY "Patients see own profile" ON patients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Caretakers can see bookings assigned to them
CREATE POLICY "Caretakers see assigned bookings" ON bookings
  FOR SELECT
  USING (caretaker_id = auth.uid());
```

---

## Deployment Architecture

### Development
```
┌────────────────────────────────────────┐
│           Development Setup             │
│                                         │
│  ┌────────────┐     ┌────────────┐     │
│  │  Vite Dev  │     │   Node     │     │
│  │   Server   │     │   Server   │     │
│  │  localhost │     │  localhost │     │
│  │   :5173    │     │   :3000    │     │
│  └────────────┘     └─────┬──────┘     │
│                            │            │
│                            ▼            │
│                     ┌────────────┐      │
│                     │  Supabase  │      │
│                     │   (Cloud)  │      │
│                     └────────────┘      │
└────────────────────────────────────────┘
```

### Production
```
┌────────────────────────────────────────────────────────────────────┐
│                        Production Setup                             │
│                                                                     │
│  ┌──────────┐                                    ┌──────────────┐  │
│  │  Vercel  │                                    │   Render     │  │
│  │  (CDN)   │                                    │  (Node API)  │  │
│  │          │                                    │              │  │
│  │ caretake │                                    │ api.caretaker│  │
│  │   r.app  │                                    │    .com      │  │
│  └────┬─────┘                                    └──────┬───────┘  │
│       │                                                │          │
│       │              ┌──────────────┐                  │          │
│       └─────────────▶│  Supabase    │◀─────────────────┘          │
│                      │   (Cloud)    │                             │
│                      │              │                             │
│                      │  PostgreSQL  │                             │
│                      │     Auth     │                             │
│                      │   Storage   │                             │
│                      │ Real-time   │                             │
│                      └──────────────┘                             │
└────────────────────────────────────────────────────────────────────┘
```

---

## Environment Configuration

### Development (.env)
```env
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# JWT
JWT_SECRET=your-jwt-secret-dev
JWT_EXPIRES_IN=7d

# Client
CLIENT_URL=http://localhost:5173
```

### Production (.env)
```env
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=24h

# Client
CLIENT_URL=https://caretaker.app
```

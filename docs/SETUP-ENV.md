# CareTaker App - Environment Configuration

## Step 1: Get Supabase Credentials

1. Go to https://supabase.com → Sign in
2. Select your project → Settings → API
3. Copy these three values:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`
   - **service_role secret**: `eyJhbGciOiJIUzI1NiIs...`

---

## Step 2: Create Backend Environment

Create file `backend/.env`:

```env
NODE_ENV=development
PORT=3000

# ← PASTE YOUR SUPABASE URL HERE
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# ← PASTE YOUR SUPABASE ANON KEY HERE  
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ← PASTE YOUR SUPABASE SERVICE KEY HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration
JWT_SECRET=caretaker-jwt-secret-change-in-production-2024
JWT_EXPIRES_IN=24h

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Step 3: Create Frontend Environment

Create file `frontend/.env`:

```env
# ← PASTE YOUR SUPABASE URL HERE
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# ← PASTE YOUR SUPABASE ANON KEY HERE
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

---

## Step 4: Create Mobile Environment

Create file `mobile/.env`:

```env
# ← PASTE YOUR SUPABASE URL HERE
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# ← PASTE YOUR SUPABASE ANON KEY HERE
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Quick Reference

| Variable | Where to Find | Example |
|----------|--------------|---------|
| `SUPABASE_URL` | Settings → API → Project URL | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY` | Settings → API → anon public | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role secret | `eyJhbGci...` |

---

## Your Base URLs

| Service | Development URL | Production URL |
|---------|----------------|---------------|
| **Backend API** | `http://localhost:3000/api` | `https://api.caretaker.com/api` |
| **Frontend** | `http://localhost:5173` | `https://caretaker.com` |
| **Supabase** | `https://YOUR-PROJECT.supabase.co` | (Same) |
| **Mobile** | `http://localhost:8081` | Expo Go (via QR) |

---

## Validate Setup

After creating `.env` files:

```bash
# From root folder
node scripts/setup.js
```

This will:
- Check Supabase connection
- Test API endpoints
- Verify environment variables

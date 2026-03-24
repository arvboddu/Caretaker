# CareTaker App - Complete Setup & Validation

## STEP 1: Create Supabase Project

1. Go to: **https://supabase.com**
2. Click **"Sign up"** → Create account with GitHub or Email
3. Click **"New Project"**
4. Fill in:
   - **Name**: `caretaker-dev`
   - **Database Password**: (generate strong password, SAVE IT!)
   - **Region**: Select closest to you
5. Click **"Create new project"**
6. Wait ~2 minutes for setup

---

## STEP 2: Get Your Credentials

Once project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → Your **SUPABASE_URL**
   - `anon public` → Your **SUPABASE_ANON_KEY**
   - `service_role secret` → Your **SUPABASE_SERVICE_ROLE_KEY**

---

## STEP 3: Run Database Migration

1. In Supabase Dashboard → Click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy ALL contents from this file:
   ```
   backend/src/db/migrations/001_initial_schema.sql
   ```
4. Click **Run** (or Ctrl+Enter)
5. You should see: `Success` with checkmarks

---

## STEP 4: Configure Environment Files

Create `backend/.env`:
```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=caretaker-super-secret-jwt-key-2024
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:3000/api
```

---

## STEP 5: Validate Everything

Run the validation script:
```bash
cd backend
npm install
node config/validate.js
```

This will check:
- ✅ Supabase connection
- ✅ Database tables created
- ✅ API health endpoint
- ✅ Environment variables configured

---

## STEP 6: Start Development Servers

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```
✅ Should show: `CareTaker API running on port 3000`

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```
✅ Should show: `Local: http://localhost:5173`

### Terminal 3 - Mobile (optional):
```bash
cd mobile
npm install
npx expo start
```

---

## STEP 7: Test End-to-End

### Test Backend API:
```bash
curl http://localhost:3000/api/health
```
✅ Expected: `{"status":"ok","timestamp":"..."}`

### Test Registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User","role":"patient"}'
```

### Open in Browser:
- Frontend: http://localhost:5173
- You should see the CareTaker landing page
- Click "Get Started" → Register a new account
- ✅ If registration works, you're fully end-to-end!

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `CORS error` | Check `CLIENT_URL` in backend .env |
| `Cannot connect to Supabase` | Verify URL format: `https://xxx.supabase.co` |
| `Migration failed` | Drop existing tables first in SQL Editor |
| `Port already in use` | Kill process: `taskkill /PID <pid> /F` |

---

## Your Base URLs

| Environment | URL |
|------------|-----|
| **Development** | `http://localhost:3000/api` |
| **Frontend** | `http://localhost:5173` |
| **Supabase API** | `https://YOUR-PROJECT.supabase.co` |
| **Supabase Studio** | `https://app.supabase.com` (your dashboard) |

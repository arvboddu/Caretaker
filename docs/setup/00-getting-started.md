# CareTaker Development Setup Guide

## Prerequisites

### 1. Install Required Software

| Software | Download | Notes |
|----------|----------|-------|
| Node.js 18+ | [nodejs.org](https://nodejs.org) | Includes npm |
| Docker Desktop | [docker.com](https://docker.com) | Required for local Supabase |
| Git | [git-scm.com](https://git-scm.com) | Version control |
| Supabase CLI | [GitHub](https://github.com/supabase/supabase/releases) | Database tools |

### 2. Install Supabase CLI

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Windows (PowerShell):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket
scoop install supabase
```

**Linux:**
```bash
curl -fsSL https://github.com/supabase/supabase/releases/download/v1.0.0/supabase_linux_amd64.tar.gz -o /tmp/supabase.tar.gz
sudo tar -xzf /tmp/supabase.tar.gz -C /usr/local/bin
```

## Step-by-Step Setup

### Option A: Cloud Supabase (Recommended for Beginners)

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Name it "caretaker-dev"
4. Choose a region closest to you
5. Set a strong database password (save it!)
6. Wait for project to be created (~2 minutes)

#### 2. Get Your Credentials

From the Supabase Dashboard → **Settings** → **API**:
- `SUPABASE_URL`: Copy the "Project URL"
- `SUPABASE_ANON_KEY`: Copy the "anon public" key
- `SUPABASE_SERVICE_ROLE_KEY`: Copy the "service_role secret" key (keep this secret!)

#### 3. Run the Database Migration

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste all contents from:
   ```
   backend/src/db/migrations/001_initial_schema.sql
   ```
3. Click **Run**
4. You should see "Success" message

#### 4. Configure Environment

Create `backend/.env`:
```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=any-random-string-at-least-32-chars
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000/api
```

#### 5. Start Development

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

#### 6. Verify Setup

- Backend: http://localhost:3000/api/health
- Frontend: http://localhost:5173

---

### Option B: Local Supabase (Advanced)

#### 1. Initialize Supabase

```bash
cd backend
supabase init
```

#### 2. Start Local Services

```bash
supabase start
```

This starts:
- PostgreSQL on port 54322
- Supabase Studio on port 54323
- API on port 54321

#### 3. Get Local Credentials

```bash
supabase status
```

#### 4. Apply Migrations

```bash
supabase db push
```

#### 5. Configure Environment

```env
# backend/.env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

#### 6. Start Development

```bash
# Backend
npm run dev

# Frontend (new terminal)
cd ../frontend
npm run dev
```

---

## Quick Setup Script

Instead of manual setup, run the setup script:

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## Common Issues & Solutions

### "Port already in use"

```bash
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <process-id> /F

# Or use a different port
PORT=3001 npm run dev
```

### "Cannot connect to Supabase"

1. Check your `.env` file has correct credentials
2. Verify Supabase project is not paused (free tier sleeps after 7 days)
3. Check for typos in URL (should be `https://xxx.supabase.co`)

### "Migration failed"

1. Check if tables already exist
2. Drop existing tables first in SQL Editor:
   ```sql
   DROP TABLE IF EXISTS users, patients, caretakers, bookings, messages, reviews CASCADE;
   ```

### "npm install failed"

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and retry
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps After Setup

1. **Test Authentication**
   - Register a new user
   - Check Supabase Dashboard → Authentication to see the user

2. **Test Booking Flow**
   - Create a patient profile
   - Create a caretaker profile (via SQL or admin)
   - Attempt to create a booking

3. **Explore Supabase**
   - View tables in Table Editor
   - Check Authentication settings
   - Test Real-time in SQL Editor

---

## Useful Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

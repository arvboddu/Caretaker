# CareTaker Backend Deployment Guide

## Deploying Node.js Backend on Render (Free Tier)

### Prerequisites
- GitHub account
- Render account (free tier)
- Supabase project created

### Step 1: Prepare Your Repository

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/yourusername/caretaker-backend.git
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| Name | `caretaker-api` |
| Region | Choose closest to users |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | `Free` |

### Step 3: Set Environment Variables

Add these environment variables in Render:

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars
JWT_EXPIRES_IN=24h
CLIENT_URL=https://caretaker-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (~2-3 minutes)
3. Your API will be live at: `https://caretaker-api.onrender.com`

### Important Notes for Free Tier

- Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free tier (enough for one service 24/7)
- Disable sleep: Upgrade to paid tier or use external pinger

### Health Check

Your API health endpoint: `https://caretaker-api.onrender.com/api/health`

---

## Alternative: Railway Deployment

### Step 1: Deploy via Railway

```bash
npm install -g railway
railway login
cd backend
railway init
railway up
```

### Step 2: Set Variables

```bash
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=your-url
railway variables set SUPABASE_ANON_KEY=your-key
railway variables set SUPABASE_SERVICE_ROLE_KEY=your-key
railway variables set JWT_SECRET=your-secret
railway variables set CLIENT_URL=your-frontend-url
```

### Step 3: Get URL

```bash
railway domain
```

---

## Supabase Production Checklist

### 1. Enable Row Level Security (RLS)

All tables should have RLS enabled. Run in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
```

### 2. Create RLS Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users see own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Patients can update their own profile
CREATE POLICY "Patients update own" ON patients
    FOR UPDATE USING (user_id = auth.uid());

-- Caretakers can view verified profiles
CREATE POLICY "Anyone view verified caretakers" ON caretakers
    FOR SELECT USING (status = 'verified');
```

### 3. Configure API Settings

1. Go to **Authentication** → **Settings**
2. Enable **"Enable confirm email"** (optional for MVP)
3. Set **Site URL** to your frontend URL
4. Add redirect URLs for production

### 4. Enable Real-time

1. Go to **Database** → **Replication**
2. Enable real-time for `messages` table

### 5. Setup Storage Buckets

```sql
-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create storage bucket for certifications
INSERT INTO storage.buckets (id, name, public)
VALUES ('certifications', 'certifications', false);

-- Storage policies
CREATE POLICY "Anyone can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 6. Backup Configuration

1. Go to **Database** → **Backups**
2. Point-in-time recovery: Enable
3. Manual backups: Configure schedule

### 7. Environment Variables (Frontend)

Create `.env.production` for frontend:

```env
VITE_API_URL=https://caretaker-api.onrender.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Troubleshooting

### CORS Issues

If you get CORS errors:
1. Verify `CLIENT_URL` is set correctly in backend
2. Check no trailing slash on URLs
3. Ensure frontend API base URL matches

### Database Connection

If connection fails:
1. Check Supabase URL format: `https://xxx.supabase.co`
2. Verify service role key (not anon key)
3. Check IP whitelist if using strict settings

### Socket.IO Connection

If real-time doesn't work:
1. Ensure WebSocket enabled in Supabase
2. Check server logs for connection errors
3. Verify CORS allows socket connections

### Common Error Solutions

| Error | Solution |
|-------|----------|
| `401 Unauthorized` | Check JWT token validity |
| `404 Not Found` | Verify route path |
| `500 Internal Error` | Check server logs on Render |
| `Connection Refused` | Service may be sleeping (free tier) |

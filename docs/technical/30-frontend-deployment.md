# CareTaker Frontend Deployment Guide

## Deploying React Frontend on Vercel (Free Tier)

### Prerequisites
- Vercel account (connected to GitHub)
- Frontend repository on GitHub

### Step 1: Push to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/yourusername/caretaker-frontend.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| Framework Preset | `Vite` |
| Root Directory | `./` or `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Step 3: Environment Variables

Add these in Vercel project settings:

```env
VITE_API_URL=https://caretaker-api.onrender.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build (~1-2 minutes)
3. Your site will be live at: `https://caretaker-frontend.vercel.app`

### Custom Domain (Optional)

1. Go to project **Settings** → **Domains**
2. Add your domain (e.g., `caretaker.app`)
3. Configure DNS records as shown
4. Wait for SSL certificate (automatic)

---

## Alternative: Netlify Deployment

### Step 1: Create Netlify.toml

Create `frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Step 3: Set Environment Variables

In Netlify dashboard:
- Go to **Site Settings** → **Environment Variables**
- Add all required variables

---

## Alternative: GitHub Pages Deployment

### Step 1: Update vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/caretaker/',
  // ... rest of config
})
```

### Step 2: Deploy via GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Step 3: Add Secrets

In GitHub repository settings:
- Go to **Settings** → **Secrets and variables** → **Actions**
- Add `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## Production Checklist

### Before Going Live

- [ ] All environment variables configured
- [ ] API URL points to production backend
- [ ] Supabase URL and keys are production values
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] Authentication works end-to-end
- [ ] Real-time features functional
- [ ] Mobile responsive design tested
- [ ] Browser console free of errors
- [ ] Performance is acceptable

### SEO Optimization

- [ ] Meta tags configured in `index.html`
- [ ] Open Graph tags added
- [ ] Sitemap created (optional)
- [ ] robots.txt configured (optional)

### Security

- [ ] No API keys in frontend code
- [ ] All API calls use environment variables
- [ ] HTTPS enforced
- [ ] CORS properly configured

---

## Troubleshooting

### Build Fails

1. Check Node version (should be 18+)
2. Clear cache: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run typecheck`

### 404 Errors on Refresh

For client-side routing, ensure server configures fallback:

**Vercel**: Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify**: Already configured in `netlify.toml`

**Render**: Add to `package.json`:
```json
{
  "scripts": {
    "start": "npx serve -s build"
  }
}
```

### Environment Variables Not Loading

1. Rebuild after adding variables
2. Check variable names start with `VITE_`
3. Verify variable values are correct

### CORS Issues

1. Verify backend CORS includes frontend URL
2. Check for HTTP/HTTPS mismatch
3. Ensure no trailing slashes

### API Calls Failing

1. Check browser network tab for errors
2. Verify API URL is correct
3. Check JWT token is valid
4. Ensure user is logged in

---

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
```

### Image Optimization

Use lazy loading for images:
```tsx
<img loading="lazy" src={imageUrl} alt="description" />
```

### Code Splitting

```tsx
const Chat = lazy(() => import('./pages/ChatPage'));

<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>
```

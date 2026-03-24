# Setup Documentation

## Quick Start Guide

| Step | Task | Time |
|------|------|------|
| 1 | Install prerequisites (Node.js, Docker, Supabase CLI) | 10 min |
| 2 | Create Supabase project | 5 min |
| 3 | Run database migration | 2 min |
| 4 | Configure environment files | 2 min |
| 5 | Install dependencies | 5 min |
| 6 | Start development servers | 1 min |

**Total: ~25 minutes**

## Setup Options

### Option A: Cloud Supabase (Recommended)
- Easier setup
- No local Docker required
- Good for: Beginners, quick prototyping

### Option B: Local Supabase
- Full local development
- Faster iteration
- Good for: Advanced users, offline work

## Files in This Directory

| File | Description |
|------|-------------|
| `00-getting-started.md` | Complete step-by-step guide |
| `01-supabase-cli.md` | Supabase CLI reference |

## Setup Scripts

| Script | Platform | Usage |
|--------|----------|-------|
| `setup.bat` | Windows | Double-click to run |
| `setup.sh` | macOS/Linux | `./setup.sh` |

## What's Included

The setup script will:
1. Check for required software
2. Install npm dependencies
3. Create `.env` files from templates
4. Provide next steps

## Need Help?

Check the troubleshooting section in `00-getting-started.md` or ask for assistance.

## After Setup

```bash
# Start backend (in backend folder)
npm run dev

# Start frontend (in frontend folder)  
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3000
API Health: http://localhost:3000/api/health

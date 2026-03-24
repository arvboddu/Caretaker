# Supabase Local Development Setup

## Prerequisites

1. Install Supabase CLI:
   ```bash
   # macOS
   brew install supabase/tap/supabase
   
   # Windows (with Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket
   scoop install supabase
   
   # Or download from: https://github.com/supabase/supabase/releases
   ```

2. Install Docker Desktop (required for local development)

## Quick Start

```bash
# 1. Initialize Supabase in the backend folder
cd backend
supabase init

# 2. Link to your Supabase project (optional - for cloud sync)
supabase link --project-ref your-project-ref

# 3. Start local Supabase
supabase start

# 4. Apply the migration
supabase db push

# 5. Get local credentials
supabase status
```

## What This Does

- Starts local PostgreSQL database
- Starts local Auth server
- Starts local Storage server
- Starts local Realtime server
- Provides local API at http://localhost:54321

## Local Environment Variables

After running `supabase start`, update `backend/.env`:

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

## Useful Commands

```bash
supabase status          # Check status of all services
supabase db reset        # Reset local database
supabase db push         # Push migrations to local
supabase db remote push  # Push migrations to cloud
supabase stop            # Stop all services
supabase logs            # View logs
```

## File Changes

When you run `supabase init`, it creates:
```
backend/supabase/
├── config.toml         # Supabase configuration
└── migrations/         # Your migration files
```

The `001_initial_schema.sql` will be moved to `supabase/migrations/` automatically.

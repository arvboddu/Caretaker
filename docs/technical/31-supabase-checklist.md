# CareTaker Supabase Production Checklist

## Account & Project Setup

### Initial Configuration
- [ ] Project created at [Supabase](https://supabase.com)
- [ ] Project name set to `caretaker-prod`
- [ ] Region selected (closest to user base)
- [ ] Team members added with appropriate roles

### API Keys
- [ ] `SUPABASE_URL` secured (never commit this)
- [ ] `SUPABASE_ANON_KEY` stored securely
- [ ] `SUPABASE_SERVICE_ROLE_KEY` stored securely (backend only, never frontend)
- [ ] Keys rotated if accidentally exposed

---

## Database Configuration

### Schema Deployment

Run migrations in order:
1. Create tables (users, patients, caretakers, skills, etc.)
2. Create indexes for performance
3. Create RLS policies
4. Create triggers for auto-updates
5. Seed initial data (skills, etc.)

### Row Level Security (RLS)

#### Enable RLS on All Tables
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretaker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
```

#### Authentication Policies
```sql
-- Users can only read/update their own data
CREATE POLICY "Users read own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Patients can manage their own profiles
CREATE POLICY "Patients read own" ON patients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Patients update own" ON patients FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Patients insert own" ON patients FOR INSERT WITH CHECK (user_id = auth.uid());

-- Caretakers can manage their profiles
CREATE POLICY "Caretakers read own" ON caretakers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Caretakers update own" ON caretakers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Caretakers insert own" ON caretakers FOR INSERT WITH CHECK (user_id = auth.uid());

-- Anyone can read verified caretakers
CREATE POLICY "Anyone read verified caretakers" ON caretakers
    FOR SELECT USING (status = 'verified');

-- Patients can manage their bookings
CREATE POLICY "Patients read bookings" ON bookings
    FOR SELECT USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert bookings" ON bookings
    FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- Caretakers can manage their bookings
CREATE POLICY "Caretakers read bookings" ON bookings
    FOR SELECT USING (caretaker_id IN (SELECT id FROM caretakers WHERE user_id = auth.uid()));
CREATE POLICY "Caretakers update bookings" ON bookings
    FOR UPDATE USING (caretaker_id IN (SELECT id FROM caretakers WHERE user_id = auth.uid()));

-- Chat participants can access their threads
CREATE POLICY "Users read threads" ON chat_participants
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert threads" ON chat_participants
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Chat messages access through participants
CREATE POLICY "Users read messages" ON messages
    FOR SELECT USING (thread_id IN (SELECT thread_id FROM chat_participants WHERE user_id = auth.uid()));
CREATE POLICY "Users insert messages" ON messages
    FOR INSERT WITH CHECK (
        thread_id IN (SELECT thread_id FROM chat_participants WHERE user_id = auth.uid())
        AND sender_id = auth.uid()
    );

-- Anyone can read reviews
CREATE POLICY "Anyone read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Patients insert reviews" ON reviews
    FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- Skills are publicly readable
CREATE POLICY "Anyone read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Caretakers manage skills" ON caretaker_skills
    FOR ALL USING (caretaker_id IN (SELECT id FROM caretakers WHERE user_id = auth.uid()));

-- Availability managed by caretakers
CREATE POLICY "Caretakers manage availability" ON availability
    FOR ALL USING (caretaker_id IN (SELECT id FROM caretakers WHERE user_id = auth.uid()));

-- Anyone can read availability
CREATE POLICY "Anyone read availability" ON availability FOR SELECT USING (true);

-- Certifications managed by caretakers
CREATE POLICY "Caretakers manage certs" ON certifications
    FOR ALL USING (caretaker_id IN (SELECT id FROM caretakers WHERE user_id = auth.uid()));
```

---

## Authentication Configuration

### Settings
- [ ] Email confirmations: Configure as needed for MVP
- [ ] Site URL: Set to production frontend URL
- [ ] Redirect URLs: Add production and staging URLs
- [ ] JWT secret: Use default (managed by Supabase)

### Email Templates
- [ ] Verification email customized
- [ ] Password reset email customized
- [ ] Confirmation email customized

---

## Storage Configuration

### Buckets

```sql
-- Profile photos (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Certification documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certifications', 'certifications', false);
```

### Storage Policies

```sql
-- Profile photos - anyone can view
CREATE POLICY "Avatar public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Users can upload their own avatars
CREATE POLICY "Avatar upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can update their own avatars
CREATE POLICY "Avatar update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Certifications - caretakers only
CREATE POLICY "Caretaker cert upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'certifications'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

---

## Real-time Configuration

### Enable Tables for Real-time

```sql
-- Enable real-time for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable real-time for bookings (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
```

### Check Real-time Status

Go to **Database** → **Replication** to verify tables are enabled.

---

## Backup & Recovery

### Point-in-Time Recovery
- [ ] PITR enabled in **Database** → **Backups**
- [ ] Recovery point objective (RPO) understood: 60 seconds
- [ ] Tested restore process

### Manual Backups
- [ ] Regular manual backups configured (optional for MVP)
- [ ] Backup retention policy set

---

## Monitoring & Logs

### Dashboard Monitoring
- [ ] Supabase Dashboard bookmarked
- [ ] Database metrics monitored (connections, size)
- [ ] Auth metrics monitored (active users, failures)

### Log Explorer
- [ ] Access **Logs** section for debugging
- [ ] Set up alerts for errors (Pro tier)

---

## Security Hardening

### API Protection
- [ ] Rate limiting enabled on backend
- [ ] CORS configured correctly
- [ ] No sensitive data in client-side code

### Database
- [ ] RLS policies tested thoroughly
- [ ] No public write access on sensitive tables
- [ ] Service role key protected (server-side only)

### Storage
- [ ] Bucket policies configured
- [ ] Sensitive documents in private buckets
- [ ] File type validation implemented

---

## Performance

### Indexes

```sql
-- Create indexes for common queries
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_caretakers_user_id ON caretakers(user_id);
CREATE INDEX idx_caretakers_status ON caretakers(status);
CREATE INDEX idx_caretakers_rating ON caretakers(rating DESC);
CREATE INDEX idx_bookings_patient ON bookings(patient_id);
CREATE INDEX idx_bookings_caretaker ON bookings(caretaker_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_reviews_caretaker ON reviews(caretaker_id);
CREATE INDEX idx_caretaker_skills_skill ON caretaker_skills(skill_id);
```

### Query Optimization
- [ ] Expensive queries reviewed
- [ ] JOINs optimized
- [ ] Pagination implemented

---

## Compliance (Future)

### HIPAA Considerations (if applicable)
- [ ] Business Associate Agreement (BAA) with Supabase
- [ ] Encryption at rest verified
- [ ] Audit logging enabled
- [ ] Access controls reviewed

---

## Deployment Verification

### Pre-Launch Checklist
- [ ] All tables created with RLS
- [ ] All policies tested
- [ ] API keys configured in production
- [ ] Storage buckets created and configured
- [ ] Real-time enabled on required tables
- [ ] Backups verified

### Post-Launch Monitoring
- [ ] Monitor error rates
- [ ] Monitor database connections
- [ ] Monitor storage usage
- [ ] Review Supabase Dashboard daily initially

---

## Emergency Procedures

### If Data Breach Suspected
1. Immediately rotate all API keys
2. Review access logs
3. Disable affected user accounts
4. Contact Supabase support

### If Database Compromised
1. Enable PITR restore to clean point
2. Review and strengthen policies
3. Rotate all credentials
4. Notify affected users

### If Supabase Outage
1. Check [status.supabase.com](https://status.supabase.com)
2. Contact Supabase support
3. Implement fallback if critical

---

## Cost Management

### Free Tier Limits
- 500MB database
- 1GB storage
- 50GB bandwidth/month
- 100K monthly active users

### Monitoring Usage
- [ ] Track database size
- [ ] Monitor storage consumption
- [ ] Watch bandwidth usage
- [ ] Set up billing alerts

### Scaling Triggers
- Database approaching 500MB → Plan migration/pro
- Storage exceeding 1GB → Clean up or upgrade
- Bandwidth concerns → Consider CDN

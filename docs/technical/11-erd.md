# CareTaker Database Schema (ER Diagram)

## Entity Relationship Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │    patients     │     │   caretakers    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ email           │◀────││ user_id (FK)    │     │ user_id (FK)    │
│ password_hash   │     │ phone           │     │ phone           │
│ full_name       │     │ address         │     │ bio             │
│ role            │     │ latitude        │     │ years_experience│
│ email_verified  │     │ longitude       │     │ hourly_rate     │
│ created_at      │     │ profile_photo   │     │ daily_rate      │
│ updated_at      │     │ created_at      │     │ profile_photo   │
└────────┬────────┘     │ updated_at      │     │ status          │
         │              └────────┬────────┘     │ rating          │
         │                      │              │ review_count    │
         │                      │              │ created_at      │
         │                      │              │ updated_at      │
         │                      │              └────────┬────────┘
         │                      │                       │
         │              ┌───────┴───────┐               │
         │              │               │               │
         ▼              ▼               │               ▼
┌─────────────────┐ ┌───────────────┐   │   ┌─────────────────────┐
│    skills       │ │ patient_care  │   │   │  caretaker_skills   │
├─────────────────┤ ├───────────────┤   │   ├─────────────────────┤
│ id (PK)         │ │ patient_id(FK)│   │   │ caretaker_id (FK)   │
│ name            │ │ skill_id (FK) │◀──┘   │ skill_id (FK)       │
│ slug            │ └───────────────┘       └─────────────────────┘
│ description     │                                 │
│ created_at      │                                 │
└────────┬────────┘                                 ▼
         │                              ┌─────────────────────┐
         │                              │   certifications    │
         │                              ├─────────────────────┤
         │                              │ id (PK)             │
         │                              │ caretaker_id (FK)   │
         │                              │ name                │
         │                              │ document_url        │
         │                              │ status              │
         │                              │ created_at          │
         │                              └─────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    bookings     │     │    messages     │     │    reviews      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ patient_id (FK) │◀────│ thread_id (FK)  │     │ booking_id (FK) │
│ caretaker_id(FK)│     │ sender_id (FK)  │     │ caretaker_id(FK)│
│ date            │     │ content         │     │ patient_id (FK) │
│ start_time      │     │ status          │     │ rating          │
│ end_time        │     │ created_at      │     │ comment         │
│ duration        │     └─────────────────┘     │ created_at      │
│ hourly_rate     │                               └─────────────────┘
│ total_amount    │               │
│ status          │               │
│ service_notes   │               │
│ address         │               ▼
│ chat_thread_id  │     ┌─────────────────┐
│ created_at      │     │   chat_threads │
│ updated_at      │     ├─────────────────┤
└────────┬────────┘     │ id (PK)         │
         │              │ booking_id (FK) │
         │              │ created_at      │
         │              └────────┬────────┘
         │                       │
         │                       │
         ▼                       │
┌─────────────────┐              │
│    availability │              │
├─────────────────┤              │
│ id (PK)         │              │
│ caretaker_id(FK)│──────────────┘
│ day_of_week     │
│ start_time      │
│ end_time        │
│ created_at      │
└─────────────────┘
```

---

## Table Definitions

### 1. users (Auth Table - managed by Supabase Auth)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'caretaker', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. patients

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    medical_conditions TEXT[], -- Array of conditions
    required_services TEXT[], -- Array of service types
    care_preferences JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    profile_photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_location ON patients(latitude, longitude);
```

### 3. caretakers

```sql
CREATE TABLE caretakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    bio TEXT,
    years_experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    daily_rate DECIMAL(10, 2),
    service_radius INTEGER DEFAULT 10, -- in miles
    profile_photo TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended')),
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_caretakers_user_id ON caretakers(user_id);
CREATE INDEX idx_caretakers_status ON caretakers(status);
CREATE INDEX idx_caretakers_rating ON caretakers(rating DESC);
CREATE INDEX idx_caretakers_price ON caretakers(hourly_rate);
```

### 4. skills

```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO skills (name, slug, description) VALUES
    ('Elder Care', 'elder_care', 'General care for elderly individuals'),
    ('Medication Reminder', 'medication_reminder', 'Assistance with medication schedules'),
    ('Physical Therapy', 'physical_therapy', 'Physical therapy assistance'),
    ('Mobility Assistance', 'mobility_assistance', 'Help with movement and transportation'),
    ('Meal Preparation', 'meal_preparation', 'Cooking and nutrition assistance'),
    ('Housekeeping', 'housekeeping', 'Light housekeeping and cleaning'),
    ('Companionship', 'companionship', 'Social interaction and emotional support'),
    ('Dementia Care', 'dementia_care', 'Specialized dementia care'),
    ('Post-Surgery Care', 'post_surgery_care', 'Recovery assistance after surgery'),
    ('Pediatric Care', 'pediatric_care', 'Care for children');
```

### 5. caretaker_skills (Junction Table)

```sql
CREATE TABLE caretaker_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caretaker_id UUID NOT NULL REFERENCES caretakers(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(caretaker_id, skill_id)
);

CREATE INDEX idx_caretaker_skills_caretaker ON caretaker_skills(caretaker_id);
CREATE INDEX idx_caretaker_skills_skill ON caretaker_skills(skill_id);
```

### 6. certifications

```sql
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caretaker_id UUID NOT NULL REFERENCES caretakers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certifications_caretaker ON certifications(caretaker_id);
CREATE INDEX idx_certifications_status ON certifications(status);
```

### 7. availability

```sql
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caretaker_id UUID NOT NULL REFERENCES caretakers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(caretaker_id, day_of_week)
);

CREATE INDEX idx_availability_caretaker ON availability(caretaker_id);
```

### 8. bookings

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    caretaker_id UUID NOT NULL REFERENCES caretakers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- in hours
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    service_notes TEXT,
    address TEXT NOT NULL,
    special_instructions TEXT,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_patient ON bookings(patient_id);
CREATE INDEX idx_bookings_caretaker ON bookings(caretaker_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_caretaker_date ON bookings(caretaker_id, date);
```

### 9. chat_threads

```sql
CREATE TABLE chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_threads_booking ON chat_threads(booking_id);
```

### 10. chat_participants

```sql
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(thread_id, user_id)
);

CREATE INDEX idx_chat_participants_thread ON chat_participants(thread_id);
CREATE INDEX idx_chat_participants_user ON chat_participants(user_id);
```

### 11. messages

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_thread_created ON messages(thread_id, created_at DESC);
```

### 12. reviews

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    caretaker_id UUID NOT NULL REFERENCES caretakers(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_caretaker ON reviews(caretaker_id);
CREATE INDEX idx_reviews_patient ON reviews(patient_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
```

---

## Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

### Users Policies
```sql
-- Users can view their own data
CREATE POLICY "Users view own" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users update own" ON users
    FOR UPDATE USING (auth.uid() = id);
```

### Patients Policies
```sql
-- Patients can view their own profile
CREATE POLICY "Patients view own" ON patients
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Patients can update their own profile
CREATE POLICY "Patients update own" ON patients
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- Caretakers can view patient profiles for their bookings
CREATE POLICY "Caretakers view patients" ON patients
    FOR SELECT USING (
        id IN (
            SELECT patient_id FROM bookings
            WHERE caretaker_id IN (
                SELECT id FROM caretakers WHERE user_id = auth.uid()
            )
        )
    );
```

### Caretakers Policies
```sql
-- Caretakers can view/update their own profile
CREATE POLICY "Caretakers manage own" ON caretakers
    FOR ALL USING (
        user_id = auth.uid()
    );

-- Anyone can view verified caretaker profiles
CREATE POLICY "Anyone view verified caretakers" ON caretakers
    FOR SELECT USING (
        status = 'verified'
    );
```

### Bookings Policies
```sql
-- Patients can view their own bookings
CREATE POLICY "Patients view bookings" ON bookings
    FOR SELECT USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );

-- Caretakers can view their bookings
CREATE POLICY "Caretakers view bookings" ON bookings
    FOR SELECT USING (
        caretaker_id IN (
            SELECT id FROM caretakers WHERE user_id = auth.uid()
        )
    );

-- Patients can create bookings
CREATE POLICY "Patients create bookings" ON bookings
    FOR INSERT WITH CHECK (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );

-- Patients/caretakers can update their bookings
CREATE POLICY "Users update bookings" ON bookings
    FOR UPDATE USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
        OR caretaker_id IN (
            SELECT id FROM caretakers WHERE user_id = auth.uid()
        )
    );
```

### Messages Policies
```sql
-- Users can view messages in threads they're part of
CREATE POLICY "Users view messages" ON messages
    FOR SELECT USING (
        thread_id IN (
            SELECT thread_id FROM chat_participants
            WHERE user_id = auth.uid()
        )
    );

-- Users can send messages in threads they're part of
CREATE POLICY "Users send messages" ON messages
    FOR INSERT WITH CHECK (
        thread_id IN (
            SELECT thread_id FROM chat_participants
            WHERE user_id = auth.uid()
        )
        AND sender_id = auth.uid()
    );
```

### Reviews Policies
```sql
-- Anyone can view reviews
CREATE POLICY "Anyone view reviews" ON reviews
    FOR SELECT USING (true);

-- Patients can create reviews for their completed bookings
CREATE POLICY "Patients create reviews" ON reviews
    FOR INSERT WITH CHECK (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );
```

---

## Triggers

### Update caretaker rating after new review
```sql
CREATE OR REPLACE FUNCTION update_caretaker_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE caretakers
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE caretaker_id = NEW.caretaker_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE caretaker_id = NEW.caretaker_id
        )
    WHERE id = NEW.caretaker_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_rating
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_caretaker_rating();
```

### Update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_patients_updated
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_caretakers_updated
    BEFORE UPDATE ON caretakers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Database Migrations

```
migrations/
├── 001_create_users.sql
├── 002_create_patients.sql
├── 003_create_caretakers.sql
├── 004_create_skills.sql
├── 005_create_caretaker_skills.sql
├── 006_create_certifications.sql
├── 007_create_availability.sql
├── 008_create_bookings.sql
├── 009_create_chat_tables.sql
├── 010_create_reviews.sql
├── 011_seed_skills.sql
└── 012_create_rls_policies.sql
```

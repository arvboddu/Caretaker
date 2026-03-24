-- CareTaker Database Schema
-- Run this in Supabase SQL Editor or via Supabase CLI
-- Version: 1.0.0

-- =============================================
-- TABLE CREATION
-- =============================================

-- Users table (managed by Supabase Auth, but we extend it)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'caretaker', 'admin')) DEFAULT 'patient',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    medical_conditions TEXT[] DEFAULT '{}',
    required_services TEXT[] DEFAULT '{}',
    care_preferences JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    profile_photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Caretakers table
CREATE TABLE IF NOT EXISTS public.caretakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    phone TEXT,
    bio TEXT,
    years_experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    daily_rate DECIMAL(10, 2),
    service_radius INTEGER DEFAULT 10,
    profile_photo TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended')),
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Caretaker Skills junction table
CREATE TABLE IF NOT EXISTS public.caretaker_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caretaker_id UUID NOT NULL REFERENCES public.caretakers(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(caretaker_id, skill_id)
);

-- Certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caretaker_id UUID NOT NULL REFERENCES public.caretakers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability table
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caretaker_id UUID NOT NULL REFERENCES public.caretakers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(caretaker_id, day_of_week)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    caretaker_id UUID NOT NULL REFERENCES public.caretakers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    service_notes TEXT,
    address TEXT NOT NULL,
    special_instructions TEXT,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.users(id),
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Threads table
CREATE TABLE IF NOT EXISTS public.chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Participants table
CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(thread_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    caretaker_id UUID NOT NULL REFERENCES public.caretakers(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_caretakers_user_id ON public.caretakers(user_id);
CREATE INDEX IF NOT EXISTS idx_caretakers_status ON public.caretakers(status);
CREATE INDEX IF NOT EXISTS idx_caretakers_rating ON public.caretakers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_caretakers_price ON public.caretakers(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_caretaker_skills_caretaker ON public.caretaker_skills(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_caretaker_skills_skill ON public.caretaker_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_certifications_caretaker ON public.certifications(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_availability_caretaker ON public.availability(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_patient ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_caretaker ON public.bookings(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_caretaker_date ON public.bookings(caretaker_id, date);
CREATE INDEX IF NOT EXISTS idx_chat_threads_booking ON public.chat_threads(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_thread ON public.chat_participants(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON public.chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON public.messages(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_caretaker ON public.reviews(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_patient ON public.reviews(patient_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON public.users;
CREATE TRIGGER trg_users_updated
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_patients_updated ON public.patients;
CREATE TRIGGER trg_patients_updated
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_caretakers_updated ON public.caretakers;
CREATE TRIGGER trg_caretakers_updated
    BEFORE UPDATE ON public.caretakers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_bookings_updated ON public.bookings;
CREATE TRIGGER trg_bookings_updated
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- TRIGGER FOR CARE TAKER RATING UPDATE
-- =============================================

CREATE OR REPLACE FUNCTION public.update_caretaker_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.caretakers
    SET 
        rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
            FROM public.reviews
            WHERE caretaker_id = NEW.caretaker_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE caretaker_id = NEW.caretaker_id
        )
    WHERE id = NEW.caretaker_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_rating ON public.reviews;
CREATE TRIGGER trg_update_rating
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_caretaker_rating();

-- =============================================
-- SEED DATA - SKILLS
-- =============================================

INSERT INTO public.skills (name, slug, description) VALUES
    ('Elder Care', 'elder_care', 'General care for elderly individuals including daily living assistance'),
    ('Medication Reminder', 'medication_reminder', 'Assistance with medication schedules and reminders'),
    ('Physical Therapy', 'physical_therapy', 'Physical therapy assistance and rehabilitation support'),
    ('Mobility Assistance', 'mobility_assistance', 'Help with movement, transfers, and transportation'),
    ('Meal Preparation', 'meal_preparation', 'Cooking and nutrition assistance'),
    ('Housekeeping', 'housekeeping', 'Light housekeeping, cleaning, and home organization'),
    ('Companionship', 'companionship', 'Social interaction and emotional support'),
    ('Dementia Care', 'dementia_care', 'Specialized care for dementia and Alzheimer patients'),
    ('Post-Surgery Care', 'post_surgery_care', 'Recovery assistance after surgery'),
    ('Pediatric Care', 'pediatric_care', 'Care for children and infants')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caretaker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Patients policies
CREATE POLICY "Patients can view their own profile" ON public.patients
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Patients can update their own profile" ON public.patients
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Patients can insert their own profile" ON public.patients
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Caretakers policies
CREATE POLICY "Caretakers can view their own profile" ON public.caretakers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Caretakers can update their own profile" ON public.caretakers
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Caretakers can insert their own profile" ON public.caretakers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view verified caretakers" ON public.caretakers
    FOR SELECT USING (status = 'verified');

-- Skills policies
CREATE POLICY "Anyone can view skills" ON public.skills
    FOR SELECT USING (true);

-- Caretaker Skills policies
CREATE POLICY "Anyone can view caretaker skills" ON public.caretaker_skills
    FOR SELECT USING (true);

CREATE POLICY "Caretakers can manage their skills" ON public.caretaker_skills
    FOR ALL USING (
        caretaker_id IN (SELECT id FROM public.caretakers WHERE user_id = auth.uid())
    );

-- Certifications policies
CREATE POLICY "Anyone can view certifications" ON public.certifications
    FOR SELECT USING (true);

CREATE POLICY "Caretakers can manage their certifications" ON public.certifications
    FOR ALL USING (
        caretaker_id IN (SELECT id FROM public.caretakers WHERE user_id = auth.uid())
    );

-- Availability policies
CREATE POLICY "Anyone can view availability" ON public.availability
    FOR SELECT USING (true);

CREATE POLICY "Caretakers can manage their availability" ON public.availability
    FOR ALL USING (
        caretaker_id IN (SELECT id FROM public.caretakers WHERE user_id = auth.uid())
    );

-- Bookings policies
CREATE POLICY "Patients can view their bookings" ON public.bookings
    FOR SELECT USING (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

CREATE POLICY "Caretakers can view their bookings" ON public.bookings
    FOR SELECT USING (
        caretaker_id IN (SELECT id FROM public.caretakers WHERE user_id = auth.uid())
    );

CREATE POLICY "Patients can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

CREATE POLICY "Patients can update their bookings" ON public.bookings
    FOR UPDATE USING (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
        OR caretaker_id IN (SELECT id FROM public.caretakers WHERE user_id = auth.uid())
    );

-- Chat Threads policies
CREATE POLICY "Users can view their chat threads" ON public.chat_threads
    FOR SELECT USING (
        id IN (SELECT thread_id FROM public.chat_participants WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create chat threads" ON public.chat_threads
    FOR INSERT WITH CHECK (true);

-- Chat Participants policies
CREATE POLICY "Users can view their participations" ON public.chat_participants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their participations" ON public.chat_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages in their threads" ON public.messages
    FOR SELECT USING (
        thread_id IN (SELECT thread_id FROM public.chat_participants WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can send messages to their threads" ON public.messages
    FOR INSERT WITH CHECK (
        thread_id IN (SELECT thread_id FROM public.chat_participants WHERE user_id = auth.uid())
        AND sender_id = auth.uid()
    );

CREATE POLICY "Users can update messages in their threads" ON public.messages
    FOR UPDATE USING (
        thread_id IN (SELECT thread_id FROM public.chat_participants WHERE user_id = auth.uid())
    );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Patients can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

-- =============================================
-- STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('certifications', 'certifications', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for certifications
CREATE POLICY "Caretakers can upload certifications" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'certifications'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Caretakers can view their certifications" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'certifications'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- =============================================
-- REAL-TIME CONFIGURATION
-- =============================================

-- Enable real-time for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'CareTaker database schema created successfully!';
    RAISE NOTICE 'Tables created: users, patients, caretakers, skills, caretaker_skills, certifications, availability, bookings, chat_threads, chat_participants, messages, reviews';
    RAISE NOTICE 'Skills seeded: 10 default skills';
    RAISE NOTICE 'Storage buckets created: avatars, certifications';
    RAISE NOTICE 'RLS policies enabled on all tables';
END $$;

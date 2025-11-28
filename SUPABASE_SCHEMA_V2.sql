-- ============================================
-- SCENEFLIX DATABASE SCHEMA - UPDATED v2.0
-- ============================================
-- This schema includes:
-- - User profiles with authentication
-- - Events with full details
-- - Bookings with status tracking
-- - Bookmarks for favorites
-- - Tickets with types and pricing
-- - RLS (Row Level Security) policies

-- ============================================
-- 1. CLEANUP (Optional - use with caution)
-- ============================================
-- Drop existing tables if they exist (due to schema conflicts)
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.venues CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ============================================
-- 2. CREATE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 3. CREATE TABLES
-- ============================================

-- USER PROFILES (Extended Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    phone text,
    avatar_url text,
    bio text,
    role text DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text,
    icon_url text,
    color_hex text DEFAULT '#FF006E',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- VENUES
CREATE TABLE IF NOT EXISTS public.venues (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    city text NOT NULL,
    address text,
    latitude decimal(10, 8),
    longitude decimal(11, 8),
    capacity integer,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- EVENTS (Main Event Table)
CREATE TABLE IF NOT EXISTS public.events (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    price_start numeric(10, 2) NOT NULL DEFAULT 0,
    price_max numeric(10, 2),
    cover_image text,
    hero_image text,
    venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    organizer_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_trending boolean DEFAULT false,
    is_active boolean DEFAULT true,
    total_seats integer,
    available_seats integer,
    rating numeric(3, 2) DEFAULT 0,
    total_bookings integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT price_range_valid CHECK (price_max IS NULL OR price_max >= price_start)
);

-- TICKETS (Ticket Types)
CREATE TABLE IF NOT EXISTS public.tickets (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    type text NOT NULL,
    price numeric(10, 2) NOT NULL,
    quantity_available integer NOT NULL,
    quantity_sold integer DEFAULT 0,
    description text,
    benefits text[],
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(event_id, type)
);

-- BOOKINGS (User Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 1,
    total_price numeric(10, 2) NOT NULL,
    status text DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    booking_reference text UNIQUE,
    payment_method text,
    payment_id text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT quantity_valid CHECK (quantity > 0)
);

-- BOOKMARKS (User Favorites)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, event_id)
);

-- REVIEWS (Event Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    is_verified_purchase boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(event_id, user_id)
);

-- ============================================
-- 4. CREATE INDEXES (Performance)
-- ============================================
CREATE INDEX idx_events_category_id ON public.events(category_id);
CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_is_trending ON public.events(is_trending);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_event_id ON public.bookmarks(event_id);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_reviews_event_id ON public.reviews(event_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- ============================================
-- 5. INSERT CATEGORIES
-- ============================================
INSERT INTO public.categories (name, slug, description, color_hex) VALUES
('Techno & House', 'techno', 'Electronic music and dance events', '#FF006E'),
('Live Concerts', 'concerts', 'Live musical performances', '#00D9FF'),
('Stand-up Comedy', 'comedy', 'Comedy shows and live humor', '#FFBE0B'),
('Theatre & Arts', 'theatre', 'Theatrical productions and art shows', '#8338EC'),
('Workshops', 'workshops', 'Educational and skill development workshops', '#FB5607'),
('Festivals', 'festivals', 'Multi-day music and cultural festivals', '#3A86FF'),
('Sports Events', 'sports', 'Live sports and athletic events', '#06FFA5'),
('DJ & Nightlife', 'nightlife', 'DJ sets and nightclub events', '#FF006E')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. INSERT VENUES
-- ============================================
INSERT INTO public.venues (name, city, address, capacity, image_url) VALUES
('The Royal Opera House', 'Mumbai', '22, M. G. Road, Fort', 2000, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'),
('Jio World Garden', 'Mumbai', 'BKC, Mumbai', 5000, 'https://images.unsplash.com/photo-1560439514-e960a3ef5019?w=800&q=80'),
('NCPA', 'Mumbai', 'Nariman Point, Mumbai', 1200, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'),
('The Habitat', 'Mumbai', 'Lower Parel, Mumbai', 3000, 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80'),
('UB City Amphitheater', 'Bangalore', 'UB City, Bangalore', 4000, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80'),
('Prithvi Theatre', 'Mumbai', 'Juhu, Mumbai', 800, 'https://images.unsplash.com/photo-1507676184212-d0370baf553c?w=800&q=80'),
('Ranga Shankara', 'Bangalore', 'Sankey Road, Bangalore', 700, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80'),
('Canvas Laugh Club', 'Mumbai', 'Palladium, High Street Phoenix', 400, 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=800&q=80'),
('Mehboob Studios', 'Mumbai', 'Bandra, Mumbai', 1500, 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80'),
('Kala Ghoda', 'Mumbai', 'Fort, Mumbai', 600, 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80')
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. INSERT EVENTS (Sample Data)
-- ============================================

-- TECHNO & HOUSE EVENTS
INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Electric Pulse 2025', 'High-energy techno festival featuring international DJs', '2025-12-15 22:00:00+05:30', '2025-12-16 06:00:00+05:30', 999, 2499, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', v.id, c.id, true, 5000, 4500
FROM public.venues v, public.categories c 
WHERE v.name = 'The Royal Opera House' AND c.name = 'Techno & House'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Neon Nights', 'Immersive electronic music experience', '2025-12-22 21:00:00+05:30', '2025-12-23 05:00:00+05:30', 799, 1999, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', v.id, c.id, true, 3000, 2800
FROM public.venues v, public.categories c 
WHERE v.name = 'Jio World Garden' AND c.name = 'Techno & House'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Synth Wave Revival', 'Retro electronic sounds with modern twist', '2025-12-28 20:00:00+05:30', '2025-12-29 02:00:00+05:30', 599, 1299, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', v.id, c.id, false, 2000, 1850
FROM public.venues v, public.categories c 
WHERE v.name = 'NCPA' AND c.name = 'Techno & House'
ON CONFLICT DO NOTHING;

-- LIVE CONCERTS EVENTS
INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Indie Legends Tour', 'Iconic indie rock bands performing live', '2025-12-10 19:00:00+05:30', '2025-12-10 23:00:00+05:30', 1499, 3499, 'https://images.unsplash.com/photo-1478225061937-bab4152f0dca?w=800&q=80', 'https://images.unsplash.com/photo-1478225061937-bab4152f0dca?w=800&q=80', v.id, c.id, true, 2000, 1200
FROM public.venues v, public.categories c 
WHERE v.name = 'The Royal Opera House' AND c.name = 'Live Concerts'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Classical Nights', 'Symphony orchestra performing timeless classics', '2025-12-14 18:00:00+05:30', '2025-12-14 21:00:00+05:30', 799, 1999, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', v.id, c.id, false, 1200, 950
FROM public.venues v, public.categories c 
WHERE v.name = 'The Habitat' AND c.name = 'Live Concerts'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Bollywood Unplugged', 'Popular Bollywood singers perform acoustic sets', '2025-12-20 19:30:00+05:30', '2025-12-20 23:00:00+05:30', 599, 1499, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', v.id, c.id, true, 1500, 1100
FROM public.venues v, public.categories c 
WHERE v.name = 'Jio World Garden' AND c.name = 'Live Concerts'
ON CONFLICT DO NOTHING;

-- COMEDY EVENTS
INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Comedy Fest 2025', 'Multi-day comedy festival with top stand-up comedians', '2025-12-05 19:00:00+05:30', '2025-12-05 21:00:00+05:30', 399, 899, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', v.id, c.id, true, 400, 150
FROM public.venues v, public.categories c 
WHERE v.name = 'Canvas Laugh Club' AND c.name = 'Stand-up Comedy'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Laugh Out Loud Night', 'Evening of hilarious stand-up comedy', '2025-12-12 20:00:00+05:30', '2025-12-12 22:00:00+05:30', 299, 699, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', v.id, c.id, false, 400, 280
FROM public.venues v, public.categories c 
WHERE v.name = 'Canvas Laugh Club' AND c.name = 'Stand-up Comedy'
ON CONFLICT DO NOTHING;

-- THEATRE & ARTS EVENTS
INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Shakespeare Reimagined', 'Modern interpretation of classic Shakespeare play', '2025-12-08 19:00:00+05:30', '2025-12-08 22:00:00+05:30', 699, 1499, 'https://images.unsplash.com/photo-1503252947848-48344c63d330?w=800&q=80', 'https://images.unsplash.com/photo-1503252947848-48344c63d330?w=800&q=80', v.id, c.id, false, 800, 600
FROM public.venues v, public.categories c 
WHERE v.name = 'Prithvi Theatre' AND c.name = 'Theatre & Arts'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Contemporary Dance Showcase', 'Avant-garde dance performance by renowned choreographer', '2025-12-18 18:30:00+05:30', '2025-12-18 20:30:00+05:30', 549, 1199, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', v.id, c.id, true, 700, 450
FROM public.venues v, public.categories c 
WHERE v.name = 'Ranga Shankara' AND c.name = 'Theatre & Arts'
ON CONFLICT DO NOTHING;

-- WORKSHOPS EVENTS
INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Photography Masterclass', 'Learn professional photography from industry experts', '2025-12-11 10:00:00+05:30', '2025-12-11 14:00:00+05:30', 1999, 2999, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', v.id, c.id, false, 50, 35
FROM public.venues v, public.categories c 
WHERE v.name = 'Mehboob Studios' AND c.name = 'Workshops'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, start_time, end_time, price_start, price_max, cover_image, hero_image, venue_id, category_id, is_trending, total_seats, available_seats) 
SELECT 'Digital Marketing Workshop', 'Master the latest digital marketing strategies', '2025-12-13 09:00:00+05:30', '2025-12-13 17:00:00+05:30', 1499, 2499, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', v.id, c.id, true, 100, 65
FROM public.venues v, public.categories c 
WHERE v.name = 'Kala Ghoda' AND c.name = 'Workshops'
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. INSERT TICKETS FOR EVENTS
-- ============================================

-- Get event IDs and insert tickets
-- Note: Adjust based on actual event IDs in your database
WITH event_ids AS (
    SELECT id, title FROM public.events LIMIT 10
)
INSERT INTO public.tickets (event_id, type, price, quantity_available, description, benefits) 
SELECT 
    (SELECT id FROM public.events WHERE title = 'Electric Pulse 2025' LIMIT 1),
    'General Access',
    999,
    1000,
    'General admission to the festival',
    ARRAY['Entry to all stages', 'Access to facilities']
WHERE EXISTS (SELECT 1 FROM public.events WHERE title = 'Electric Pulse 2025')
ON CONFLICT (event_id, type) DO NOTHING;

INSERT INTO public.tickets (event_id, type, price, quantity_available, description, benefits) 
SELECT 
    (SELECT id FROM public.events WHERE title = 'Electric Pulse 2025' LIMIT 1),
    'VIP Pass',
    1999,
    200,
    'VIP experience with premium benefits',
    ARRAY['VIP lounge access', 'Complimentary drinks', 'Fast track entry', 'Premium seating']
WHERE EXISTS (SELECT 1 FROM public.events WHERE title = 'Electric Pulse 2025')
ON CONFLICT (event_id, type) DO NOTHING;

INSERT INTO public.tickets (event_id, type, price, quantity_available, description, benefits) 
SELECT 
    (SELECT id FROM public.events WHERE title = 'Electric Pulse 2025' LIMIT 1),
    'VVIP Pass',
    2499,
    50,
    'Ultra-premium VIP experience',
    ARRAY['Exclusive VVIP lounge', 'Premium bar access', 'Meet & greet', 'Priority support']
WHERE EXISTS (SELECT 1 FROM public.events WHERE title = 'Electric Pulse 2025')
ON CONFLICT (event_id, type) DO NOTHING;

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on sensitive tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- User Profiles - Users can only see their own profile
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Public profiles are readable"
    ON public.user_profiles FOR SELECT
    USING (true);

-- Bookings - Users can only see their own bookings
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Bookmarks - Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON public.bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- Reviews - Users can only see reviews (public read)
CREATE POLICY "Reviews are publicly readable"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews for events they booked"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 10. SAMPLE QUERIES
-- ============================================

-- Get trending events with venue and category info
-- SELECT e.*, v.name as venue_name, c.name as category_name
-- FROM public.events e
-- LEFT JOIN public.venues v ON e.venue_id = v.id
-- LEFT JOIN public.categories c ON e.category_id = c.id
-- WHERE e.is_trending = true AND e.is_active = true
-- ORDER BY e.start_time ASC;

-- Get user's bookings with event details
-- SELECT b.*, e.title as event_title, c.name as category_name
-- FROM public.bookings b
-- JOIN public.events e ON b.event_id = e.id
-- JOIN public.categories c ON e.category_id = c.id
-- WHERE b.user_id = auth.uid()
-- ORDER BY e.start_time DESC;

-- Get available tickets for an event
-- SELECT id, type, price, (quantity_available - quantity_sold) as available
-- FROM public.tickets
-- WHERE event_id = '[EVENT_ID]' AND is_available = true
-- ORDER BY price ASC;

-- ============================================
-- END OF SCHEMA
-- ============================================

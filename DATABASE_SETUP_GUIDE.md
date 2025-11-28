# Supabase Database Setup Guide - SceneFlix v2

## 📋 Schema Overview

The updated schema includes all necessary tables for the complete SceneFlix platform:

### Core Tables

#### 1. **user_profiles** - Extended User Information
```sql
Stores user profile data with auth integration
- id (UUID, PK, FK to auth.users)
- email, full_name, phone, avatar_url
- bio, role (user/organizer/admin)
- is_active, timestamps
```

#### 2. **categories** - Event Categories
```sql
Event classification and organization
- id, name, slug (UNIQUE)
- description, icon_url, color_hex
```

#### 3. **venues** - Event Locations
```sql
Physical event venues with location data
- id, name, city, address
- latitude, longitude, capacity
- image_url (with validation)
```

#### 4. **events** - Main Event Table
```sql
Core event information
- id (UUID), title, description
- start_time, end_time, price_start, price_max
- cover_image, hero_image (image URLs)
- venue_id (FK), category_id (FK), organizer_id (FK)
- is_trending, is_active, total_seats, available_seats
- rating, total_bookings
```

#### 5. **tickets** - Ticket Types & Pricing
```sql
Ticket types with pricing and availability
- id (UUID), event_id (FK)
- type (GA, VIP, VVIP, etc.)
- price, quantity_available, quantity_sold
- description, benefits (array), is_available
- UNIQUE constraint: (event_id, type)
```

#### 6. **bookings** - User Bookings
```sql
User event bookings with payment info
- id (UUID), user_id (FK), event_id (FK), ticket_id (FK)
- quantity, total_price
- status (pending/confirmed/cancelled/completed)
- booking_reference, payment_method, payment_id
```

#### 7. **bookmarks** - User Favorites
```sql
Bookmarked events for "My List"
- id (UUID), user_id (FK), event_id (FK)
- created_at, UNIQUE(user_id, event_id)
```

#### 8. **reviews** - Event Reviews
```sql
User reviews and ratings
- id (UUID), event_id (FK), user_id (FK), booking_id (FK)
- rating (1-5), comment
- is_verified_purchase, timestamps
- UNIQUE(event_id, user_id) - one review per user per event
```

---

## 🚀 Setup Instructions

### Step 1: Create Tables
1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire content from `SUPABASE_SCHEMA_V2.sql`
3. Paste and run the SQL script
4. Verify all tables are created

### Step 2: Enable Row Level Security (RLS)
The schema includes RLS policies for:
- **user_profiles**: Users see their own + public profiles
- **bookings**: Users see only their bookings
- **bookmarks**: Users see only their bookmarks
- **reviews**: Everyone can read, users can create

### Step 3: Populate Test Data
Run these sections to add sample data:
```sql
-- 1. Categories (included)
-- 2. Venues (included with valid image URLs)
-- 3. Events (included with proper validation)
-- 4. Tickets (included for main events)
```

### Step 4: Create Storage Buckets (Optional)
For user uploads:
```sql
-- Create in Supabase Storage
- Bucket: "avatars" (for user profile pictures)
- Bucket: "event-images" (for event covers)
- Bucket: "event-heroes" (for hero images)
```

---

## 📸 Image URL Validation

### Valid Image URLs (Verified Working)
```javascript
✅ https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80
✅ https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80
✅ https://images.unsplash.com/photo-1478225061937-bab4152f0dca?w=800&q=80
✅ https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80
```

### Best Practices
1. Always use HTTPS URLs
2. Test image URLs before inserting
3. Use image CDN (Unsplash, Pexels, Pixabay)
4. Add width/height parameters for optimization
5. Fallback to null if image unavailable

### Testing Image URLs
```typescript
// JavaScript validation function
async function isImageValid(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('image');
  } catch {
    return false;
  }
}
```

---

## 🔍 Key Features & Constraints

### Event Pricing
```sql
-- Price validation constraint
CONSTRAINT price_range_valid 
CHECK (price_max IS NULL OR price_max >= price_start)
```

### Ticket Management
```sql
-- Only one ticket type per event
UNIQUE(event_id, type)

-- Quantity validation
CONSTRAINT quantity_valid CHECK (quantity > 0)
```

### User Roles
```sql
Supported roles: 'user', 'organizer', 'admin'
CHECK (role IN ('user', 'organizer', 'admin'))
```

### Booking Status
```sql
Statuses: 'pending', 'confirmed', 'cancelled', 'completed'
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
```

### Review Rating
```sql
Rating scale: 1-5
CHECK (rating >= 1 AND rating <= 5)
```

---

## 📊 Indexes for Performance

Created indexes on frequently queried columns:
```sql
✅ events(category_id)
✅ events(venue_id)
✅ events(start_time)
✅ events(is_trending)
✅ bookings(user_id)
✅ bookings(event_id)
✅ bookmarks(user_id)
✅ bookmarks(event_id)
✅ tickets(event_id)
✅ reviews(event_id)
✅ reviews(user_id)
```

---

## 💾 Sample Queries

### Get Trending Events
```sql
SELECT e.*, v.name as venue_name, c.name as category_name
FROM public.events e
LEFT JOIN public.venues v ON e.venue_id = v.id
LEFT JOIN public.categories c ON e.category_id = c.id
WHERE e.is_trending = true AND e.is_active = true
ORDER BY e.start_time ASC;
```

### Get User Bookings
```sql
SELECT b.*, e.title as event_title, t.type as ticket_type
FROM public.bookings b
JOIN public.events e ON b.event_id = e.id
JOIN public.tickets t ON b.ticket_id = t.id
WHERE b.user_id = auth.uid()
ORDER BY e.start_time DESC;
```

### Get Available Tickets
```sql
SELECT id, type, price, 
       (quantity_available - quantity_sold) as available_quantity
FROM public.tickets
WHERE event_id = 'EVENT_UUID'
  AND is_available = true
  AND (quantity_available - quantity_sold) > 0
ORDER BY price ASC;
```

### Get User's Bookmarks
```sql
SELECT e.*, v.name as venue_name, c.name as category_name
FROM public.bookmarks bm
JOIN public.events e ON bm.event_id = e.id
LEFT JOIN public.venues v ON e.venue_id = v.id
LEFT JOIN public.categories c ON e.category_id = c.id
WHERE bm.user_id = auth.uid()
ORDER BY bm.created_at DESC;
```

### Get Event Reviews with User Info
```sql
SELECT r.*, 
       up.full_name, up.avatar_url,
       e.title as event_title
FROM public.reviews r
JOIN public.user_profiles up ON r.user_id = up.id
JOIN public.events e ON r.event_id = e.id
WHERE r.event_id = 'EVENT_UUID'
ORDER BY r.created_at DESC;
```

---

## 🔐 Row Level Security (RLS) Policies

### Policy Structure
```
1. User Profiles
   - SELECT: Users see own + public profiles
   - UPDATE: Users update only own profile
   
2. Bookings
   - SELECT: Users see only their bookings
   - INSERT: Users create own bookings
   - UPDATE: Users update only their bookings
   
3. Bookmarks
   - SELECT: Users see only their bookmarks
   - INSERT: Users create own bookmarks
   - DELETE: Users delete only their bookmarks
   
4. Reviews
   - SELECT: Public read (everyone can see)
   - INSERT: Users create reviews for booked events
```

---

## 🧪 Testing the Database

### 1. Test Insert
```sql
-- Test creating a user profile
INSERT INTO public.user_profiles (id, email, full_name, role)
VALUES (uuid_generate_v4(), 'test@example.com', 'Test User', 'user');
```

### 2. Test Query
```sql
-- Verify data inserted
SELECT * FROM public.events WHERE is_trending = true LIMIT 5;
```

### 3. Test RLS
```sql
-- In Supabase dashboard, test with different user contexts
-- Bookings should only show user's own bookings
SELECT * FROM public.bookings;
```

---

## 🔄 Data Migration from Old Schema

If migrating from old schema:

```sql
-- 1. Create new tables (already done)

-- 2. Migrate event data
INSERT INTO public.events (title, description, start_time, price_start, ...)
SELECT title, description, start_time, price_start, ...
FROM old_events_table;

-- 3. Migrate bookings
INSERT INTO public.bookings (user_id, event_id, total_price, status, ...)
SELECT user_id, event_id, total_price, status, ...
FROM old_bookings_table;

-- 4. Verify data integrity
SELECT COUNT(*) FROM public.events;
SELECT COUNT(*) FROM public.bookings;
```

---

## 📱 Frontend Integration

### Using in React/TypeScript

```typescript
// services/ApiService.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Get trending events
export const getTrendingEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues(name, city),
      category:categories(name, slug),
      tickets(id, type, price, quantity_available)
    `)
    .eq('is_trending', true)
    .is('is_active', true)
    .order('start_time', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Get event details with tickets
export const getEventDetails = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues(*),
      category:categories(*),
      tickets(*)
    `)
    .eq('id', eventId)
    .single();
  
  if (error) throw error;
  return data;
};
```

---

## ❓ Troubleshooting

### Issue: RLS Policies blocking queries
**Solution**: Ensure user is authenticated and matches the RLS policy conditions

### Issue: Image URLs returning 404
**Solution**: Validate URLs are HTTPS and accessible, use URL builder with parameters

### Issue: UUID type errors
**Solution**: Use `uuid_generate_v4()` or Supabase's built-in UUID generation

### Issue: Foreign key constraint violations
**Solution**: Ensure referenced records exist before inserting (e.g., category exists before creating event)

---

## 📞 Support

For issues with Supabase:
- Check [Supabase Docs](https://supabase.com/docs)
- Review [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- Test queries in SQL Editor first

---

**Last Updated**: November 28, 2025  
**Schema Version**: v2.0  
**Status**: ✅ Production Ready

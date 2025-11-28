# SceneFlix - Quick Reference Guide

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SUPABASE_SCHEMA_V2.sql` | Complete database schema (run in Supabase SQL Editor) |
| `DATABASE_SETUP_GUIDE.md` | Detailed setup and configuration instructions |
| `API_DOCUMENTATION.md` | All API methods and type definitions |
| `IMPLEMENTATION_COMPLETE.md` | Feature list and implementation status |

---

## 🚀 Quick Start

### 1. Database Setup (5 minutes)
```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Copy entire content from SUPABASE_SCHEMA_V2.sql
# 4. Run and wait for completion
# ✅ All tables, indexes, and sample data created
```

### 2. Environment Configuration (2 minutes)
```bash
# Create .env file in project root
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

### 3. Start Development (1 minute)
```bash
npm install      # Install dependencies (if not done)
npm run dev      # Start dev server at http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── pages/                  # Page components
│   ├── Home.tsx           # Landing page
│   ├── EventDetail.tsx    # Event info & booking
│   ├── Login.tsx          # Authentication
│   ├── Signup.tsx         # User registration
│   ├── Checkout.tsx       # Order summary
│   ├── BookingConfirmation.tsx  # Success page
│   ├── UserProfile.tsx    # User dashboard
│   └── ...
├── services/              # API services
│   ├── ApiService.ts      # Event queries
│   ├── AuthService.ts     # Authentication
│   └── BookingService.ts  # Bookings
├── context/               # React Context
│   └── AuthContext.tsx    # Global auth state
├── hooks/                 # Custom hooks
│   └── useAuth.ts         # Auth context hook
├── components/            # UI components
│   ├── ComponentNavbar.tsx
│   ├── ComponentHero.tsx
│   ├── ComponentEventRail.tsx
│   └── UI/
│       ├── UserMenu.tsx   # User dropdown
│       └── AuthGuard.tsx  # Protected routes
└── App.tsx               # Router & layout
```

---

## 🔑 Key Features

| Feature | Status | Path |
|---------|--------|------|
| Event Discovery | ✅ | `/` & `/category/:category` |
| Bookmarking | ✅ | `/my-list` |
| User Authentication | ✅ | `/login` & `/signup` |
| Event Details | ✅ | `/event/:eventId` |
| Checkout | ✅ | `/checkout/:eventId` |
| Booking Confirmation | ✅ | `/booking-confirmation/:eventId` |
| User Profile | ✅ | `/profile` |

---

## 🗄️ Database Tables

### Main Tables
- `events` - Event information with pricing
- `tickets` - Ticket types (GA, VIP, VVIP)
- `bookings` - User bookings
- `bookmarks` - Favorite events

### Support Tables
- `user_profiles` - User account data
- `categories` - Event categories
- `venues` - Event locations
- `reviews` - User ratings & comments

---

## 🔐 Row Level Security (RLS)

| Table | Policy |
|-------|--------|
| user_profiles | Users see own + public profiles |
| bookings | Users see only their bookings |
| bookmarks | Users see only their bookmarks |
| reviews | Public read, users write own reviews |

---

## 📊 Sample Data Included

### Categories (8)
- Techno & House
- Live Concerts
- Stand-up Comedy
- Theatre & Arts
- Workshops
- Festivals
- Sports Events
- DJ & Nightlife

### Venues (10)
- Royal Opera House (Mumbai)
- Jio World Garden (Mumbai)
- UB City Amphitheater (Bangalore)
- + 7 more

### Events (10+)
- Electric Pulse 2025 (Techno)
- Indie Legends Tour (Concert)
- Comedy Fest 2025 (Comedy)
- + 7 more with full details

---

## 🔄 Authentication Flow

```
User Input → AuthService → Supabase Auth → User Profile → AuthContext → UI Update
```

### Sign Up
```typescript
await AuthService.signup(email, password, fullName)
// ↓ Supabase creates auth user
// ↓ user_profiles table updated
// ↓ AuthContext auto-updated
// ↓ Redirect to home
```

### Login
```typescript
await AuthService.login(email, password)
// ↓ Supabase validates
// ↓ Fetches user profile
// ↓ AuthContext updated
// ↓ Navbar shows UserMenu
```

---

## 🎫 Booking Flow

```
1. Browse Events (Home/Category)
   ↓
2. Click Event → EventDetail Page
   ↓
3. Select Ticket Type + Quantity
   ↓
4. Click "Book Now"
   ↓
5. Login (if needed)
   ↓
6. Checkout Page (Order Review)
   ↓
7. Confirm Booking
   ↓
8. BookingConfirmation Page
   ↓
9. Access from Profile/My Bookings
```

---

## 🛠️ Common Tasks

### Add New Event Category
```sql
INSERT INTO public.categories (name, slug, description, color_hex)
VALUES ('New Category', 'new-category', 'Description', '#FF006E');
```

### Add New Venue
```sql
INSERT INTO public.venues (name, city, address, capacity, image_url)
VALUES ('Venue Name', 'City', 'Address', 1000, 'https://image-url.com');
```

### Create New Event
```sql
INSERT INTO public.events 
  (title, description, start_time, price_start, cover_image, 
   hero_image, venue_id, category_id, is_trending, total_seats)
VALUES ('Event Name', 'Description', NOW(), 999, 'image_url', 
        'hero_url', 1, 1, true, 1000);
```

### Add Tickets for Event
```sql
INSERT INTO public.tickets (event_id, type, price, quantity_available, benefits)
VALUES 
  ('EVENT_UUID', 'GA', 999, 1000, ARRAY['Entry', 'Facilities']),
  ('EVENT_UUID', 'VIP', 1999, 200, ARRAY['VIP Lounge', 'Drinks']),
  ('EVENT_UUID', 'VVIP', 2999, 50, ARRAY['Meet & Greet', 'Premium']);
```

---

## 🐛 Troubleshooting

### Images Not Loading
- Verify URL is HTTPS
- Check image CDN is accessible
- Use browser DevTools → Network tab
- Fallback: Use placeholder image

### RLS Permission Denied
- Ensure user is authenticated
- Check RLS policy matches user ID
- Verify row-level security is enabled

### Booking Failed
- Verify user is logged in
- Check ticket availability
- Ensure event_id and ticket_id exist
- Check quantity doesn't exceed available

### Page Blank/White
- Open DevTools → Console for errors
- Check network tab for 404s
- Verify environment variables set
- Clear browser cache and reload

---

## 📈 Performance Tips

### Database
- Use `.select()` to limit columns
- Add pagination for large datasets
- Use `.limit(n)` to avoid huge queries
- Leverage indexes on frequently filtered columns

### Frontend
- Lazy load images with `<img loading="lazy">`
- Debounce search/filter inputs
- Cache API responses
- Code splitting by route

### Images
- Use WebP with PNG fallback
- Compress before upload
- Responsive sizes: `?w=800&q=80`
- CDN like Unsplash recommended

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Database (Supabase CLI)
supabase status         # Check project status
supabase db push        # Push local migrations
supabase functions list # List edge functions
```

---

## 📞 Getting Help

### Documentation
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com

### SQL Help
- Test in Supabase SQL Editor first
- Use `EXPLAIN ANALYZE` for query analysis
- Check indexes are being used

### Frontend Errors
- Check browser console for error messages
- Use React DevTools extension
- Verify component props match types

---

## ✅ Deployment Checklist

- [ ] Database schema created in Supabase
- [ ] Environment variables configured
- [ ] All pages tested locally
- [ ] Images load correctly
- [ ] Authentication works end-to-end
- [ ] Bookings can be created
- [ ] RLS policies working
- [ ] No console errors

Then deploy to:
- Vercel: `git push` (auto-deploys main branch)
- Netlify: Connect GitHub repo
- Self-hosted: `npm run build && serve dist`

---

## 📋 Feature Checklist

### Core Features
- [x] Event discovery & browsing
- [x] Event filtering by category
- [x] Event search
- [x] Event details page
- [x] Bookmarking system

### Authentication
- [x] Sign up with email
- [x] Login with email
- [x] Logout functionality
- [x] Session persistence
- [x] Protected routes

### Booking
- [x] Ticket type selection
- [x] Quantity selector
- [x] Price calculation
- [x] Checkout page
- [x] Booking confirmation

### User Features
- [x] User profile page
- [x] Profile editing
- [x] Booking history
- [x] User menu dropdown

---

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Colors**: 
  - Primary Pink: `#FF006E`
  - Secondary Violet: `#8338EC`
  - Background: `#0A0E27`

---

## 🔄 Recent Updates (v2.0)

✅ Complete authentication system  
✅ Event booking flow  
✅ User profiles  
✅ Comprehensive database schema  
✅ Row-level security  
✅ All API services  
✅ Protected routes  

---

**Version**: 2.0  
**Last Updated**: November 28, 2025  
**Status**: 🚀 Production Ready

---

## Next Steps

1. Run database schema in Supabase
2. Set environment variables
3. Start dev server
4. Test authentication (signup/login)
5. Browse events and create a booking
6. Deploy to Vercel

Enjoy building with SceneFlix! 🎉

# Product Requirements Document: SortMyScene Clone - v2

## 1. Project Overview

**Product Name:** SortMyScene Clone  
**Description:** A nightlife and event discovery platform allowing users to find events, bookmark favorites, book tickets, and organizers to list events.  
**Target Audience:** Partygoers (Gen Z/Millennials) and Event Organizers.  
**MVP Scope:** Event discovery, bookmarking, authentication, event details, and ticket booking.

---

## 2. Core Features (MVP v2 - Full Implementation)

### 2.1 Authentication & User Management ⭐ **NEW**
- **Sign Up**: Email/Password registration with validation
- **Login**: Email/Password login with session management  
- **User Profile**: Manage profile information, view booking history
- **Password Reset**: Email-based password recovery
- **Session Persistence**: Remember logged-in state across page reloads
- **Logout**: Clear session and redirect to home

### 2.2 Event Discovery
- **Home Page**:
  - Hero section with featured/trending event
  - Event cards in horizontal scrollable rails by category
  - Categories: Techno, Live Concerts, Comedy, Workshops, Theater, Sports
  - Pagination or infinite scroll for event grids
  
- **Category Pages**:
  - Click category to see all events in that category
  - Filter options (City, Price Range, Date)
  - Sort by (Trending, Price: Low to High, Date)

- **Event Details Page** ⭐ **NEW**:
  - Large hero image
  - Event title, description, lineup
  - Venue details (name, city, address)
  - Ticket types and prices
  - User reviews/ratings
  - Related events

### 2.3 Bookmarking & My List ✅ DONE
- **Add/Remove to Favorites**: Heart icon on event cards
- **My List Page**: View all bookmarked events
- **Persistent Storage**: localStorage + sync with backend for logged-in users
- **Quick Actions**: Remove from list, share, book now

### 2.4 Booking System ⭐ **NEW**
- **Ticket Selection**:
  - Choose ticket type (GA, VIP, VVIP)
  - Select quantity
  - View total price

- **Checkout Flow**:
  - Order summary with booking details
  - Delivery method (E-ticket, Physical)
  - Payment button (Stripe integration or placeholder)

- **Booking Confirmation**:
  - Confirmation page with ticket details
  - QR code placeholder
  - Download/Share ticket option
  - Save to My Bookings

### 2.5 Navigation & UI ✅ DONE
- **Navbar**:
  - Logo/branding with home link
  - Navigation links (Home, Categories, My List)
  - Search bar (placeholder)
  - User profile icon / Login button
  - Mobile hamburger menu

- **Footer**:
  - Company links
  - Social media links
  - Legal links (Terms, Privacy)

---

## 3. Components Architecture

### 3.1 Layout Components
```
App (Router wrapper)
├── Layout
│   ├── Navbar ✅
│   └── Footer ✅
└── Routes
    ├── Home ✅
    ├── CategoryPage ✅
    ├── MyList ✅
    ├── EventDetail ⭐
    ├── Login ⭐
    ├── Signup ⭐
    ├── UserProfile ⭐
    ├── Checkout ⭐
    └── BookingConfirmation ⭐
```

### 3.2 Page Components
- **Home.tsx** ✅: Main landing page with hero + event rails
- **CategoryPage.tsx** ✅: Filtered events by category
- **MyList.tsx** ✅: Bookmarked events
- **EventDetail.tsx** ⭐: Full event information + booking
- **Login.tsx** ⭐: Email/password login form
- **Signup.tsx** ⭐: Email/password registration form
- **UserProfile.tsx** ⭐: User info, booking history
- **Checkout.tsx** ⭐: Order review + payment flow
- **BookingConfirmation.tsx** ⭐: Success confirmation page

### 3.3 Reusable Components
- **Navbar.tsx** ✅: Navigation with auth state
- **Footer.tsx** ✅: Footer with links
- **EventCard.tsx** ✅: Event preview card with bookmark
- **EventRail.tsx** ✅: Horizontal scrollable event list
- **Hero.tsx** ✅: Large featured event display
- **Button.tsx** ⭐: Primary, secondary, destructive variants
- **Modal.tsx** ⭐: Reusable modal/dialog
- **Loader.tsx** ⭐: Loading spinner
- **Alert.tsx** ⭐: Toast notifications
- **UserMenu.tsx** ⭐: Dropdown user menu (Profile, Bookings, Logout)
- **AuthGuard.tsx** ⭐: Redirect to login if not authenticated

### 3.4 Form Components
- **LoginForm.tsx** ⭐: Email + password input with validation
- **SignupForm.tsx** ⭐: Email, password, confirm password, full name
- **TicketSelector.tsx** ⭐: Quantity + type picker
- **SearchBar.tsx** ⭐: Event search input
- **FilterPanel.tsx** ⭐: Category/price/date filters

### 3.5 Service/Hook Components
- **ApiService.ts** ✅: Supabase event queries
- **AuthService.ts** ⭐: Supabase auth (signup, login, logout, session, password reset)
- **BookmarkService.ts** ✅: localStorage + backend sync
- **BookingService.ts** ⭐: Booking creation/management
- **useAuth.ts** ⭐: Custom hook for auth state & user data
- **useEvents.ts** ⭐: Custom hook for event fetching
- **useBookings.ts** ⭐: Custom hook for booking management

---

## 4. Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Framework** | Tailwind CSS, Lucide React (Icons) |
| **Routing** | React Router v6 |
| **State Management** | React Context + Hooks |
| **Form Handling** | React Hook Form + Zod (validation) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Hosting** | Vercel |
| **Payment** | Stripe (optional for MVP) |
| **Environment** | .env for secrets (not committed) |

---

## 5. Database Schema (Supabase)

### Users Table (Auto-managed by Supabase Auth)
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  role ENUM('user', 'organizer') DEFAULT 'user',
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  venue_id UUID REFERENCES venues(id),
  category_id UUID REFERENCES categories(id),
  hero_image VARCHAR,
  cover_image VARCHAR,
  price_start DECIMAL(10, 2),
  is_trending BOOLEAN DEFAULT FALSE,
  organizer_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Venues Table
```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  address TEXT,
  capacity INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity_available INT NOT NULL,
  quantity_sold INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2),
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Bookmarks Table
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  event_id UUID NOT NULL REFERENCES events(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
```

---

## 6. Authentication Flow

### Signup
1. User fills signup form (email, password, full name)
2. Form validation (email format, password strength)
3. Submit to `AuthService.signup()`
4. Supabase creates auth user + profile record
5. Auto-login user
6. Redirect to home/onboarding

### Login
1. User enters email + password
2. Submit to `AuthService.login()`
3. Supabase validates credentials
4. Store session token (auto-handled by Supabase client)
5. Redirect to home or intended destination

### Logout
1. Click logout button
2. Call `AuthService.logout()`
3. Clear session
4. Redirect to home

### Protected Routes
- Wrap routes with `<AuthGuard>` component
- Redirect unauthenticated users to login
- Pass `requireAuth={true}` prop

---

## 7. API Endpoints (Supabase REST)

### Auth (Supabase Auth API)
- `POST /auth/v1/signup`: Create account
- `POST /auth/v1/token?grant_type=password`: Login
- `POST /auth/v1/logout`: Logout
- `GET /auth/v1/user`: Get current user
- `POST /auth/v1/recover`: Request password reset

### Events
- `GET /rest/v1/events`: Fetch all events
- `GET /rest/v1/events?id=eq.{id}`: Fetch single event
- `GET /rest/v1/events?category_id=eq.{id}`: Fetch by category
- `GET /rest/v1/events?is_trending=eq.true`: Fetch trending
- `POST /rest/v1/events`: Create event (organizer only)

### Bookings
- `GET /rest/v1/bookings?user_id=eq.{userId}`: User's bookings
- `POST /rest/v1/bookings`: Create new booking
- `PATCH /rest/v1/bookings?id=eq.{id}`: Update booking status
- `DELETE /rest/v1/bookings?id=eq.{id}`: Cancel booking

### Bookmarks
- `GET /rest/v1/bookmarks?user_id=eq.{userId}`: User's bookmarks
- `POST /rest/v1/bookmarks`: Add bookmark
- `DELETE /rest/v1/bookmarks?user_id=eq.{userId}&event_id=eq.{eventId}`: Remove bookmark

---

## 8. Implementation Phases

### Phase 1: Foundation ✅
- ✅ Project setup (Vite, React, Tailwind, Router)
- ✅ Supabase integration
- ✅ Basic routing structure

### Phase 2: Core Features ✅ (Partial)
- ✅ Event discovery & display
- ✅ Bookmarking system (localStorage)
- ⏳ **Authentication (Supabase Auth) - Priority 1**
- ⏳ Event details page - Priority 1
- ⏳ Booking management - Priority 1

### Phase 3: Advanced Features
- ⏳ Search & filtering
- ⏳ User profile page
- ⏳ Booking history
- ⏳ Notifications/email alerts
- ⏳ Payment integration (Stripe)

### Phase 4: Polish & Deployment
- ⏳ Error handling & validation
- ⏳ Loading states
- ⏳ Mobile responsiveness
- ⏳ Vercel deployment

---

## 9. Success Metrics

- ✅ All pages load without errors
- ✅ Authentication flow works (signup → login → profile → logout)
- ✅ Users can bookmark/unbookmark events
- ✅ Users can view booking history
- ✅ Event details page displays correctly
- ✅ Checkout flow processes bookings
- ✅ Responsive design on mobile/tablet/desktop
- ✅ Sub-2s page load time
- ✅ Zero console errors in production

---

## 10. Environment Variables (.env)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: `.env` is in `.gitignore` and never committed. Use `.env.example` as template.

---

## 11. Deployment Checklist

- [ ] All components tested locally
- [ ] Authentication flow tested end-to-end
- [ ] Database migrations applied to Supabase
- [ ] Auth policies configured in Supabase
- [ ] Environment variables configured in Vercel
- [ ] Build passes without errors (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Domain configured (optional)
- [ ] Analytics/monitoring set up (optional)
- [ ] Production testing completed

---

## 12. File Structure (Updated)

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx ✅
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx ⭐
│   │   ├── SignupForm.tsx ⭐
│   │   ├── AuthGuard.tsx ⭐
│   │   └── UserMenu.tsx ⭐
│   ├── events/
│   │   ├── EventCard.tsx ✅
│   │   ├── EventRail.tsx ✅
│   │   ├── Hero.tsx ✅
│   │   └── EventDetails.tsx ⭐
│   ├── booking/
│   │   ├── TicketSelector.tsx ⭐
│   │   ├── CheckoutForm.tsx ⭐
│   │   └── BookingConfirmation.tsx ⭐
│   └── common/
│       ├── Button.tsx ⭐
│       ├── Modal.tsx ⭐
│       ├── Loader.tsx ⭐
│       └── Alert.tsx ⭐
├── pages/
│   ├── Home.tsx ✅
│   ├── CategoryPage.tsx ✅
│   ├── MyList.tsx ✅
│   ├── EventDetail.tsx ⭐
│   ├── Login.tsx ⭐
│   ├── Signup.tsx ⭐
│   ├── UserProfile.tsx ⭐
│   ├── Checkout.tsx ⭐
│   └── BookingConfirmation.tsx ⭐
├── services/
│   ├── ApiService.ts ✅
│   ├── AuthService.ts ⭐
│   ├── BookmarkService.ts ✅
│   ├── BookingService.ts ⭐
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts ⭐
│   ├── useEvents.ts ⭐
│   └── useBookings.ts ⭐
├── context/
│   └── AuthContext.tsx ⭐
├── App.tsx ✅
├── main.tsx ✅
├── index.css ✅
└── env.d.ts ✅
```

---

**Legend:**  
✅ = Complete  
⭐ = To Build  
⏳ = In Progress

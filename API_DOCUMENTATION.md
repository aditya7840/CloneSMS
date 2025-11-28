# SceneFlix API Documentation & Configuration

## 🔧 Environment Setup

### Required Environment Variables

Create `.env` file in project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Analytics
VITE_ANALYTICS_ID=

# Optional: Payment Gateway (Future)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

---

## 📡 API Service Methods

### EventService

#### Get Trending Events
```typescript
EventService.getTrending()
// Returns: Event[]
// Description: Get all trending events ordered by popularity
```

#### Get Events by Category
```typescript
EventService.getByCategory(slug: string)
// Parameters: 'techno' | 'concerts' | 'comedy' | 'theatre' | 'workshops'
// Returns: Event[]
```

#### Get Event Details
```typescript
EventService.getEventById(id: string)
// Returns: Event (with venue, category, and tickets)
```

#### Search Events
```typescript
EventService.searchEvents(query: string)
// Returns: Event[]
// Searches title and description
```

---

### AuthService

#### Sign Up
```typescript
AuthService.signup(email: string, password: string, fullName: string)
// Returns: { user: AuthUser | null, error: any }
// Creates user profile automatically
```

#### Login
```typescript
AuthService.login(email: string, password: string)
// Returns: { user: any, session: Session | null, error: any }
```

#### Logout
```typescript
AuthService.logout()
// Returns: { error: any }
// Clears session and user state
```

#### Get Current User
```typescript
AuthService.getCurrentUser()
// Returns: AuthUser | null
// Fetches user profile from user_profiles table
```

#### Update Profile
```typescript
AuthService.updateProfile(userId: string, updates: Partial<AuthUser>)
// Updates: full_name, phone, avatar_url, etc.
// Returns: { error: any }
```

#### Reset Password
```typescript
AuthService.resetPassword(email: string)
// Sends password reset email
// Returns: { error: any }
```

#### Subscribe to Auth Changes
```typescript
AuthService.onAuthStateChange(callback: (user: AuthUser | null) => void)
// Real-time auth state updates
// Returns: subscription object with unsubscribe method
```

---

### BookingService

#### Create Booking
```typescript
BookingService.createBooking(
  userId: string,
  eventId: string,
  ticketId: string,
  quantity: number,
  totalPrice: number
)
// Returns: Booking | null
```

#### Get User Bookings
```typescript
BookingService.getUserBookings(userId: string)
// Returns: Booking[]
// Gets all bookings for the user
```

#### Get Single Booking
```typescript
BookingService.getBooking(bookingId: string)
// Returns: Booking | null
```

#### Update Booking Status
```typescript
BookingService.updateBookingStatus(bookingId: string, status: BookingStatus)
// Status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
// Returns: { error: any }
```

#### Cancel Booking
```typescript
BookingService.cancelBooking(bookingId: string)
// Returns: { error: any }
// Sets status to 'cancelled'
```

#### Get Event Tickets
```typescript
BookingService.getEventTickets(eventId: string)
// Returns: Ticket[]
// Gets all ticket types for an event
```

---

### BookmarkService

#### Get All Bookmarks
```typescript
BookmarkService.getBookmarks()
// Returns: Event[]
// Uses localStorage
```

#### Add Bookmark
```typescript
BookmarkService.addBookmark(event: Event)
// Returns: void
// Stores in localStorage
```

#### Remove Bookmark
```typescript
BookmarkService.removeBookmark(eventId: string | number)
// Returns: void
```

#### Check if Bookmarked
```typescript
BookmarkService.isBookmarked(eventId: string | number)
// Returns: boolean
```

#### Toggle Bookmark
```typescript
BookmarkService.toggleBookmark(event: Event)
// Returns: boolean (new state)
// Adds if not bookmarked, removes if already bookmarked
```

---

## 📦 Type Definitions

### Event
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  price_start: number;
  cover_image: string;
  hero_image?: string;
  venue?: {
    name: string;
    city: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  is_trending: boolean;
}
```

### Ticket
```typescript
interface Ticket {
  id: string;
  event_id: string;
  type: 'GA' | 'VIP' | 'VVIP' | string;
  price: number;
  quantity_available: number;
  quantity_sold: number;
  description?: string;
  benefits?: string[];
  is_available: boolean;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  ticket_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_reference?: string;
  created_at: string;
  updated_at: string;
}
```

### AuthUser
```typescript
interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'user' | 'organizer' | 'admin';
}
```

### Category
```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color_hex?: string;
}
```

---

## 🔄 Common Usage Patterns

### Getting User Profile with Bookings
```typescript
// In React component
const { user } = useAuth();

useEffect(() => {
  if (!user) return;
  
  const fetchBookings = async () => {
    const bookings = await BookingService.getUserBookings(user.id);
    setUserBookings(bookings);
  };
  
  fetchBookings();
}, [user]);
```

### Creating a Booking
```typescript
const handleBookEvent = async (eventId: string, ticketId: string, quantity: number) => {
  try {
    const ticket = await getTicketById(ticketId);
    const totalPrice = ticket.price * quantity;
    
    const booking = await BookingService.createBooking(
      user.id,
      eventId,
      ticketId,
      quantity,
      totalPrice
    );
    
    if (booking) {
      navigate(`/booking-confirmation/${booking.id}`);
    }
  } catch (error) {
    console.error('Booking failed:', error);
  }
};
```

### Real-time Auth Updates
```typescript
useEffect(() => {
  const subscription = AuthService.onAuthStateChange((user) => {
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  });
  
  return () => {
    subscription?.unsubscribe();
  };
}, []);
```

### Search and Filter Events
```typescript
const handleSearch = async (searchTerm: string) => {
  const results = await EventService.searchEvents(searchTerm);
  setSearchResults(results);
};

const handleCategoryFilter = async (category: string) => {
  const events = await EventService.getByCategory(category);
  setFilteredEvents(events);
};
```

---

## 🚨 Error Handling

### Best Practices
```typescript
// Always wrap API calls in try-catch
try {
  const event = await EventService.getEventById(id);
  setEvent(event);
} catch (error) {
  console.error('Failed to fetch event:', error);
  setError('Unable to load event details');
}

// Check for Supabase-specific errors
if (error?.code === 'PGRST116') {
  // Not found error
} else if (error?.code === 'PGRST301') {
  // Unauthorized error
}
```

### Common Error Codes
```
PGRST116: No rows returned
PGRST301: Unauthorized
PGRST405: Method not allowed
PGRST406: Not acceptable
```

---

## 🔐 Authentication Flow

### Sign Up Flow
```
1. User fills signup form
2. AuthService.signup() called
3. Supabase creates auth user
4. User profile created in user_profiles table
5. User auto-logged in
6. Redirect to home
```

### Login Flow
```
1. User enters email/password
2. AuthService.login() called
3. Supabase validates credentials
4. Session token created
5. User data fetched from user_profiles
6. AuthContext updated
7. Redirect to previous page or home
```

### Protected Routes
```
1. AuthGuard component checks auth state
2. If not logged in, redirect to /login
3. If loading, show spinner
4. If authenticated, render protected component
```

---

## 📊 Performance Optimization

### Database Queries
- Use `.select()` to limit columns
- Always include `LEFT JOIN` for optional relationships
- Use `.limit()` to paginate large datasets
- Create indexes on frequently filtered columns (already done)

### Frontend Caching
```typescript
// Use React Query or similar for caching
import { useQuery } from '@tanstack/react-query';

const { data: events, isLoading } = useQuery({
  queryKey: ['trending-events'],
  queryFn: EventService.getTrending,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Image Optimization
- Use image CDN with responsive sizes
- Lazy load images below the fold
- Use WebP format with fallbacks
- Optimize file size before upload

---

## 🧪 Testing API Calls

### Using Supabase Studio
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Write and test SQL queries
4. Verify results before implementing in code

### Testing in Browser Console
```javascript
// After app loads
const { supabase } = await import('./services/ApiService.js');

// Test query
const { data, error } = await supabase
  .from('events')
  .select('*')
  .limit(5);
```

---

## 📱 API Rate Limits

- **Supabase Free Tier**: Unlimited queries
- **Real-time Subscriptions**: Up to 100 concurrent connections
- **Storage**: 1GB included

---

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: November 28, 2025  
**Version**: 2.0  
**Status**: ✅ Production Ready

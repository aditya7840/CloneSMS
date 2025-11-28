Product Requirements Document: SortMyScene Clone
1. Project Overview
Product Name: SortMyScene Clone

Description: A nightlife and event discovery platform allowing users to find events, book tickets, and organizers to list events.

Target Audience: Partygoers (Gen Z/Millennials) and Event Organizers.

2. Core Features (MVP)
Event Discovery (Home):
Hero carousel with trending events.
Filterable grid (City, Genre, Date).
Event Cards with image, title, venue, price, and date.
Event Details:
Detailed view with description, lineup, location map, and ticket selection.
Booking System:
Ticket quantity selection.
Checkout flow (UI only for MVP).
User Auth:
Login/Signup (Phone/Email).
User Profile (My Tickets).
3. Technical Stack
Frontend: React (Vite), Tailwind CSS, Lucide React (Icons).
Backend/DB: Supabase (PostgreSQL + Auth + Edge Functions).
Hosting: Vercel.
4. Database Schema (Supabase)
Users: id, email, full_name, phone, role (user/organizer).
Events: id, title, description, venue, city, start_time, end_time, image_url, lowest_price.
Tickets: id, event_id, name (e.g., VIP, GA), price, quantity_available.
Bookings: id, user_id, event_id, ticket_type, status, created_at.
5. API Endpoints (Planned)
GET /rest/v1/events: Fetch all events.
GET /rest/v1/events?id=eq.{id}: Fetch single event details.
POST /rest/v1/bookings: Create a new booking.
GET /auth/v1/user: Get current user session.
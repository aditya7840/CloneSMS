import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './ComponentNavbar';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/UI/AuthGuard';

// Pages
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { MyList } from './pages/MyList';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { EventDetail } from './pages/EventDetail';
import { Checkout } from './pages/Checkout';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { UserProfile } from './pages/UserProfile';

function AppRoutes() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-white font-sans overflow-x-hidden selection:bg-primary selection:text-white">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          
          {/* Protected Routes */}
          <Route
            path="/checkout/:eventId"
            element={
              <AuthGuard>
                <Checkout />
              </AuthGuard>
            }
          />
          <Route
            path="/booking-confirmation/:eventId"
            element={
              <AuthGuard>
                <BookingConfirmation />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            }
          />
        </Routes>

        <footer className="py-12 px-4 md:px-12 border-t border-gray-800 text-gray-500 text-sm">
          <p>&copy; 2024 SceneFlix. Built for education.</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default AppRoutes;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BookingService } from '../services/BookingService';

interface Booking {
  id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  status: string;
  total_price: number;
  quantity: number;
  created_at: string;
}

export const UserProfile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        // Note: This would require the BookingService.getUserBookings() to be called
        // For now, we'll show a placeholder
        setBookings([]);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await updateProfile({ full_name: fullName, phone });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-white pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center mx-auto">
                <span className="text-4xl font-bold">
                  {(fullName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{fullName || 'User'}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-3 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-pink-500 hover:text-pink-400"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-semibold">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white font-semibold">{phone || 'Not added'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Address</p>
                        <p className="text-white font-semibold">{address || 'Not added'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bookings History */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Booking History</h3>

              {loading ? (
                <p className="text-gray-400">Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No bookings yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="text-pink-500 hover:text-pink-400 font-semibold"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-neutral-800 border border-white/10 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{booking.event_name}</p>
                        <p className="text-sm text-gray-400">{booking.event_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-500">₹{booking.total_price}</p>
                        <p className="text-sm text-gray-400">{booking.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

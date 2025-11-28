import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Checkout: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ticketType = searchParams.get('ticketType') || 'GA';
  const quantity = parseInt(searchParams.get('quantity') || '1');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleConfirmBooking = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      // For now, just simulate booking creation
      const bookingData = {
        user_id: user.id,
        event_id: eventId,
        ticket_id: `ticket_${ticketType}`,
        quantity,
        total_price: quantity * 500,
      };

      navigate(`/booking-confirmation/${eventId}`, { state: bookingData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pt-20 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Order Summary</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Ticket Type:</span>
              <span className="text-white font-semibold">{ticketType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white font-semibold">{quantity}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-pink-500">
                ₹{quantity * 500}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all"
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

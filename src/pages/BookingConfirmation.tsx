import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2 } from 'lucide-react';

export const BookingConfirmation = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [bookingId] = useState(() => `BKG${Date.now()}`);

  return (
    <div className="min-h-screen bg-background text-white pt-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <CheckCircle className="w-24 h-24 text-green-500" />
        </div>

        <h1 className="text-4xl font-black mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-8">Your event ticket has been booked</p>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 space-y-6 mb-8">
          <div>
            <p className="text-gray-400 mb-2">Booking ID</p>
            <p className="text-2xl font-bold text-pink-500">{bookingId}</p>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all">
              <Download className="w-5 h-5" />
              Download Ticket
            </button>

            <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all">
              <Share2 className="w-5 h-5" />
              Share Booking
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/my-list')}
          className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-bold py-4 rounded-lg transition-all"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

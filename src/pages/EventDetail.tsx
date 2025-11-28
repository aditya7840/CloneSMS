import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Heart, Share2, Loader2 } from 'lucide-react';
import { EventService, Event } from '../services/ApiService';
import { BookingService } from '../services/BookingService';
import { BookmarkService } from '../BookmarkService';
import { useAuth } from '../hooks/useAuth';

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [ticketType, setTicketType] = useState('GA');
  const [quantity, setQuantity] = useState(1);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const eventData = await EventService.getEventById(id);
        setEvent(eventData);
        setIsBookmarked(BookmarkService.isBookmarked(id));

        const ticketsData = await BookingService.getEventTickets(id);
        setTickets(ticketsData);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookmarkClick = () => {
    if (!event) return;
    const newState = BookmarkService.toggleBookmark(event);
    setIsBookmarked(newState);
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${id}?ticketType=${ticketType}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Event not found</p>
        </div>
      </div>
    );
  }

  const selectedTicket = tickets.find((t) => t.type === ticketType);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  return (
    <div className="min-h-screen bg-background text-white pt-20">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={event.hero_image || event.cover_image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${
              isBookmarked ? 'fill-pink-500 text-pink-500' : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              {event.category && (
                <span className="inline-block px-3 py-1 bg-pink-600/20 text-pink-400 text-sm font-bold rounded-full mb-3">
                  {event.category.name}
                </span>
              )}
              <h1 className="text-5xl font-black leading-tight">{event.title}</h1>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.start_time && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="text-white font-semibold">
                      {new Date(event.start_time).toLocaleDateString()}{' '}
                      {new Date(event.start_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {event.venue && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Venue</p>
                    <p className="text-white font-semibold">{event.venue.name}</p>
                    <p className="text-gray-400 text-sm">{event.venue.city}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Starting from</p>
                  <p className="text-white font-semibold">₹{event.price_start}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Social Sharing */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
                Share Event
              </button>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-6 sticky top-24">
              {/* Price */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Starting from</p>
                <p className="text-4xl font-black text-pink-500">
                  ₹{event.price_start}
                </p>
              </div>

              {/* Ticket Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Ticket Type
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                >
                  {tickets.map((t) => (
                    <option key={t.id} value={t.type}>
                      {t.type} - ₹{t.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold text-pink-500">
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {user ? 'Book Now' : 'Sign in to Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

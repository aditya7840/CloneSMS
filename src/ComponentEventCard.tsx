import React, { useState } from 'react';
import { Heart, MapPin, Music } from 'lucide-react';
import { Event } from './ApiService';
import { BookmarkService } from './BookmarkService';

interface EventCardProps {
  event: Event;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isBookmarked: initialBookmarked = false, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || BookmarkService.isBookmarked(event.id));

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = BookmarkService.toggleBookmark(event);
    setIsBookmarked(newState);
    if (onBookmarkToggle) {
      onBookmarkToggle();
    }
  };

  const dateObj = new Date(event.start_time);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const day = dateObj.getDate();

  return (
    <div className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={event.cover_image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
          {event.category?.name || 'Event'}
        </div>
        
        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur border border-white/10 rounded-lg p-2 text-center min-w-[50px]">
          <div className="text-xs text-gray-300 uppercase">{month}</div>
          <div className="text-xl font-bold text-white leading-none">{day}</div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:border-pink-500/50 transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isBookmarked ? 'fill-pink-500 text-pink-500' : 'text-gray-300 hover:text-pink-500'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-pink-500 transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center text-gray-400 text-sm mb-4 space-x-4">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {event.venue?.city || 'City'}
          </div>
          <div className="flex items-center">
            <Music className="w-3 h-3 mr-1" />
            {event.venue?.name || 'Venue'}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Starting from</span>
            <span className="text-white font-bold">₹{event.price_start || 0}</span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

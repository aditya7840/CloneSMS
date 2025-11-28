import React from 'react';
import { Play, Info, Heart } from 'lucide-react';
import { Event } from './ApiService';
import { BookmarkService } from './BookmarkService';
import { useState } from 'react';

interface HeroProps {
  event: Event | null;
}

export const Hero = ({ event }: HeroProps) => {
  const [isBookmarked, setIsBookmarked] = useState(
    event ? BookmarkService.isBookmarked(event.id) : false
  );

  if (!event) return (
    <div className="h-[80vh] w-full bg-surface animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading Featured Content...</p>
    </div>
  );

  const handleBookmarkClick = () => {
    const newState = BookmarkService.toggleBookmark(event);
    setIsBookmarked(newState);
  };

  return (
    <div className="relative h-[85vh] w-full text-white overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={event.hero_image || event.cover_image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-[30%] left-4 md:left-12 max-w-2xl z-10 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm">
           <span>{event.category?.name || 'Event'}</span>
           <span className="w-1 h-1 rounded-full bg-white"></span>
           <span>Trending #1</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black leading-none drop-shadow-2xl">
          {event.title}
        </h1>
        
        <p className="text-lg text-gray-300 line-clamp-2 drop-shadow-md">
          {event.description}
        </p>

        <div className="flex items-center gap-4 pt-4">
          <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-white/90 transition-colors text-lg">
            <Play className="w-6 h-6 fill-current" /> Book Now
          </button>
          <button className="flex items-center gap-2 bg-gray-500/30 backdrop-blur-md text-white px-8 py-3 rounded font-bold hover:bg-gray-500/40 transition-colors text-lg border border-white/20">
            <Info className="w-6 h-6" /> More Info
          </button>
          <button 
            onClick={handleBookmarkClick}
            className="flex items-center gap-2 bg-pink-600/30 backdrop-blur-md text-white px-6 py-3 rounded font-bold hover:bg-pink-600/50 transition-colors text-lg border border-pink-500/20"
          >
            <Heart className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} /> 
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
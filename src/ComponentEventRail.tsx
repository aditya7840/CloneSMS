import React from 'react';
import { ChevronRight, MapPin, Heart } from 'lucide-react';
import { Event } from './ApiService';
import { BookmarkService } from './BookmarkService';
import { format } from 'date-fns';
import { useState } from 'react';

interface RailProps {
  title: string;
  events: Event[];
}

export const EventRail = ({ title, events }: RailProps) => {
  return (
    <div className="py-8 pl-4 md:pl-12 group">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer">
        {title} <span className="text-sm text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">Explore All <ChevronRight className="w-4 h-4" /></span>
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {events.map((event) => {
          const [isBookmarked, setIsBookmarked] = React.useState(BookmarkService.isBookmarked(event.id));

          const handleBookmarkClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = BookmarkService.toggleBookmark(event);
            setIsBookmarked(newState);
          };

          return (
            <div 
              key={event.id}
              className="flex-none w-[200px] md:w-[280px] bg-surface rounded-md overflow-hidden hover:scale-105 hover:z-20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/20 group/card relative"
            >
              <div className="aspect-[16/9] overflow-hidden">
                 <img 
                   src={event.cover_image} 
                   alt={event.title}
                   className="w-full h-full object-cover"
                 />
              </div>
              
              <div className="p-4">
                 <div className="flex items-center justify-between text-xs text-green-400 font-bold mb-2">
                   <span>{event.price_start > 0 ? `₹${event.price_start}` : 'Free'}</span>
                   <span className="text-gray-400 font-normal">
                     {event.start_time ? format(new Date(event.start_time), 'MMM d') : 'TBA'}
                   </span>
                 </div>
                 <h3 className="text-white font-bold truncate mb-1">{event.title}</h3>
                 <p className="text-gray-400 text-xs flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> {event.venue?.city || 'City'}
                 </p>
              </div>
              
              <button
                onClick={handleBookmarkClick}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:border-pink-500/50 transition-all opacity-0 group-hover/card:opacity-100"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isBookmarked ? 'fill-pink-500 text-pink-500' : 'text-gray-300 hover:text-pink-500'
                  }`}
                />
              </button>

              <div className="absolute inset-0 border-2 border-transparent group-hover/card:border-primary rounded-md pointer-events-none transition-colors"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
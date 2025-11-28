import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { BookmarkService } from '../BookmarkService';
import { Event } from '../ApiService';
import { EventCard } from '../ComponentEventCard';

export const MyList = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const bookmarks = BookmarkService.getBookmarks();
    setBookmarkedEvents(bookmarks);
  }, []);

  const handleRemoveBookmark = (eventId: number) => {
    BookmarkService.removeBookmark(eventId);
    setBookmarkedEvents(BookmarkService.getBookmarks());
  };

  return (
    <main className="min-h-screen bg-background text-white pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <a href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-4xl font-bold">My List</h1>
        </div>

        {bookmarkedEvents.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No bookmarked events yet.</p>
            <p className="text-gray-500 text-sm mt-2">Click the heart icon on events to add them to your list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarkedEvents.map((event) => (
              <div key={event.id} className="relative">
                <EventCard event={event} isBookmarked={true} onBookmarkToggle={() => handleRemoveBookmark(event.id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

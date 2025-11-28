// --- BOOKMARK/MY LIST SERVICE (Using localStorage) ---
import { Event } from './ApiService';

const BOOKMARKS_KEY = 'sceneflix_bookmarks';

export const BookmarkService = {
  // Get all bookmarked events
  getBookmarks(): Event[] {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  },

  // Add event to bookmarks
  addBookmark(event: Event): void {
    try {
      const bookmarks = this.getBookmarks();
      if (!bookmarks.find(b => b.id === event.id)) {
        bookmarks.push(event);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  // Remove event from bookmarks
  removeBookmark(eventId: number): void {
    try {
      const bookmarks = this.getBookmarks();
      const filtered = bookmarks.filter(b => b.id !== eventId);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  // Check if event is bookmarked
  isBookmarked(eventId: number): boolean {
    return this.getBookmarks().some(b => b.id === eventId);
  },

  // Toggle bookmark
  toggleBookmark(event: Event): boolean {
    if (this.isBookmarked(event.id)) {
      this.removeBookmark(event.id);
      return false;
    } else {
      this.addBookmark(event);
      return true;
    }
  }
};

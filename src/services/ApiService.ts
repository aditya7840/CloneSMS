import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase keys not configured. Using mock data only.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// --- TYPES ---
export interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  price_start: number;
  cover_image: string;
  hero_image?: string;
  venue?: {
    name: string;
    city: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  is_trending: boolean;
}

// --- API METHODS ---
export const EventService = {
  async getTrending() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(name, city),
        category:categories(name, slug)
      `)
      .eq('is_trending', true)
      .limit(5);
    
    if (error) {
      console.error("Error fetching trending:", error);
      return [];
    }
    return data as Event[];
  },

  async getByCategory(slug: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(name, city),
        category:categories!inner(name, slug)
      `)
      .eq('category.slug', slug)
      .limit(10);

    if (error) {
      console.error(`Error fetching category ${slug}:`, error);
      return [];
    }
    return data as Event[];
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }
    return data as Event;
  },

  async searchEvents(query: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(name, city),
        category:categories(name, slug)
      `)
      .ilike('title', `%${query}%`)
      .limit(20);

    if (error) {
      console.error("Error searching events:", error);
      return [];
    }
    return data as Event[];
  }
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  ticket_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  event?: any;
}

export const BookingService = {
  // Create a new booking
  async createBooking(
    userId: string,
    eventId: string,
    ticketId: string,
    quantity: number,
    totalPrice: number
  ) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          event_id: eventId,
          ticket_id: ticketId,
          quantity,
          total_price: totalPrice,
          status: 'confirmed',
        })
        .select();

      if (error) throw error;
      return { booking: data?.[0], error: null };
    } catch (error) {
      console.error('Create booking error:', error);
      return { booking: null, error };
    }
  },

  // Get user bookings
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, event:events(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user bookings error:', error);
      return [];
    }
  },

  // Get single booking
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, event:events(*)')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get booking error:', error);
      return null;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Update booking status error:', error);
      return { error };
    }
  },

  // Cancel booking
  async cancelBooking(bookingId: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Cancel booking error:', error);
      return { error };
    }
  },

  // Get event tickets
  async getEventTickets(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get event tickets error:', error);
      return [];
    }
  },
};

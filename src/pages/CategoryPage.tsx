import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { EventService, Event } from '../ApiService';
import { EventRail } from '../ComponentEventRail';

export const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!category) return;
      setLoading(true);
      setEvents([]);
      try {
        const data = await EventService.getByCategory(category.toLowerCase());
        setEvents(data || []);
      } catch (error) {
        console.error(`Failed to load ${category} events:`, error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary pt-20">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <a href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-4xl font-bold capitalize">{category}</h1>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No events found for this category.</p>
          </div>
        ) : (
          <EventRail title={`All ${category} Events`} events={events} />
        )}
      </div>
    </main>
  );
};

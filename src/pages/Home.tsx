import React, { useState, useEffect } from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { Hero } from '../ComponentHero';
import { EventRail } from '../ComponentEventRail';
import { EventService, Event } from '../ApiService';

export const Home = () => {
  const [trending, setTrending] = useState<Event | null>(null);
  const [technoEvents, setTechnoEvents] = useState<Event[]>([]);
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendData, technoData, liveData] = await Promise.all([
          EventService.getTrending(),
          EventService.getByCategory('techno'),
          EventService.getByCategory('live')
        ]);

        if (trendData && trendData.length > 0) setTrending(trendData[0]);
        setTechnoEvents(technoData || []);
        setLiveEvents(liveData || []);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <main className="pb-20">
      <Hero event={trending} />
      
      <div className="relative z-20 -mt-24 md:-mt-32 space-y-8">
        <EventRail title="Techno & House" events={technoEvents} />
        <EventRail title="Live Concerts" events={liveEvents} />
        <EventRail title="Trending Now" events={[...technoEvents, ...liveEvents].slice(0, 10)} />
      </div>
    </main>
  );
};

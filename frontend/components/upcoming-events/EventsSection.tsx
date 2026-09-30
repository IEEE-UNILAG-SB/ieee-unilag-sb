'use client'
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { EventCardType } from "@/lib/types";
import { fetchLatestEvents, EventData } from "@/lib/api";

export function mapEventToCardType(event: EventData): EventCardType {
  return {
    id: event._id,
    image: event.banner_url,
    title: event.header,
    description: event.body,
    date: event.date,
    createdAt: event.createdAt,
    location: event.location,
    registration_link: event.registration_link,
  };
}

export const EventsSection = () => {
  const [events, setEvents] = useState<EventCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLatestEvents();
        if (!cancelled) {
          setEvents(data.map(mapEventToCardType));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load events");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();
    return () => { cancelled = true; };
  }, []);

  const handleViewMore = () => {
    window.location.href = "/events";
  };

  if (loading) {
    return (
      <section id="events" className="font-space w-full py-20 lg:pt-8 px-6 md:px-12 lg:px-17 scroll-mt-24 bg-[#1E293B] text-white flex flex-col gap-y-15 lg:gap-y-24 justify-between items-center">
        <div className="flex w-full justify-center lg:justify-between items-center">
          <h1 className="font-bold text-3xl">Upcoming Events</h1>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-y-11.25 lg:gap-x-11.25">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-[30px] w-full h-64 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="font-space w-full py-20 lg:pt-8 px-6 md:px-12 lg:px-17 scroll-mt-24 bg-[#1E293B] text-white flex flex-col gap-y-15 lg:gap-y-24 justify-between items-center">
        <div className="flex w-full justify-center lg:justify-between items-center">
          <h1 className="font-bold text-3xl">Upcoming Events</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400 text-lg">{error}</p>
          <p className="text-white/60 mt-2">Please try again later.</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="events" className="font-space w-full py-20 lg:pt-8 px-6 md:px-12 lg:px-17 scroll-mt-24 bg-[#1E293B] text-white flex flex-col gap-y-15 lg:gap-y-24 justify-between items-center">
        <div className="flex w-full justify-center lg:justify-between items-center">
          <h1 className="font-bold text-3xl">Upcoming Events</h1>
        </div>
        <p className="text-white/60 text-center py-12">No upcoming events at the moment. Check back soon!</p>
      </section>
    );
  }

  return (
    <section id="events" className="font-space w-full py-20 lg:pt-8 px-6 md:px-12 lg:px-17 scroll-mt-24 bg-[#1E293B] text-white flex flex-col gap-y-15 lg:gap-y-24 justify-between items-center">
      <div className="flex w-full justify-center lg:justify-between items-center">
        <h1 className="font-bold text-3xl">Upcoming Events</h1>
        <button
          type="button"
          className="font-space font-medium hidden lg:block lg:text-[20px] text-[#00D9FF]"
          onClick={handleViewMore}>
          View all Events
        </button>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-y-11.25 lg:gap-x-11.25">
        {events.map((event) => (
          <EventCard
            key={event.id}
            data={event}
          />
        ))}
      </div>

      <button
        type="button"
        className="font-space font-medium lg:hidden text-[#00D9FF]"
        onClick={handleViewMore}>
        View all Events
      </button>
    </section>
  );
}

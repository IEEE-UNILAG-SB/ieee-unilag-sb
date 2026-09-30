"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EventCard from "@/components/upcoming-events/EventCard";
import { mapEventToCardType } from "@/components/upcoming-events/EventsSection";
import { fetchAllEvents } from "@/lib/api";
import { EventCardType } from "@/lib/types";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 9;

export default function EventsPage() {
  const [events, setEvents] = useState<EventCardType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllEvents(page, PAGE_SIZE);
        if (!cancelled) {
          setEvents(response.data.map(mapEventToCardType));
          setTotalPages(response.pagination.totalPages || 1);
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
  }, [page]);

  return (
    <div className="min-h-screen bg-[#1E293B] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Link href="/#events" className="text-[#00D9FF] hover:underline text-sm">
          &larr; Back to home
        </Link>
        <h1 className="font-space font-bold text-3xl md:text-4xl mt-4 mb-2">All Events</h1>
        <p className="text-white/60 mb-10">Upcoming, ongoing and past IEEE UNILAG events.</p>

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 rounded-[30px] w-full h-64 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <p className="text-white/60 mt-2">Please try again later.</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-white/60 text-center py-12">No events found. Check back soon!</p>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} data={event} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full"
              >
                Previous
              </Button>
              <span className="text-sm text-white/60">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

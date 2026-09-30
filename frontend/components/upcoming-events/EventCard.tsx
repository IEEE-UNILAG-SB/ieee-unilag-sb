'use client'
import Image from "next/image";
import { MapPin, ArrowRight, CalendarDays } from "lucide-react"
import { EventCardType, EventsSectionProps } from "@/lib/types"

// Explicit locale + UTC timezone keep server and client rendering identical (no hydration mismatch).
function formatEventDate(value?: string): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;
  return new Date(time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const EventCard = ( {data}: EventsSectionProps) => {
  const eventDate = formatEventDate(data.date ?? data.createdAt);
  return (
    <article className="bg-white flex flex-col justify-between gap-y-3.5 p-5 rounded-[30px] w-full h-auto">
      <section className="flex flex-col gap-y-3.5">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-4xl">
          <Image
            src={data.image}
            alt={data.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <h2 className="font-inter text-[18px] font-medium text-[#475569]">{data.title}</h2>
          <p className="font-inter text-[12px] text-[#475569]">{data.description}</p>
        </div>
      </section>
      <section className="flex flex-col gap-y-[7.5px]">
        {eventDate && (
          <div className="flex items-center gap-x-2">
            <CalendarDays className="text-[#00629B]" />
            <span className="font-inter text-[12px] font-medium text-[#00629B]">{eventDate}</span>
          </div>
        )}
        <div className="flex items-center gap-x-2">
          <MapPin className="fill-[#00629B]" />
          <span className="font-inter text-[12px] font-medium text-[#00629B]">{data.location}</span>
        </div>
        <a
          href={data.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#025BA2] flex w-fit py-4 px-5 rounded-[99px] gap-x-7.5 items-center hover:bg-[#0368b8] transition-colors"
        >
          <span className="font-inter text-[18px] font-medium">Register Now</span>
          <ArrowRight className="" />
        </a>
      </section>
    </article>
  )
}

export default EventCard

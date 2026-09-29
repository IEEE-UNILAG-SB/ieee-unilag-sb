'use client'
import { MapPin, ArrowRight } from "lucide-react"
import { EventCardType, EventsSectionProps } from "@/lib/types"

const EventCard = ( {data}: EventsSectionProps) => {
  return (
    <article className="bg-white flex flex-col justify-between gap-y-3.5 p-5 rounded-[30px] w-full h-auto">
      <section className="flex flex-col gap-y-3.5">
        <img
        className="rounded-t-4xl"
        src={data.image} 
        alt="event-image" />
        <div className="flex flex-col gap-y-2">
          <h2 className="font-inter text-[18px] font-medium text-[#475569]">{data.title}</h2>
          <p className="font-inter text-[12px] text-[#475569]">{data.description}</p>
        </div>
      </section>
      <section className="flex flex-col gap-y-[7.5px]">
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
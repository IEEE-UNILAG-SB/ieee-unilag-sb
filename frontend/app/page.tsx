"use client";
import { EventsSection } from "../components/upcoming-events/EventsSection";
import { Footer } from "@/components/footer";
import { NewsletterSection } from "@/components/newsletter-section";
import { JoinSection } from "@/components/join-section";
import Stats from "@/components/Stats";
import WWA from "@/components/WWA";
import Spotlight from "@/components/spotlight";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import  * as React  from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen items-center justify-center font-sans">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      {menuOpen && 
      <div 
        onClick={() => setMenuOpen(false)} 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
      />}
      <main
        inert={menuOpen ? true : undefined}
        className="">
        <Hero />
        <Stats />
        <WWA />
        <EventsSection />
        <Spotlight />
        <JoinSection />
        <NewsletterSection />
        <Footer />
      </main>
    </div>
  );
}

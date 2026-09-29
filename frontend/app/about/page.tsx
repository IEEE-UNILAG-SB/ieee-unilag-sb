"use client";

import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
            About IEEE UNILAG
          </h1>
          <div className="prose prose-lg max-w-none text-[#475569] space-y-6">
            <p className="text-lg leading-relaxed">
              The IEEE Student Branch at the University of Lagos (STB92061) is a premier
              technical community committed to spreading knowledge and fostering the
              all-round development of the student community.
            </p>
            <p className="leading-relaxed">
              With continued emphasis on high-quality events reflecting the latest in
              technology, we aim to create a pool of dedicated industry-oriented
              professionals who will shape the future of engineering in Nigeria and beyond.
            </p>

            <h2 className="text-2xl font-bold text-[#1E293B] mt-12">Our Mission</h2>
            <p className="leading-relaxed">
              To be a premier technical community, committed to the cause of spreading
              knowledge and fostering all-round development of the student community
              through high-quality events, workshops, and projects.
            </p>

            <h2 className="text-2xl font-bold text-[#1E293B] mt-12">What We Do</h2>
            <ul className="list-disc pl-6 space-y-2 text-[#475569]">
              <li>Technical workshops and masterclasses (AI, IoT, embedded systems, product management)</li>
              <li>Hackathons and coding competitions (IEEEXtreme, Build-A-Thon, IES Hackathon)</li>
              <li>Pre-university STEM outreach programs in Lagos secondary schools</li>
              <li>Career fairs and industry networking events</li>
              <li>Annual IEEE Week — our flagship event attracting 500+ students</li>
              <li>Community projects like FoodLink (IoT disaster-resilient communication)</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1E293B] mt-12">Our Achievements</h2>
            <ul className="list-disc pl-6 space-y-2 text-[#475569]">
              <li>1st Prize — IEEE Region 8 Climate Challenge (Bari, Italy, 2024)</li>
              <li>Top 3 Globally — IEEE TEMS Student Case Competition 2025</li>
              <li>IEEE Richard E. Merwin Scholarship recipient</li>
              <li>IEEE IAS Travel Grant recipient (Power Africa Conference, Egypt)</li>
              <li>Multiple IEEEXtreme national rankings</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1E293B] mt-12">Location</h2>
            <p className="leading-relaxed">
              Department of Electrical & Electronics Engineering,<br />
              University of Lagos, Yaba,<br />
              Lagos, Nigeria
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

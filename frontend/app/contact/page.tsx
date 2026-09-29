"use client";

import { motion } from "motion/react";
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-[#475569] mb-12 max-w-2xl">
            Have questions about membership, events, or partnerships? Reach out to us
            through any of the channels below.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Email</h3>
              <a
                href="mailto:ieeeunilagchapter@gmail.com"
                className="text-[#00629B] hover:underline"
              >
                ieeeunilagchapter@gmail.com
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Phone / WhatsApp</h3>
              <a
                href="tel:+2349028847072"
                className="text-[#00629B] hover:underline"
              >
                0902 884 7072
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Location</h3>
              <p className="text-[#475569]">
                Department of Electrical & Electronics Engineering,<br />
                University of Lagos, Yaba, Lagos
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <Instagram className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">Social Media</h3>
              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/ieee_unilag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#00629B] hover:underline"
                >
                  <Instagram className="w-4 h-4" /> @ieee_unilag
                </a>
                <a
                  href="https://www.linkedin.com/company/ieee-unilag-sb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#00629B] hover:underline"
                >
                  <Linkedin className="w-4 h-4" /> IEEE UNILAG SB
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F8FF] rounded-2xl p-8 border border-[#E2E8F0] text-center">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Office Hours</h2>
            <p className="text-[#475569]">
              We don&apos;t have fixed office hours — the best way to reach us is via email
              or Instagram DM. We usually respond within 24 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Access to IEEE Xplore digital library",
  "IEEE Potentials magazine",
  "IEEEXtreme programming competition",
  "Design contests and hackathons",
  "Scholarships and travel grants",
  "Career resources and job board",
  "Networking with 420,000+ professionals",
  "Local chapter events and workshops",
  "Young Professionals pathway",
  "Free website hosting and event funding for branches",
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
            IEEE Membership
          </h1>
          <p className="text-lg text-[#475569] mb-8 max-w-2xl">
            Join the world&apos;s largest technical professional organization. As a student
            at UNILAG, you get access to exclusive benefits, subsidies, and opportunities.
          </p>

          <div className="bg-[#F5F8FF] rounded-2xl p-8 mb-12 border border-[#E2E8F0]">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Student Benefits</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-[#475569]">
                  <Check className="w-5 h-5 text-[#00629B] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0] mb-12">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">How to Join</h2>
            <ol className="list-decimal pl-6 space-y-3 text-[#475569]">
              <li>
                Visit the{" "}
                <a
                  href="https://www.ieee.org/membership/join/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00629B] underline hover:text-[#00527f]"
                >
                  IEEE membership portal
                </a>
              </li>
              <li>Select &quot;Join as a Student Member&quot;</li>
              <li>Search for our branch code: <strong>STB92061</strong></li>
              <li>Complete the form and checkout</li>
              <li>
                The IEEE Nigeria Section subsidizes the exchange rate for students —
                contact the branch for current rates
              </li>
            </ol>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-[#00629B] hover:bg-[#00527f]">
              <a
                href="https://www.ieee.org/membership/join/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join IEEE Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <p className="mt-4 text-sm text-[#64748B]">
              Questions? Email us at{" "}
              <a href="mailto:ieeeunilagchapter@gmail.com" className="text-[#00629B] underline">
                ieeeunilagchapter@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

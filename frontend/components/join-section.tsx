"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Trophy, Globe } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Global Community",
    description: "Join 420,000+ technology and engineering professionals worldwide",
  },
  {
    icon: BookOpen,
    title: "IEEE Xplore",
    description: "Access the largest library of electrical engineering and computer science literature",
  },
  {
    icon: Trophy,
    title: "Competitions & Awards",
    description: "IEEEXtreme, design contests, scholarships, and travel grants",
  },
  {
    icon: Globe,
    title: "Networking",
    description: "Local chapter events, industry connections, and global conferences",
  },
];

export function JoinSection() {
  return (
    <section id="join" className="w-full bg-[#F5F8FF] py-16 md:py-20 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00629B] mb-4">
            Join IEEE UNILAG
          </h2>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto">
            Become a part of the world&apos;s largest technical professional organization.
            Open to all engineering and technology students at the University of Lagos.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00629B]/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-[#00629B]" />
              </div>
              <h3 className="font-semibold text-[#1E293B] mb-2">{benefit.title}</h3>
              <p className="text-sm text-[#64748B]">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0] text-center"
        >
          <h3 className="text-xl font-bold text-[#1E293B] mb-3">How to Join</h3>
          <p className="text-[#64748B] mb-6 max-w-xl mx-auto">
            Visit the IEEE membership portal, select &quot;Student Member&quot;, and search for
            our branch code <strong>STB92061</strong>. The IEEE Nigeria Section subsidizes
            the exchange rate for students.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 bg-[#00629B] hover:bg-[#00527f]">
              <a
                href="https://www.ieee.org/membership/join/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join IEEE
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <a
                href="https://bit.ly/IEEEdatabase"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the Community
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <a href="mailto:ieeeunilagchapter@gmail.com">Contact Us</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

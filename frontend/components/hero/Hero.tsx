"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// interface StatCardProps {
//   value: string;
//   label: string;
//   index: number;
// }

// function StatCard({ value, label, index }: StatCardProps) {
//   return (
//     <motion.div
//       variants={statItemVariants}
//       custom={index}
//       className="flex flex-col items-center justify-center bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
//     >
//       <span className="text-3xl lg:text-4xl font-bold text-primary">
//         {value}
//       </span>
//       <span className="text-sm text-muted-foreground mt-1 text-center">
//         {label}
//       </span>
//     </motion.div>
//   );
// }

export function Hero() {
  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5 -z-10" />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          {/* Left Column - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground"
            >
              Innovating Tomorrow,{" "}
              <span className="text-primary">Together</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              IEEE UNILAG Student Branch connects 500+ engineering minds across
              Nigeria&apos;s tech future through collaborative projects,
              industry partnerships, and global networking opportunities.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button asChild size="lg" className="rounded-full px-8 group">
                <Link href="#join">
                  Join the club
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <Link href="#events">Explore Events</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
              {/* Placeholder - replace with actual hero image */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20" />
              <Image
                src="/hero-image.jpg"
                alt="IEEE UNILAG students collaborating"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-foreground/10 to-transparent" />
            </div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

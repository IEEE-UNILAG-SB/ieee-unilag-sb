
"use client"

import { motion } from "motion/react";

type StatDes = {
  label: string;
  users: string;
}

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.12,
      delayChildren: 0.1,
      duration: 0.5, 
    } 
  }
}

function Stat({ label, users }: StatDes) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      className="font-sans flex flex-col h-44.25 w-full max-w-65 rounded-3xl border-[3px] p-2.5 justify-center text-center border-[#E2E8F0] bg-white"
    >
      <span className="text-[40px] md:text-[56px] font-bold text-[#00629B] leading-none">
        {users}
      </span>
      <span className="text-[16px] md:text-[20px] font-medium text-[#475569] mt-2">
        {label}
      </span>
    </motion.div>
  );
}

export default Stat;
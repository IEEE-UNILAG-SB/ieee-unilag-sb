
"use client"

import { motion } from "motion/react";
import Stat from "./Stat";

type arrayStat = {
  label: string;
  users: string;
}

const statArray: arrayStat[] = [
  { users: "500+",   label: "Active Members" },
  { users: "120+",   label: "Events Annually" },  
  { users: "15",     label: "Technical Societies" },
  { users: "Global", label: "Network Reach" },  
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
}

function Stats() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 items-center py-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {statArray.map((item, index) => (
        <Stat key={index} label={item.label} users={item.users} />
      ))}
    </motion.div>
  )
}

export default Stats;
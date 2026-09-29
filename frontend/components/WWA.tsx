"use client";
import Image from "next/image";
import { motion } from "motion/react";

const ImageArray: string[] = ["10", "3", "4", "13", "14", "9", "17", "15", "12"];

const ArrayText: string[] = [
  "The IEEE University of Lagos Student Branch is a vibrant community of passionate engineering and technology students committed to advancing innovation, fostering professional development, and creating positive impact through technology.",

  "As part of the world's largest technical professional organization, we provide our members with access to cutting-edge research, industry connections, and opportunities to collaborate on projects that solve real-world challenges.",

  "From robotics competitions to AI workshops, hackathons to industry networking events, IEEE UNILAG serves as the bridge between academic excellence and professional success, preparing the next generation of Nigerian tech leaders.",
];

const WWA = () => {
  return (
    <motion.div
      className="flex flex-col xl:flex-row justify-between bg-[#F5F8FF] min-h-159.25 items-center  md:px-20 py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Text Section */}
      <motion.div
        className="font-text text-[#475569] xl:shrink-0 xl:w-151.75"
        initial={{ x: -60, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-[#00629B] text-4xl md:text-5xl font-bold text-center lg:text-left">
          Who We Are
        </div>

        {ArrayText.map((item, index) => {
          return (
            <motion.div
              key={index}
              className="my-6 md:my-8 text-[18px] md:text-[20px] text-center lg:text-left"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
            >
              {item}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-fit shrink-0">
        {ImageArray.map((image, index) => {
          return (
            <motion.div
              key={image}
              className="relative aspect-4/3 w-full md:min-w-45 lg:min-w-40 sm:min-w-45 min-w-35 max-w-55 mx-auto overflow-hidden rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <Image
                src={`/Image-${image}.jpg`}
                alt="IEEE UNILAG"
                fill
                sizes="(max-width: 640px) 45vw, 180px"
                className="object-cover"
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WWA;

import "dotenv/config";
import mongoose from "mongoose";
import Event from "../models/events";

const sampleEvents = [
  {
    header: "AI & Machine Learning Workshop",
    body: "Dive deep into neural networks, deep learning frameworks, and practical AI applications with industry experts from leading tech companies.",
    date: new Date("2026-10-15T10:00:00.000Z"),
    location: "Engineering Complex, UNILAG",
    banner_url: "/Events/images/event1.png",
    registration_link: "https://forms.google.com/ai-workshop",
  },
  {
    header: "IoT Innovation Challenge",
    body: "48-hour hackathon focused on building smart city solutions using IoT sensors, edge computing, and cloud platforms.",
    date: new Date("2026-11-07T09:00:00.000Z"),
    location: "Innovation Hub, UNILAG",
    banner_url: "/Events/images/event2.png",
    registration_link: "https://forms.google.com/iot-challenge",
  },
  {
    header: "Career Tech Fair",
    body: "Connect with top tech companies, explore internship opportunities, and learn about career paths in engineering and technology.",
    date: new Date("2026-11-21T10:00:00.000Z"),
    location: "Engineering Auditorium",
    banner_url: "/Events/images/event3.png",
    registration_link: "https://forms.google.com/career-fair",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    await Event.deleteMany({});
    console.log("Cleared existing events");

    await Event.insertMany(sampleEvents);
    console.log(`Seeded ${sampleEvents.length} events`);

    await mongoose.disconnect();
    console.log("Done");
  } catch (err: any) {
    console.error(`Seed failed: ${err.message}`);
    process.exit(1);
  }
}

seed();

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvents extends Document {
    header: string;
    body: string;
    date: Date;
    location: string;
    banner_url: string;
    registration_link: string
}

const eventsSchema: Schema = new Schema(
    {
        header: { type: String, required: true },
        body: { type: String, required: true },
        date: { type: Date, required: [true, "Event date is required"] },
        location: { type: String, required: true, default: "to be determined!" },
        banner_url: {
          type: String,
          required: true,
          validate: {
            validator: (value: string): boolean => {
              if (typeof value !== "string" || value.startsWith("//")) {
                return false;
              }
              if (value.startsWith("/")) {
                return true;
              }
              try {
                return new URL(value).protocol === "https:";
              } catch {
                return false;
              }
            },
            message: "banner_url must be a site-relative path or an https URL",
          },
        },
        registration_link: {
          type: String,
          required: true,
          validate: {
            validator: (value: string): boolean => {
              try {
                return new URL(value).protocol === "https:";
              } catch {
                return false;
              }
            },
            message: "registration_link must be an https URL",
          },
        },
    },
    { timestamps: true },
);

const Events: Model<IEvents> = mongoose.model<IEvents>(
    "Events",
    eventsSchema,
);

export default Events;

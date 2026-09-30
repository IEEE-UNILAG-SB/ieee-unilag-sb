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
        banner_url: { type: String, required: true, },
        registration_link: { type: String, required: true }
    },
    { timestamps: true },
);

const Events: Model<IEvents> = mongoose.model<IEvents>(
    "Events",
    eventsSchema,
);

export default Events;

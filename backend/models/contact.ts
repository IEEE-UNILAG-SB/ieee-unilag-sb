import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const contactMessageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must be under 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [150, "Subject must be under 150 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message must be under 2000 characters"],
    },
  },
  { timestamps: true },
);

const ContactMessage: Model<IContactMessage> = mongoose.model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema,
);

export default ContactMessage;

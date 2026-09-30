import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ContactMessage from "../models/contact";

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
export const sendMessage = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email and message are required" });
  }

  try {
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });
    return res.status(201).json({
      success: true,
      data: contactMessage,
      message: "Message received! We usually respond within 24 hours.",
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

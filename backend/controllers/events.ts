import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Event from "../models/events";

const ALLOWED_UPDATE_FIELDS = ["header", "body", "date", "location", "banner_url", "registration_link"] as const;

export const getLatestEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).limit(3);
        if (!events) {
            return res.status(404).json({ message: "Events not found", data: null });
        }
        return res.status(200).json({ message: "Events fetched successfully", data: events });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch events", data: null });
    }
}

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawPage = req.query.page as string | undefined;
        const rawLimit = req.query.limit as string | undefined;
        const page = rawPage === undefined ? 1 : Number(rawPage);
        const limit = rawLimit === undefined ? 10 : Number(rawLimit);
        if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
            return res.status(400).json({ message: "Invalid pagination parameters. page must be an integer >= 1 and limit must be an integer between 1 and 50", data: null });
        }
        const skip = (page - 1) * limit;

        const [events, total] = await Promise.all([
            Event.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Event.countDocuments()
        ]);

        return res.status(200).json({
            message: "Events fetched successfully",
            data: events,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch events", data: null });
    }
}

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, data: null });
    }
    try {
        const { header, body, date, location, banner_url, registration_link } = req.body;
        if (!header || !body || !date || !location || !banner_url || !registration_link) {
            return res.status(400).json({ message: "header, body, date, location, banner_url and registration_link are required", data: null });
        }
        const newEvent = new Event({ header, body, date, location, banner_url, registration_link });
        await newEvent.save();
        return res.status(201).json({ message: "Event created successfully", data: newEvent });
    } catch (error: any) {
        if (error?.name === "ValidationError") {
            return res.status(400).json({ message: error.message, data: null });
        }
        return res.status(500).json({ message: "Failed to create event", data: null });
    }
}

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, data: null });
    }
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid event id", data: null });
        }
        const update: Record<string, unknown> = {};
        for (const field of ALLOWED_UPDATE_FIELDS) {
            if (req.body[field] !== undefined) {
                update[field] = req.body[field];
            }
        }
        const updatedEvent = await Event.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", data: null });
        }
        return res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
    } catch (error: any) {
        if (error?.name === "ValidationError") {
            return res.status(400).json({ message: error.message, data: null });
        }
        return res.status(500).json({ message: "Failed to update event", data: null });
    }
}

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid event id", data: null });
        }
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found", data: null });
        }
        return res.status(200).json({ message: "Event deleted successfully", data: null });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete event", data: null });
    }
}

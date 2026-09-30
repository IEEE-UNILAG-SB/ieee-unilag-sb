import { NextFunction, Request, Response } from "express";
import Event from "../models/events";

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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
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
    try {
        const { header, body, date, location, banner_url, registration_link } = req.body;
        if (!header || !body || !date || !location || !banner_url || !registration_link) {
            return res.status(400).json({ message: "header, body, date, location, banner_url and registration_link are required", data: null });
        }
        const newEvent = new Event({ header, body, date, location, banner_url, registration_link });
        await newEvent.save();
        return res.status(201).json({ message: "Event created successfully", data: newEvent });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create event", data: null });
    }
}

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { header, body, date, location, banner_url, registration_link } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(id, { header, body, date, location, banner_url, registration_link }, { new: true, runValidators: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", data: null });
        }
        return res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update event", data: null });
    }
}

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found", data: null });
        }
        return res.status(200).json({ message: "Event deleted successfully", data: null });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete event", data: null });
    }
}

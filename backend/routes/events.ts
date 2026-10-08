import { Router } from "express";
import { body } from "express-validator";

import { getLatestEvents, getAllEvents, createEvent, updateEvent, deleteEvent } from "../controllers/events";
import { requireAdmin } from "../middleware/requireAdmin";

const isValidBannerUrl = (value: string): boolean => {
    if (value.startsWith("//")) {
        return false;
    }
    if (value.startsWith("/")) {
        return true;
    }
    try {
        const parsed = new URL(value);
        return parsed.protocol === "https:";
    } catch {
        return false;
    }
};

const createEventValidators = [
    body("header")
        .trim()
        .notEmpty()
        .withMessage("header is required")
        .isLength({ max: 200 })
        .withMessage("header must be under 200 characters"),
    body("body")
        .trim()
        .notEmpty()
        .withMessage("body is required")
        .isLength({ max: 5000 })
        .withMessage("body must be under 5000 characters"),
    body("location")
        .trim()
        .notEmpty()
        .withMessage("location is required")
        .isLength({ max: 200 })
        .withMessage("location must be under 200 characters"),
    body("date")
        .notEmpty()
        .withMessage("date is required")
        .isISO8601()
        .withMessage("date must be a valid ISO 8601 date"),
    body("registration_link")
        .notEmpty()
        .withMessage("registration_link is required")
        .isURL({ protocols: ["https"], require_protocol: true })
        .withMessage("registration_link must be a valid https URL"),
    body("banner_url")
        .notEmpty()
        .withMessage("banner_url is required")
        .custom((value: string) => {
            if (typeof value !== "string" || !isValidBannerUrl(value.trim())) {
                throw new Error("banner_url must be a site-relative path or a valid https URL");
            }
            return true;
        }),
];

const updateEventValidators = [
    body("header")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("header is required")
        .isLength({ max: 200 })
        .withMessage("header must be under 200 characters"),
    body("body")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("body is required")
        .isLength({ max: 5000 })
        .withMessage("body must be under 5000 characters"),
    body("location")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("location is required")
        .isLength({ max: 200 })
        .withMessage("location must be under 200 characters"),
    body("date")
        .optional()
        .isISO8601()
        .withMessage("date must be a valid ISO 8601 date"),
    body("registration_link")
        .optional()
        .isURL({ protocols: ["https"], require_protocol: true })
        .withMessage("registration_link must be a valid https URL"),
    body("banner_url")
        .optional()
        .custom((value: string) => {
            if (typeof value !== "string" || !isValidBannerUrl(value.trim())) {
                throw new Error("banner_url must be a site-relative path or a valid https URL");
            }
            return true;
        }),
];

const eventsRouter = Router()

eventsRouter.get("/", getLatestEvents)
eventsRouter.get("/all", getAllEvents)
eventsRouter.post("/", requireAdmin, createEventValidators, createEvent)
eventsRouter.put("/:id", requireAdmin, updateEventValidators, updateEvent)
eventsRouter.delete("/:id", requireAdmin, deleteEvent)

export default eventsRouter

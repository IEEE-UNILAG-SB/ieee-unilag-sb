import { Router } from "express";

import { getLatestEvents, getAllEvents, createEvent, updateEvent, deleteEvent } from "../controllers/events";

const eventsRouter = Router()

eventsRouter.get("/", getLatestEvents)
eventsRouter.get("/all", getAllEvents)
eventsRouter.post("/", createEvent)
eventsRouter.put("/:id", updateEvent)
eventsRouter.delete("/:id", deleteEvent)

export default eventsRouter

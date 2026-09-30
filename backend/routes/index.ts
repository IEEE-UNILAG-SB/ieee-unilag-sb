import { Router } from "express";
import newsletterRouter from "./newsletter";
import eventsRouter from "./events";
import contactRouter from "./contact";

const apiRouter = Router()

apiRouter.use("/newsletter", newsletterRouter)
apiRouter.use("/events", eventsRouter)
apiRouter.use("/contact", contactRouter)

export default apiRouter
import { Router } from "express";
import newsletterRouter from "./newsletter";
import eventsRouter from "./events";

const apiRouter = Router()

apiRouter.use("/newsletter", newsletterRouter)
apiRouter.use("/events", eventsRouter)

export default apiRouter
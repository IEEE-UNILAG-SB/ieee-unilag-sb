import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error";
import apiRouter from "./routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL?.split(",") ?? []
        : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});

app.use("/api/", limiter);

app.use("/api/v1/", apiRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "UP", message: "Backend is running..." });
});

app.use(errorHandler);

export default app;

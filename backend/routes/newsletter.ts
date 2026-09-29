import { Router } from "express";
import { body } from "express-validator";
import { subscribeUser } from "../controllers/newsletter";

const newsletterRouter = Router();

newsletterRouter.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
  ],
  subscribeUser,
);

export default newsletterRouter;

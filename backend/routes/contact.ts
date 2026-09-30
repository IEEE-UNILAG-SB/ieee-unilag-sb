import { Router } from "express";
import { body } from "express-validator";
import { sendMessage } from "../controllers/contact";

const contactRouter = Router();

contactRouter.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name must be under 100 characters"),
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("subject")
      .optional()
      .trim()
      .isLength({ max: 150 })
      .withMessage("Subject must be under 150 characters"),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 2000 })
      .withMessage("Message must be under 2000 characters"),
  ],
  sendMessage,
);

export default contactRouter;

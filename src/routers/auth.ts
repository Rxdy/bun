import { Hono } from "hono";
import { authValidator } from "../validators/auth";
import { authController } from "../controllers/auth";

export const router = new Hono();

router.post("/register", authValidator.data, authController.register);

router.post("/signin", authValidator.data, authController.signin);

import { Hono } from "hono";
import { authController } from "../controllers/auth";
import { validate } from "../middlewares/validate";
import { userSchema, logSchema } from "../validators/user";

export const router = new Hono();

router.post("/register", validate(userSchema), authController.register);

router.post("/signin", validate(logSchema), authController.signin);

router.post("/logout", authController.logout);

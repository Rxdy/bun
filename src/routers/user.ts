import { Hono } from "hono";
import { userValidator } from "../validators/user";
import { userController } from "../controllers/user";

export const router = new Hono();

router.get("/", userController.get);

router.post("/", userValidator.create, userController.create);

router.put("/:id", userValidator.update, userController.update);

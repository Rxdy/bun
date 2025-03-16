import { Hono } from "hono";
import { validate } from "../middlewares/validate"
import { userSchema } from "../validators/user";
import { userController } from "../controllers/user";

export const router = new Hono();

router.get("/", userController.get);

router.post("/", validate(userSchema), userController.create);

router.put("/:id", validate(userSchema), userController.update);

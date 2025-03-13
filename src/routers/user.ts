import { Hono } from "hono";
import { userValidator } from "../validators/user";
import { userController } from "../controllers/user";

export const router = new Hono();

router.get("/", userValidator.getUsers, userController.get);

router.post("/", userValidator.createUser, userController.create);

router.put("/:id", userValidator.updateUser, userController.update);

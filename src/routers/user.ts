import { Hono } from "hono";
import { userValidator } from "../validators/user";
import { userController } from "../controllers/user";

export const router = new Hono();

router.get("/", userValidator.getUsers, userController.getUsers);

router.post("/", userValidator.createUser, userController.createUser);

router.put("/:id", userValidator.updateUser, userController.updateUser);

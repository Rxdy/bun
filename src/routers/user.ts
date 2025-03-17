import { Hono } from "hono";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validators/user";
import { userController } from "../controllers/user";
import { authentification } from "../middlewares/auth";

export const router = new Hono();

router.get("/", userController.get);

router.post("/", authentification, validate(userSchema), userController.create);

router.put(
    "/:id",
    authentification,
    validate(userSchema),
    userController.update
);

router.delete("/:id", authentification, userController.delete);

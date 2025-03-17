import { type Context } from "hono";
import { prisma } from "../tools/prisma";
import { crypt } from "../tools/crypt";

class UserController {
    async get(c: Context) {
        const users = await prisma.user.findMany();
        return c.json(users);
    }

    async create(c: Context) {
        const userData = c.get("validatedBody");
        const hashedPassword = await crypt.hash(userData.password);
        await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
            },
        });
        return c.json({}, 200);
    }

    async update(c: Context) {
        const id = Number(c.req.param("id"));
        const userData = c.get("validatedBody");
        await prisma.user.update({
            where: { id: id },
            data: { name: userData.name, email: userData.email },
        });
        return c.json({}, 200);
    }

    async delete(c: Context) {
        const id = Number(c.req.param("id"));
        await prisma.user.delete({
            where: { id: id },
        });
        return c.json({}, 200);
    }
}

export const userController = new UserController();

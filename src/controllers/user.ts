import { type Context } from "hono";
import { prisma } from "../tools/prisma";
import bcrypt from "bcrypt";

class UserController {
    async get(c: Context) {
        const users = await prisma.user.findMany();
        return c.json(users);
    }

    async create(c: Context) {
        const body = await c.req.json();
        const hashedPassword = await bcrypt.hash(body.password, 10);
        await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            },
        });
        return c.json({}, 200);
    }

    async update(c: Context) {
        const id = Number(c.req.param("id"));
        const body = await c.req.json();
        await prisma.user.update({
            where: { id: id },
            data: { name: body.name, email: body.email },
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

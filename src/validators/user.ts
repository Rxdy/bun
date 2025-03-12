import { type Context, type Next } from "hono";

class UserValidator {
    async getUsers(c: Context, next: Next) {
        const limit = c.req.query("limit");
        if (limit && isNaN(Number(limit))) {
            return c.json({ error: "Limit must be a number" }, 400);
        }
        await next();
    }

    async createUser(c: Context, next: Next) {
        const body = await c.req.json();
        if (!body.name || typeof body.name !== "string") {
            return c.json(
                { error: "Name is required and must be a string" },
                400
            );
        }
        if (!body.email || !body.email.includes("@")) {
            return c.json({ error: "Valid email is required" }, 400);
        }
        await next();
    }

    async updateUser(c: Context, next: Next) {
        const id = c.req.param("id");
        const body = await c.req.json();
        if (!id || isNaN(Number(id))) {
            return c.json({ error: "Invalid user ID" }, 400);
        }
        if (!body.name && !body.email) {
            return c.json(
                { error: "At least one field (name or email) is required" },
                400
            );
        }
        await next();
    }
}

export const userValidator = new UserValidator();

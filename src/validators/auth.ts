import { type Context, type Next } from "hono";
import { prisma } from "../tools/prisma";
class AuthValidator {
    async data(c: Context, next: Next) {
        const { email, password, confPassword, name } = await c.req.json();

        if (!email || typeof email !== "string" || !email.includes("@")) {
            return c.json(
                { error: "L'email est requis et dois contenir un '@'" },
                400
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return c.json({ error: "Format email invalide" }, 400);
        }

        const minPasswordLength = 8;
        if (
            !password ||
            typeof password !== "string" ||
            password.length < minPasswordLength
        ) {
            return c.json(
                {
                    error: `Le mot de passe est requis et doit contenir ${minPasswordLength} caractères`,
                },
                400
            );
        }

        if (c.req.path === "/register") {
            if (!confPassword || confPassword !== password) {
                return c.json(
                    { error: "Les mots de passe ne correspondent pas" },
                    400
                );
            }

            if (!name || typeof name !== "string" || name.trim() === "") {
                return c.json(
                    { error: "Le nom ne peux pas être manquant" },
                    400
                );
            }

            const UserEmail = await prisma.user.findUnique({
                where: { email },
            });
            if (UserEmail) {
                return c.json({ error: "L'email est déjà utilisé" }, 400);
            }

            const UserName = await prisma.user.findUnique({
                where: { name },
            });
            if (UserName) {
                return c.json({ error: "Le nom est déjà utilisé" }, 400);
            }
        }

        await next();
    }
}

export const authValidator = new AuthValidator();

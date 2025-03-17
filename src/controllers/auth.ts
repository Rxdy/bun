import { type Context } from "hono";
import { prisma } from "../tools/prisma";

import { crypt } from "../tools/crypt";
import { sign } from "jsonwebtoken";

class AuthController {
    async register(c: Context) {
        const data = c.get("validatedBody");

        const hashedPassword = await crypt.hash(data.password);
        try {
            await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                },
            });
            return c.json({}, 200);
        } catch (error) {
            return c.json({ error: "Erreur lors de la création" }, 500);
        }
    }

    async signin(c: Context) {
        const data = c.get("validatedBody");
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user)
            return c.json(
                { error: "Mot de passe ou identifiant incorrect" },
                400
            );

        const match = await crypt.compare(data.password, user.password);
        if (!match)
            return c.json(
                { error: "Mot de passe ou identifiant incorrect" },
                400
            );

        const token = sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        c.header(
            "Set-Cookie",
            `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`
        );

        return c.json({}, 200);
    }

    async logout(c: Context) {
        c.header(
            "Set-Cookie",
            `token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
        );
        c.header(
            "Set-Cookie",
            `refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
        );

        return c.json({ message: "Déconnexion réussie" }, 200);
    }
}

export const authController = new AuthController();

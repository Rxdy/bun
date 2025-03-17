import { type Context, type Next } from "hono";
import { verify } from "jsonwebtoken";

export const authentification = async (c: Context, next: Next) => {
    try {
        const token = c.req.header("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) {
            return c.json({ error: "Accès refusé. Token manquant." }, 401);
        }

        const decoded = verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };

        c.set("userId", decoded.userId);

        await next();
    } catch (error) {
        return c.json({ error: "Accès refusé. Token invalide." }, 401);
    }
};

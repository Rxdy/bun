import { Hono } from "hono";
import { router as userRouter } from "./routers/user";

const app = new Hono();

app.use("*", async (c, next) => {
    console.log(`[${c.req.method}] ${c.req.url}`);
    await next();
});

app.route("/users", userRouter);

app.get("/", (c) => c.text("API avec Bun et Hono !"));

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
};

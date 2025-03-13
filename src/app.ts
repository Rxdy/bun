import { Hono, type Context, type Next } from "hono";
import { router as userRouter } from "./routers/user";
import { router as authRouter } from "./routers/auth";

import * as fs from "fs";

function logToFile(message: string) {
    const logFile = "./logs/api.txt";
    fs.appendFileSync(logFile, message + "\n", "utf8");
}

const app = new Hono();

app.use("*", async (c: Context, next: Next) => {
    const startTime = Date.now();

    await next();

    const endTime = Date.now();

    const duration = endTime - startTime;

    let logMessage =
        "--------------------------------------------------------\n";
    logMessage += `Heure : ${new Date().toISOString()}\n`;
    logMessage += `Méthode : ${c.req.method}\n`;
    logMessage += `URL : ${c.req.url}\n`;
    logMessage += `Temps requête : ${duration}ms\n`;

    logToFile(logMessage);
});

app.route("/users", userRouter);
app.route("/auth", authRouter);

app.get("/", (c: Context) => c.text("API avec Bun et Hono !"));

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch,
};

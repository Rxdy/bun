import { PrismaClient } from "@prisma/client";
import { crypt } from "../src/tools/crypt";
const prisma = new PrismaClient();

async function seed() {
    console.log("🌱 Seeding database...");

    await prisma.user.deleteMany();

    const users = [
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
        { name: "Fred", email: "fred@example.com" },
        { name: "Charles", email: "charles@example.com" },
    ];

    const hashedUsers = await Promise.all(
        users.map(async (user) => ({
            name: user.name,
            email: await crypt.hash(user.email, "mail"),
            password: await crypt.hash(process.env.PASS_DEFAULT!, "pwd"),
        }))
    );

    await prisma.user.createMany({ data: hashedUsers });

    console.log("✅ Seeding completed.");

    await prisma.$disconnect();
}

seed().catch((error) => {
    console.error("❌ Error while seeding:", error);
    process.exit(1);
});

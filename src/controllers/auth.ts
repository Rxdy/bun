import { type Context } from "hono";
import { prisma } from "../tools/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

class AuthController {
	async register(c: Context) {
		const { name, email, password } = await c.req.json();

		const hashedPassword = await bcrypt.hash(password, 10);
		try {
			await prisma.user.create({
			  data: { name: name, email: email, password: hashedPassword },
			});
			return c.json({}, 200);
		} 
		catch (error) {
			return c.json({ error: "Erreur lors de la création" }, 500);
		}
	}

	async signin(c: Context) {
		const { email, password } = await c.req.json();

  		const user = await prisma.user.findUnique({ where: { email } });
  		if (!user) return c.json({ error: "Utilisateur non trouvé" }, 404);

		// Vérification du mot de passe
		const match = await bcrypt.compare(password, user.password);
		if (!match) return c.json({ error: "Mot de passe incorrect" }, 401);

		// Création du token JWT
		const token = sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: "1h",
		});

		// Stockage du token dans un cookie sécurisé
		c.header("Set-Cookie", `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`);

  		return c.json({ message: "Connexion réussie" });
	}
}

export const authController = new AuthController();

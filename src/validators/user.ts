import { z } from "zod";

export const userSchema = z.object({
    name: z
        .string()
        .trim()
        .transform(
            (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
        ),
    email: z.string().email("L'email doit être valide"),
    password: z
        .string()
        .min(10, "Le mot de passe doit contenir au moins 10 caractères"),
});

export const logSchema = z.object({
    email: z.string().email("L'email doit être valide"),
    password: z
        .string()
        .min(10, "Le mot de passe doit contenir au moins 10 caractères"),
});

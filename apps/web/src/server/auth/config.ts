import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/prisma";
import * as argon2 from "argon2";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET || "cambiar_este_secreto_super_seguro_en_produccion_min_32_chars",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp: true, // Registro deshabilitado por requerimiento RF-01
    password: {
      hash: async (password: string) => {
        return argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 65536,
          timeCost: 3,
          parallelism: 4,
        });
      },
      verify: async ({ password, hash }: { password: string; hash: string }) => {
        return argon2.verify(hash, password);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días para experiencia mobile offline/PWA
    updateAge: 60 * 60 * 24, // 1 día
  },
});

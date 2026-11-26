import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "asador@bitacora.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "AsadoMaster2026!";
  const name = process.env.SEED_ADMIN_NAME || "Maestro Asador";

  console.log(`[Seed] Verificando usuario administrador: ${email}`);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (existingUser) {
    console.log(`[Seed] Usuario ya existe: ${existingUser.id}`);
    const credAccount = existingUser.accounts.find((a) => a.providerId === "credential");
    if (credAccount && credAccount.accountId !== existingUser.id) {
      await prisma.account.update({
        where: { id: credAccount.id },
        data: { accountId: existingUser.id },
      });
      console.log(`[Seed] accountId corregido para el usuario: ${existingUser.id}`);
    }
    return;
  }

  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      emailVerified: true,
      role: "ADMIN",
    },
  });

  await prisma.account.create({
    data: {
      userId: newUser.id,
      providerId: "credential",
      accountId: newUser.id,
      password: hashedPassword,
    },
  });

  console.log(`[Seed] Usuario administrador creado exitosamente con ID: ${newUser.id}`);
}

main()
  .catch((e) => {
    console.error("[Seed] Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { headers } from "next/headers";
import { auth } from "./config";
import { redirect } from "next/navigation";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

/**
 * Verifica la sesión activa del usuario.
 * Si no está autenticado, redirige a /login.
 * Si está autenticado, retorna el usuario con su owner_id.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user as { role?: string }).role || "USER",
  };
}

/**
 * Versión no bloqueante para endpoints que necesitan saber opcionalmente si hay usuario.
 */
export async function getOptionalUser(): Promise<AuthenticatedUser | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as { role?: string }).role || "USER",
    };
  } catch {
    return null;
  }
}

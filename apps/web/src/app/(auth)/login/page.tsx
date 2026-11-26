"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Credenciales incorrectas o límite de intentos excedido.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <Card className="border-charcoal-700 bg-charcoal-900/95 shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ember-600/20 text-ember-500 border border-ember-500/30">
          <Flame className="h-8 w-8 text-ember-500 animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Bitácora de Asados
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Accede a tu recetario y cursos de parrillada
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-950/50 p-3 text-xs text-red-300 border border-red-800/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Correo Electrónico
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="asador@bitacora.local"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Contraseña
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

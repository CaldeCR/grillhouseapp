import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, UtensilsCrossed, Flame, Film, PlusCircle } from "lucide-react";
import { getCourses } from "@/features/courses/queries";
import { getRecipes } from "@/features/recipes/queries";
import { getTechniques } from "@/features/techniques/queries";
import { getRecentJobs } from "@/features/media/queries";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const [courses, recipes, techniques, jobs] = await Promise.all([
    getCourses(),
    getRecipes(),
    getTechniques(),
    getRecentJobs(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Panel de Asador
          </h1>
          <p className="text-sm text-neutral-400">
            Resumen de talleres, recetas maestras y técnicas registradas.
          </p>
        </div>
        <Link href="/recipes/new">
          <Button className="hidden md:inline-flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nueva Receta
          </Button>
        </Link>
      </div>

      {/* Grid de métricas rápidas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Link href="/courses">
          <Card className="hover:border-ember-600/40 transition-colors cursor-pointer">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase">Cursos</span>
                <BookOpen className="h-4 w-4 text-ember-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-white">{courses.length}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/recipes">
          <Card className="hover:border-ember-600/40 transition-colors cursor-pointer">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase">Recetas</span>
                <UtensilsCrossed className="h-4 w-4 text-ember-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-white">{recipes.length}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/techniques">
          <Card className="hover:border-ember-600/40 transition-colors cursor-pointer">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase">Técnicas</span>
                <Flame className="h-4 w-4 text-ember-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-white">{techniques.length}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/media">
          <Card className="hover:border-ember-600/40 transition-colors cursor-pointer">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase">Procesamiento</span>
                <Film className="h-4 w-4 text-ember-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-white">{jobs.length}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recetas Recientes & Cursos */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Últimas Recetas</h2>
            <Link href="/recipes" className="text-xs text-ember-400 hover:underline">
              Ver todas
            </Link>
          </div>
          {recipes.length === 0 ? (
            <Card className="p-6 text-center text-sm text-neutral-400">
              No tienes recetas creadas aún.
            </Card>
          ) : (
            <div className="space-y-2">
              {recipes.slice(0, 4).map((r) => (
                <Link key={r.id} href={`/recipes/${r.id}`}>
                  <Card className="p-4 hover:border-charcoal-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{r.title}</h3>
                      {r.portions && (
                        <Badge variant="secondary">{r.portions} porciones</Badge>
                      )}
                    </div>
                    {r.originCourse && (
                      <p className="text-xs text-neutral-400 mt-1">
                        Curso: {r.originCourse.name}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Cursos Registrados</h2>
            <Link href="/courses" className="text-xs text-ember-400 hover:underline">
              Ver todos
            </Link>
          </div>
          {courses.length === 0 ? (
            <Card className="p-6 text-center text-sm text-neutral-400">
              No has registrado ningún curso de asados.
            </Card>
          ) : (
            <div className="space-y-2">
              {courses.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/courses/${c.id}`}>
                  <Card className="p-4 hover:border-charcoal-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{c.name}</h3>
                      <Badge variant="outline">{c.school}</Badge>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Instructor: {c.instructor} • {c._count.materials} PDFs
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

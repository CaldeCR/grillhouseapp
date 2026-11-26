import Link from "next/link";
import { getRecipes } from "@/features/recipes/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, UtensilsCrossed, Clock, Flame } from "lucide-react";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Fichas de Recetas
          </h1>
          <p className="text-sm text-neutral-400">
            Recetario de carnes, rubs, marinadas y cortes con tiempos y temperaturas.
          </p>
        </div>
        <Link href="/recipes/new">
          <Button className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Nueva Receta</span>
          </Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-neutral-600" />
          <div className="space-y-1">
            <h3 className="font-semibold text-white">No tienes recetas guardadas</h3>
            <p className="text-sm text-neutral-400">
              Registra tu primer asado, brisket, costillar o corte especial.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
              <Card className="h-full hover:border-ember-600/50 transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {recipe.portions && (
                      <Badge variant="secondary">{recipe.portions} porciones</Badge>
                    )}
                    {recipe.originCourse && (
                      <Badge variant="outline" className="text-[10px]">
                        {recipe.originCourse.name}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-neutral-400">
                  <p className="line-clamp-2 text-neutral-300">{recipe.stepsText}</p>
                  <div className="flex items-center gap-4 pt-2 border-t border-charcoal-700 text-[11px]">
                    <span className="flex items-center gap-1 text-ember-400">
                      <Flame className="h-3 w-3" />
                      {recipe._count.techniques} técnicas
                    </span>
                    <span className="text-neutral-400">
                      {Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0} ingredientes
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

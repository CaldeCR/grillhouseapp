import { notFound } from "next/navigation";
import { getRecipeById } from "@/features/recipes/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Thermometer, Flame, BookOpen, Clock } from "lucide-react";

export default async function RecipeDetailPage({
  params,
}: {
  params: { recipeId: string };
}) {
  const recipe = await getRecipeById(params.recipeId);
  if (!recipe) notFound();

  const ingredientsList = Array.isArray(recipe.ingredients)
    ? (recipe.ingredients as Array<{ amount: number; unit: string; name: string }>)
    : [];

  const temps = recipe.temperatures as { targetCoreTemp?: string; smokerTemp?: string } | null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {recipe.portions && <Badge variant="secondary">{recipe.portions} porciones</Badge>}
          {recipe.originCourse && (
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {recipe.originCourse.name}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">{recipe.title}</h1>
        {recipe.originAuthor && (
          <p className="text-xs text-neutral-400">Autor / Fuente: {recipe.originAuthor}</p>
        )}
      </div>

      {/* Temperaturas Clave */}
      {temps && (temps.targetCoreTemp || temps.smokerTemp) && (
        <div className="grid grid-cols-2 gap-3">
          {temps.targetCoreTemp && (
            <Card className="p-4 border-ember-600/30">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Thermometer className="h-4 w-4 text-ember-500" />
                <span>Temp. Interna Objetivo</span>
              </div>
              <div className="text-lg font-bold text-white">{temps.targetCoreTemp}</div>
            </Card>
          )}
          {temps.smokerTemp && (
            <Card className="p-4 border-ember-600/30">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Flame className="h-4 w-4 text-ember-500" />
                <span>Temp. Parrilla / Ahumador</span>
              </div>
              <div className="text-lg font-bold text-white">{temps.smokerTemp}</div>
            </Card>
          )}
        </div>
      )}

      {/* Ingredientes */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-ember-500" />
          Ingredientes
        </h2>
        <ul className="divide-y divide-charcoal-700 text-sm">
          {ingredientsList.map((ing, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span className="text-neutral-200">{ing.name}</span>
              <span className="text-neutral-400 font-mono">
                {ing.amount} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Pasos */}
      <Card className="p-5 space-y-3">
        <h2 className="text-base font-bold text-white">Preparación Paso a Paso</h2>
        <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
          {recipe.stepsText}
        </div>
      </Card>
    </div>
  );
}

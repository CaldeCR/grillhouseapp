import { getCourses } from "@/features/courses/queries";
import { getTechniques } from "@/features/techniques/queries";
import { RecipeForm } from "@/features/recipes/components/RecipeForm";

export default async function NewRecipePage() {
  const [courses, techniques] = await Promise.all([
    getCourses(),
    getTechniques(),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Crear Ficha de Receta
        </h1>
        <p className="text-sm text-neutral-400">
          Registra ingredientes, pasos en TipTap, temperaturas y referencia de origen.
        </p>
      </div>

      <RecipeForm courses={courses} techniques={techniques} />
    </div>
  );
}

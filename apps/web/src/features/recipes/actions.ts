"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { RecipeSchema, RecipeInput } from "./schema";
import { revalidatePath } from "next/cache";

export async function createRecipeAction(data: RecipeInput) {
  const user = await requireUser();
  const parsed = RecipeSchema.parse(data);

  const recipe = await prisma.recipe.create({
    data: {
      ownerId: user.id,
      title: parsed.title,
      portions: parsed.portions,
      ingredients: parsed.ingredients,
      stepsContent: parsed.stepsContent,
      stepsText: parsed.stepsText,
      cookingTimes: parsed.cookingTimes,
      temperatures: parsed.temperatures,
      originCourseId: parsed.originCourseId,
      originMaterialId: parsed.originMaterialId,
      originPage: parsed.originPage,
      originAuthor: parsed.originAuthor,
      techniques: parsed.techniqueIds?.length
        ? {
            create: parsed.techniqueIds.map((tId) => ({
              techniqueId: tId,
              ownerId: user.id,
            })),
          }
        : undefined,
      references: parsed.referenceIds?.length
        ? {
            create: parsed.referenceIds.map((rId) => ({
              referenceId: rId,
              ownerId: user.id,
            })),
          }
        : undefined,
    },
  });

  revalidatePath("/recipes");
  return { success: true, recipe };
}

export async function updateRecipeAction(id: string, data: Partial<RecipeInput>) {
  const user = await requireUser();

  const recipe = await prisma.recipe.update({
    where: { id, ownerId: user.id },
    data: {
      title: data.title,
      portions: data.portions,
      ingredients: data.ingredients,
      stepsContent: data.stepsContent,
      stepsText: data.stepsText,
      cookingTimes: data.cookingTimes,
      temperatures: data.temperatures,
      originCourseId: data.originCourseId,
      originMaterialId: data.originMaterialId,
      originPage: data.originPage,
      originAuthor: data.originAuthor,
    },
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}`);
  return { success: true, recipe };
}

export async function deleteRecipeAction(id: string) {
  const user = await requireUser();
  await prisma.recipe.delete({
    where: { id, ownerId: user.id },
  });

  revalidatePath("/recipes");
  return { success: true };
}

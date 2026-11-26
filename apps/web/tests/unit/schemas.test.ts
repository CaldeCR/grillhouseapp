import { describe, it, expect } from "vitest";
import { CourseSchema } from "@/features/courses/schema";
import { RecipeSchema } from "@/features/recipes/schema";

describe("Validación de Esquemas Zod", () => {
  it("valida un curso correctamente", () => {
    const validCourse = {
      name: "Taller Parrillero Profesional",
      school: "Academia de Asados",
      instructor: "Master Grill Chef",
      description: "Curso intensivo",
    };
    const res = CourseSchema.safeParse(validCourse);
    expect(res.success).toBe(true);
  });

  it("falla si el curso no tiene escuela o instructor", () => {
    const invalidCourse = {
      name: "Taller Parrillero",
      school: "",
      instructor: "",
    };
    const res = CourseSchema.safeParse(invalidCourse);
    expect(res.success).toBe(false);
  });

  it("valida una receta con ingredientes estructurados", () => {
    const validRecipe = {
      title: "Picaña al Carbón",
      portions: 4,
      ingredients: [
        { amount: 1.2, unit: "kg", name: "Picaña" },
        { amount: 20, unit: "g", name: "Sal de grano" },
      ],
      stepsContent: { type: "doc" },
      stepsText: "1. Sellar a fuego directo. 2. Pasar a indirecto hasta 54°C.",
    };
    const res = RecipeSchema.safeParse(validRecipe);
    expect(res.success).toBe(true);
  });
});

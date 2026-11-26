import { z } from "zod";

export const IngredientSchema = z.object({
  amount: z.number().positive("La cantidad debe ser mayor a 0"),
  unit: z.string().min(1, "Unidad requerida (ej. g, kg, cda, taza)"),
  name: z.string().min(2, "Nombre del ingrediente requerido"),
  notes: z.string().optional(),
});

export const CookingTimesSchema = z.object({
  prepMinutes: z.number().int().nonnegative().optional(),
  cookMinutes: z.number().int().nonnegative().optional(),
  restMinutes: z.number().int().nonnegative().optional(),
});

export const TemperaturesSchema = z.object({
  targetCoreTemp: z.string().optional(), // ej: "54°C (Término medio)"
  smokerTemp: z.string().optional(),     // ej: "110°C - 120°C"
  grillZone: z.string().optional(),       // ej: "Fuego directo / indirecto"
});

export const RecipeSchema = z.object({
  title: z.string().min(2, "El título es obligatorio"),
  portions: z.number().int().positive().optional().nullable(),
  ingredients: z.array(IngredientSchema).min(1, "Debe incluir al menos un ingrediente"),
  stepsContent: z.any(), // TipTap JSON
  stepsText: z.string().min(5, "Los pasos de preparación son obligatorios"),
  cookingTimes: CookingTimesSchema.optional(),
  temperatures: TemperaturesSchema.optional(),
  
  // Origen de referencia (RF-09)
  originCourseId: z.string().cuid().optional().nullable(),
  originMaterialId: z.string().cuid().optional().nullable(),
  originPage: z.number().int().positive().optional().nullable(),
  originAuthor: z.string().optional().nullable(),

  techniqueIds: z.array(z.string().cuid()).optional(),
  referenceIds: z.array(z.string().cuid()).optional(),
});

export type RecipeInput = z.infer<typeof RecipeSchema>;
export type IngredientInput = z.infer<typeof IngredientSchema>;

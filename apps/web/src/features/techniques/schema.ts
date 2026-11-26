import { z } from "zod";

export const TechniqueSchema = z.object({
  name: z.string().min(2, "El nombre de la técnica es obligatorio"),
  descriptionJson: z.any().optional(),
  descriptionText: z.string().optional().nullable(),
  keyPoints: z.array(z.string()).default([]),
  commonErrors: z.array(z.string()).default([]),

  // Origen de referencia (RF-09)
  originCourseId: z.string().cuid().optional().nullable(),
  originMaterialId: z.string().cuid().optional().nullable(),
  originPage: z.number().int().positive().optional().nullable(),
  originAuthor: z.string().optional().nullable(),

  referenceIds: z.array(z.string().cuid()).optional(),
});

export type TechniqueInput = z.infer<typeof TechniqueSchema>;

import { z } from "zod";

export const UploadMaterialSchema = z.object({
  courseId: z.string().cuid(),
  classSessionId: z.string().cuid().optional().nullable(),
  title: z.string().min(2, "El título es requerido"),
  sourceAuthor: z.string().optional().nullable(),
});

export type UploadMaterialInput = z.infer<typeof UploadMaterialSchema>;

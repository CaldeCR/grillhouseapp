import { z } from "zod";

export const CourseSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  school: z.string().min(2, "La escuela o academia es obligatoria"),
  instructor: z.string().min(2, "El instructor es obligatorio"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const ClassSessionSchema = z.object({
  courseId: z.string().cuid(),
  sessionNumber: z.number().int().positive().optional().nullable(),
  title: z.string().min(2, "El título de la sesión es requerido"),
  date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CourseInput = z.infer<typeof CourseSchema>;
export type ClassSessionInput = z.infer<typeof ClassSessionSchema>;

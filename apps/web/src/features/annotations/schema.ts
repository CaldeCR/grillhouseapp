import { z } from "zod";

export const AnnotationSchema = z.object({
  materialId: z.string().cuid(),
  pageNumber: z.number().int().positive(),
  type: z.enum(["HIGHLIGHT", "AREA", "NOTE"]).default("HIGHLIGHT"),
  position: z.any(), // Estructura de react-pdf-highlighter-extended: { boundingRect, rects, pageNumber }
  quoteText: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  color: z.string().optional().default("#ffd700"),
});

export type AnnotationInput = z.infer<typeof AnnotationSchema>;

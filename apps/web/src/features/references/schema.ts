import { z } from "zod";

export const ReferenceSchema = z.object({
  url: z.string().url("URL inválida"),
  platform: z.enum(["YOUTUBE", "INSTAGRAM", "TIKTOK", "X", "WEB"]).default("WEB"),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  isManualThumbnail: z.boolean().default(false),
});

export type ReferenceInput = z.infer<typeof ReferenceSchema>;

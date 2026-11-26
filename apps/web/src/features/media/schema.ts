import { z } from "zod";

export const VideoTranscodeRequestSchema = z.object({
  mediaId: z.string().cuid(),
  preset: z.enum(["PRESET_480P", "PRESET_720P", "PRESET_1080P"]).default("PRESET_720P"),
});

export type VideoTranscodeRequest = z.infer<typeof VideoTranscodeRequestSchema>;

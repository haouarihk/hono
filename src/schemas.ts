import { z } from "zod";

export const MessageSchema = z.object({
    id: z.string().optional(),
    to: z.string().or(z.number()),
    message: z.string(),
    priority: z.number().optional()
});

export const MessagesSchema = z.array(MessageSchema);
import { z } from 'zod';

export const createHighlightedIpSchema = z.object({
    ip_address: z.ipv4({ message: 'Invalid IP address format' }),
    reason: z.string().optional(),
});

export const updateHighlightedIpSchema = z.object({
    ip_address: z.ipv4({ message: 'Invalid IP address format' }).optional(),
    reason: z.string().optional(),
});

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateHighlightedIpInput = z.infer<typeof createHighlightedIpSchema>;
export type UpdateHighlightedIpInput = z.infer<typeof updateHighlightedIpSchema>;
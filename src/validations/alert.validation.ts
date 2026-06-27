import { z } from 'zod';

export const alertQuerySchema = z.object({
    department: z.string().optional(),
    risk: z.enum(['Low', 'Medium', 'High']).optional(),
    severity: z.coerce.number().int().min(1).max(3).optional(),
    date_from: z.string().datetime().optional(),
    date_to: z.string().datetime().optional(),
    sort_by: z.enum(['timestamp', 'severity']).default('timestamp'),
    order: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type AlertQueryInput = z.infer<typeof alertQuerySchema>;
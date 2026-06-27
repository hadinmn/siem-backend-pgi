import { Request, Response, NextFunction } from 'express';
import type { ZodType } from "zod";

type ValidateTarget = 'body' | 'query' | 'params';

export const validate =
    (schema: ZodType, target: ValidateTarget = 'body') =>
        (req: Request, res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req[target]);

            if (!result.success) {
                const errors = result.error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors,
                });
                return;
            }

            if (target === 'query') {
                Object.defineProperty(req, 'query', {
                    value: result.data,
                    writable: true,
                    configurable: true,
                });
            } else {
                req[target] = result.data;
            }

            next();
        };


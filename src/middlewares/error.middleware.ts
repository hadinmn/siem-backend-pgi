import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err?.code === 'P2002') {
        res.status(409).json({ success: false, message: 'Data already exists' });
        return;
    }

    if (err?.code === 'P2025') {
        res.status(404).json({ success: false, message: 'Data not found' });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }

    console.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
};
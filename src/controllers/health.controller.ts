import { Request, Response, NextFunction } from 'express';
import { getHealthStatus } from '../services/health.service';

export const healthCheck = async (
    _: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await getHealthStatus();
        const statusCode = result.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(result);
    }
    
    catch (err) {
        next(err);
    }
};
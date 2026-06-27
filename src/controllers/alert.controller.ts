import { Request, Response, NextFunction } from 'express';
import { getAlertLogs } from '../services/alert.service';
import { AlertQueryInput } from '../validations';

export const getAlerts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const params = req.query as unknown as AlertQueryInput;
        const result = await getAlertLogs(params);

        res.status(200).json({
            success: true,
            message: 'Successfully fetched alert logs',
            meta: {
                total_data: result.total_data,
                page: result.page,
                limit: result.limit,
            },
            data: result.data,
        });
    }
    
    catch (err) {
        next(err);
    }
};
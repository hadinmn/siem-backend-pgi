import { Request, Response, NextFunction } from 'express';
import { getTopTargetedAssets } from '../services/dashboard.service';

export const getTopAssets = async (
    _: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = await getTopTargetedAssets();
        res.status(200).json({
            success: true,
            message: 'Successfully fetched top targeted assets',
            meta: { total_data: data.length },
            data,
        });
    }
    
    catch (err) {
        next(err);
    }
};
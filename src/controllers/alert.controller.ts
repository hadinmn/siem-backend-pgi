import { Request, Response } from 'express';
import { getAlertLogs } from '../services/alert.service';
import { AlertQueryParams } from '../types';

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
    try {
        const params: AlertQueryParams = {
            department: req.query.department as string,
            risk: req.query.risk as string,
            severity: req.query.severity ? Number(req.query.severity) : undefined,
            date_from: req.query.date_from as string,
            date_to: req.query.date_to as string,
            sort_by: req.query.sort_by as 'timestamp' | 'severity',
            order: req.query.order as 'asc' | 'desc',
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        };

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
        
    } catch (err) {
        console.error('Error fetching alert logs:', (err as Error).message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
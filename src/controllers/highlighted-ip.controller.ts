import { Request, Response, NextFunction } from 'express';
import {
    addHighlightedIp,
    listHighlightedIps,
    editHighlightedIp,
    removeHighlightedIp,
    getHighlightedIpActivity,
} from '../services/highlighted-ip.service';
import { AppError } from '../middlewares/error.middleware';

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = await addHighlightedIp(req.body);
        res.status(201).json({ success: true, message: 'IP highlighted successfully', data });
    }
    
    catch (err) {
        next(err);
    }
};

export const list = async (
    _: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = await listHighlightedIps();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved data',
            meta: { total_data: data.length },
            data,
        });
    }
    
    catch (err) {
        next(err);
    }
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const data = await editHighlightedIp(id, req.body);
        if (!data) {
            next(new AppError('IP not found', 404));
            return;
        }
        res.status(200).json({ success: true, message: 'IP updated successfully', data });
    }
    
    catch (err) {
        next(err);
    }
};

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const data = await removeHighlightedIp(id);
        if (!data) {
            next(new AppError('IP not found', 404));
            return;
        }
        res.status(200).json({ success: true, message: 'IP deleted successfully', data });
    }
    
    catch (err) {
        next(err);
    }
};

export const activity = async (
    _: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await getHighlightedIpActivity();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved data',
            meta: { total_data: result.total_data },
            data: result.data,
        });
    }
    
    catch (err) {
        next(err);
    }
};
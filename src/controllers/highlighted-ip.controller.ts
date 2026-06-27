import { Request, Response } from 'express';
import {
    addHighlightedIp,
    listHighlightedIps,
    editHighlightedIp,
    removeHighlightedIp,
    getHighlightedIpActivity,
} from '../services/highlighted-ip.service';

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ip_address, reason } = req.body;
        if (!ip_address) {
            res.status(400).json({ success: false, message: 'ip_address is required' });
            return;
        }
        const data = await addHighlightedIp({ ip_address, reason });
        res.status(201).json({ success: true, message: 'IP highlighted successfully', data });

    } catch (err: any) {
        if (err.code === '23505') {
            res.status(409).json({ success: false, message: 'IP address already highlighted' });
            return;
        }
        console.error('Error adding highlighted IP:', (err as Error).message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await listHighlightedIps();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved data',
            meta: { total_data: data.length },
            data,
        });

    } catch (err) {
        console.error('Error listing highlighted IPs:', (err as Error).message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { ip_address, reason } = req.body;
        const data = await editHighlightedIp(id, { ip_address, reason });
        if (!data) {
            res.status(404).json({ success: false, message: 'IP not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'IP updated successfully', data });

    } catch (err) {
        console.error('Error updating highlighted IP:', (err as Error).message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const data = await removeHighlightedIp(id);
        if (!data) {
            res.status(404).json({ success: false, message: 'IP not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'IP deleted successfully', data });

    } catch (err) {
        console.error('Error deleting highlighted IP:', (err as Error).message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const activity = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getHighlightedIpActivity();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved data',
            meta: { total_data: result.total_data },
            data: result.data,
        });

    } catch (err) {
        console.error('Error fetching activity:', (err as Error).message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
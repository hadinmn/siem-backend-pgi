import { Request, Response } from 'express';
import { getTopTargetedAssets } from '../services/dashboard.service';

export const getTopAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getTopTargetedAssets();

    res.status(200).json({
      success: true,
      message: 'Successfully fetched top targeted assets',
      meta: { total_data: data.length },
      data,
    });
    
  } catch (err) {
    console.error('Error fetching top targeted assets:', (err as Error).message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
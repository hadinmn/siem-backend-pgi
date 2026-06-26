import { Request, Response } from 'express';
import { getHealthStatus } from '../services/health.service';

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  const result = await getHealthStatus();
  const statusCode = result.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(result);
};
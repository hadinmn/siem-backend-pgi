import { Router } from 'express';
import { getTopAssets } from '../controllers/dashboard.controller';

const router = Router();

router.get('/top-targeted', getTopAssets);

export default router;
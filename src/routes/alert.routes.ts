import { Router } from 'express';
import { getAlerts } from '../controllers/alert.controller';
import { validate } from '../middlewares/validate.middleware';
import { alertQuerySchema } from '../validations';

const router = Router();

router.get('/', validate(alertQuerySchema, 'query'), getAlerts);

export default router;
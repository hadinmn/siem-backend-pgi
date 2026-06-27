import { Router } from 'express';
import { create, list, update, remove, activity } from '../controllers/highlighted-ip.controller';
import { validate } from '../middlewares/validate.middleware';
import {
    createHighlightedIpSchema,
    updateHighlightedIpSchema,
    idParamSchema,
} from '../validations';

const router = Router();

router.post('/', validate(createHighlightedIpSchema), create);
router.get('/', list);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateHighlightedIpSchema), update);
router.delete('/:id', validate(idParamSchema, 'params'), remove);
router.get('/activity', activity);

export default router;
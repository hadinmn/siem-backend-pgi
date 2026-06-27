import { Router } from 'express';
import { create, list, update, remove, activity } from '../controllers/highlighted-ip.controller';

const router = Router();

router.post('/', create);
router.get('/', list);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/activity', activity);

export default router;
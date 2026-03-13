import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createStoreSchema, updateStoreSchema } from '../validators/store.schema.js';
import * as ctrl from '../controllers/stores.controller.js';

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireAuth, validate(createStoreSchema), ctrl.create);
router.put('/:id', requireAuth, validate(updateStoreSchema), ctrl.update);

export default router;

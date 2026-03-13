import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.schema.js';
import * as ctrl from '../controllers/orders.controller.js';

const router = Router();

router.post('/', requireAuth, validate(createOrderSchema), ctrl.create);
router.get('/', requireAuth, ctrl.list);
router.get('/:id', requireAuth, ctrl.getById);
router.patch('/:id/status', requireAuth, validate(updateOrderStatusSchema), ctrl.updateStatus);

export default router;

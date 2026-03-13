import { Router } from 'express';
import { validate, validateQuery } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../validators/product.schema.js';
import * as ctrl from '../controllers/products.controller.js';

const router = Router();

router.get('/', validateQuery(productQuerySchema), ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireAuth, validate(createProductSchema), ctrl.create);
router.put('/:id', requireAuth, validate(updateProductSchema), ctrl.update);
router.delete('/:id', requireAuth, ctrl.remove);

export default router;

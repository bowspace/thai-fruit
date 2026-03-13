import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { signupSchema, loginSchema } from '../validators/auth.schema.js';
import * as ctrl from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', validate(signupSchema), ctrl.signup);
router.post('/login', validate(loginSchema), ctrl.login);
router.get('/me', requireAuth, ctrl.me);

export default router;

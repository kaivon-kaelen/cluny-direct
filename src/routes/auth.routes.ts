import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  registerValidation,
  loginValidation,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;

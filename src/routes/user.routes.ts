import { Router } from 'express';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listUsers);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, authorize('ADMIN'), updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);

export default router;

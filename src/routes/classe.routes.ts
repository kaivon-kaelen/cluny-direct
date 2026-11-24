import { Router } from 'express';
import { listClasses, getClasse, createClasse, updateClasse, deleteClasse } from '../controllers/classe.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listClasses);
router.get('/:id', authenticate, getClasse);
router.post('/', authenticate, authorize('ADMIN'), createClasse);
router.put('/:id', authenticate, authorize('ADMIN'), updateClasse);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteClasse);

export default router;

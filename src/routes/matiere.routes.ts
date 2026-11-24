import { Router } from 'express';
import { listMatieres, getMatiere, createMatiere, updateMatiere, deleteMatiere } from '../controllers/matiere.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listMatieres);
router.get('/:id', authenticate, getMatiere);
router.post('/', authenticate, authorize('ADMIN'), createMatiere);
router.put('/:id', authenticate, authorize('ADMIN'), updateMatiere);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteMatiere);

export default router;

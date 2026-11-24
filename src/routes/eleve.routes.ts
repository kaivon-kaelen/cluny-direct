import { Router } from 'express';
import { listEleves, getEleve, createEleve, updateEleve, deleteEleve } from '../controllers/eleve.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listEleves);
router.get('/:id', authenticate, getEleve);
router.post('/', authenticate, authorize('ADMIN', 'PROFESSEUR'), createEleve);
router.put('/:id', authenticate, authorize('ADMIN', 'PROFESSEUR'), updateEleve);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteEleve);

export default router;

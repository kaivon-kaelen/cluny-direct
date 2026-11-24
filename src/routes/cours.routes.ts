import { Router } from 'express';
import { listCours, getCours, createCours, updateCours, deleteCours } from '../controllers/cours.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listCours);
router.get('/:id', authenticate, getCours);
router.post('/', authenticate, authorize('ADMIN', 'PROFESSEUR'), createCours);
router.put('/:id', authenticate, authorize('ADMIN', 'PROFESSEUR'), updateCours);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCours);

export default router;

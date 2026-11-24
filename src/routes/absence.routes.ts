import { Router } from 'express';
import { listAbsences, getAbsence, createAbsence, updateAbsence, deleteAbsence } from '../controllers/absence.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listAbsences);
router.get('/:id', authenticate, getAbsence);
router.post('/', authenticate, authorize('ADMIN', 'PROFESSEUR'), createAbsence);
router.put('/:id', authenticate, authorize('ADMIN', 'PROFESSEUR'), updateAbsence);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteAbsence);

export default router;

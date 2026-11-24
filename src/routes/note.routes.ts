import { Router } from 'express';
import { listNotes, getNote, createNote, updateNote, deleteNote } from '../controllers/note.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listNotes);
router.get('/:id', authenticate, getNote);
router.post('/', authenticate, authorize('ADMIN', 'PROFESSEUR'), createNote);
router.put('/:id', authenticate, authorize('ADMIN', 'PROFESSEUR'), updateNote);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteNote);

export default router;

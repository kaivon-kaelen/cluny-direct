import { Router } from 'express';
import { listMessages, getMessage, createMessage, markAsRead, deleteMessage } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listMessages);
router.get('/:id', authenticate, getMessage);
router.post('/', authenticate, createMessage);
router.patch('/:id/read', authenticate, markAsRead);
router.delete('/:id', authenticate, deleteMessage);

export default router;

import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listMessages = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  const { destinataireId } = req.query;

  const where = destinataireId
    ? {
        OR: [
          { expediteurId: userId, destinataireId: String(destinataireId) },
          { expediteurId: String(destinataireId), destinataireId: userId },
        ],
      }
    : { destinataireId: userId };

  const messages = await prisma.message.findMany({
    where,
    include: { expediteur: { select: { firstName: true, lastName: true, email: true } }, destinataire: { select: { firstName: true, lastName: true, email: true } } },
    orderBy: { dateEnvoi: 'desc' },
  });
  res.json({ messages });
};

export const getMessage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) {
    throw new AppError('Message introuvable.', 404);
  }
  if (message.expediteurId !== userId && message.destinataireId !== userId) {
    throw new AppError('Accès interdit à ce message.', 403);
  }
  res.json({ message });
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const expediteurId = (req as any).user?.id;
  const { destinataireId, sujet, contenu } = req.body;

  const message = await prisma.message.create({
    data: { expediteurId, destinataireId, sujet, contenu },
    include: { expediteur: { select: { firstName: true, lastName: true, email: true } }, destinataire: { select: { firstName: true, lastName: true, email: true } } },
  });
  res.status(201).json({ message });
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  const message = await prisma.message.update({
    where: { id },
    data: { lu: true },
  });
  if (message.destinataireId !== userId) {
    throw new AppError('Accès interdit.', 403);
  }
  res.json({ message });
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.message.delete({ where: { id } });
  res.json({ message: 'Message supprimé.' });
};

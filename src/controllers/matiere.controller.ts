import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listMatieres = async (req: Request, res: Response): Promise<void> => {
  const { etablissementId } = req.query;
  const matieres = await prisma.matiere.findMany({
    where: etablissementId ? { etablissementId: String(etablissementId) } : {},
    orderBy: { nom: 'asc' },
  });
  res.json({ matieres });
};

export const getMatiere = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const matiere = await prisma.matiere.findUnique({ where: { id } });
  if (!matiere) {
    throw new AppError('Matière introuvable.', 404);
  }
  res.json({ matiere });
};

export const createMatiere = async (req: Request, res: Response): Promise<void> => {
  const { nom, code, coefficient, etablissementId } = req.body;
  const matiere = await prisma.matiere.create({
    data: { nom, code, coefficient: coefficient ? Number(coefficient) : 1, etablissementId },
  });
  res.status(201).json({ matiere });
};

export const updateMatiere = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nom, code, coefficient } = req.body;
  const matiere = await prisma.matiere.update({
    where: { id },
    data: { ...(nom !== undefined && { nom }), ...(code !== undefined && { code }), ...(coefficient !== undefined && { coefficient: Number(coefficient) }) },
  });
  res.json({ matiere });
};

export const deleteMatiere = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.matiere.delete({ where: { id } });
  res.json({ message: 'Matière supprimée.' });
};

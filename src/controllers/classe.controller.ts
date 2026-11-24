import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listClasses = async (_req: Request, res: Response): Promise<void> => {
  const classes = await prisma.classe.findMany({
    include: { _count: { select: { eleves: true } }, anneeScolaire: true },
    orderBy: { nom: 'asc' },
  });
  res.json({ classes });
};

export const getClasse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const classe = await prisma.classe.findUnique({
    where: { id },
    include: { eleves: { include: { user: { select: { firstName: true, lastName: true, email: true } } } }, anneeScolaire: true },
  });
  if (!classe) {
    throw new AppError('Classe introuvable.', 404);
  }
  res.json({ classe });
};

export const createClasse = async (req: Request, res: Response): Promise<void> => {
  const { nom, niveau, salleReference, etablissementId, anneeScolaireId } = req.body;
  const classe = await prisma.classe.create({
    data: { nom, niveau, salleReference, etablissementId, anneeScolaireId },
  });
  res.status(201).json({ classe });
};

export const updateClasse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nom, niveau, salleReference, anneeScolaireId } = req.body;
  const classe = await prisma.classe.update({
    where: { id },
    data: { ...(nom !== undefined && { nom }), ...(niveau !== undefined && { niveau }), ...(salleReference !== undefined && { salleReference }), ...(anneeScolaireId !== undefined && { anneeScolaireId }) },
  });
  res.json({ classe });
};

export const deleteClasse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.classe.delete({ where: { id } });
  res.json({ message: 'Classe supprimée.' });
};

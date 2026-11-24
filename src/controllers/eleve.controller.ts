import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listEleves = async (req: Request, res: Response): Promise<void> => {
  const { classeId } = req.query;
  const eleves = await prisma.eleve.findMany({
    where: classeId ? { classeId: String(classeId) } : {},
    include: { classe: true, user: { select: { email: true, firstName: true, lastName: true } } },
    orderBy: { user: { lastName: 'asc' } },
  });
  res.json({ eleves });
};

export const getEleve = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const eleve = await prisma.eleve.findUnique({
    where: { id },
    include: { classe: true, user: true, notes: { include: { matiere: true, professeur: { select: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { dateEvaluation: 'desc' }, take: 20 }, absences: { orderBy: { date: 'desc' }, take: 20 } },
  });
  if (!eleve) {
    throw new AppError('Élève introuvable.', 404);
  }
  res.json({ eleve });
};

export const createEleve = async (req: Request, res: Response): Promise<void> => {
  const { matricule, dateNaissance, lieuNaissance, adresse, classeId, email, password, firstName, lastName, phone } = req.body;

  const user = await prisma.user.create({
    data: { email, password, firstName, lastName, phone, role: 'ELEVE' },
  });

  const eleve = await prisma.eleve.create({
    data: {
      matricule,
      dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
      lieuNaissance,
      adresse,
      classeId,
      userId: user.id,
    },
    include: { classe: true, user: true },
  });
  res.status(201).json({ eleve });
};

export const updateEleve = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { matricule, dateNaissance, lieuNaissance, adresse, classeId } = req.body;
  const eleve = await prisma.eleve.update({
    where: { id },
    data: { ...(matricule !== undefined && { matricule }), ...(dateNaissance !== undefined && { dateNaissance: new Date(dateNaissance) }), ...(lieuNaissance !== undefined && { lieuNaissance }), ...(adresse !== undefined && { adresse }), ...(classeId !== undefined && { classeId }) },
    include: { classe: true },
  });
  res.json({ eleve });
};

export const deleteEleve = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const eleve = await prisma.eleve.findUnique({ where: { id }, select: { userId: true } });
  if (!eleve) {
    throw new AppError('Élève introuvable.', 404);
  }
  await prisma.user.delete({ where: { id: eleve.userId } });
  await prisma.eleve.delete({ where: { id } });
  res.json({ message: 'Élève supprimé.' });
};

import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listAbsences = async (req: Request, res: Response): Promise<void> => {
  const { eleveId, coursId, anneeScolaireId, justifiee } = req.query;
  const absences = await prisma.absence.findMany({
    where: {
      ...(eleveId ? { eleveId: String(eleveId) } : {}),
      ...(coursId ? { coursId: String(coursId) } : {}),
      ...(anneeScolaireId ? { anneeScolaireId: String(anneeScolaireId) } : {}),
      ...(justifiee !== undefined ? { justifiee: justifiee === 'true' } : {}),
    },
    include: { eleve: { select: { matricule: true, user: { select: { firstName: true, lastName: true } } } }, cours: true, professeur: { select: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: { date: 'desc' },
  });
  res.json({ absences });
};

export const getAbsence = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const absence = await prisma.absence.findUnique({ where: { id }, include: { eleve: true, cours: true, professeur: true } });
  if (!absence) {
    throw new AppError('Absence introuvable.', 404);
  }
  res.json({ absence });
};

export const createAbsence = async (req: Request, res: Response): Promise<void> => {
  const { date, justifiee, motif, type, eleveId, coursId, professeurId, anneeScolaireId } = req.body;
  const absence = await prisma.absence.create({
    data: {
      date: date ? new Date(date) : new Date(),
      justifiee: justifiee === true || justifiee === 'true',
      motif,
      type,
      eleveId,
      coursId: coursId || undefined,
      professeurId,
      anneeScolaireId,
    },
    include: { eleve: true, cours: true },
  });
  res.status(201).json({ absence });
};

export const updateAbsence = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { justifiee, motif } = req.body;
  const absence = await prisma.absence.update({
    where: { id },
    data: { ...(justifiee !== undefined && { justifiee: justifiee === true || justifiee === 'true' }), ...(motif !== undefined && { motif }) },
  });
  res.json({ absence });
};

export const deleteAbsence = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.absence.delete({ where: { id } });
  res.json({ message: 'Absence supprimée.' });
};

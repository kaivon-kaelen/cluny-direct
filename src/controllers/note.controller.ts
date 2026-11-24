import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listNotes = async (req: Request, res: Response): Promise<void> => {
  const { eleveId, matiereId, anneeScolaireId } = req.query;
  const notes = await prisma.note.findMany({
    where: {
      ...(eleveId ? { eleveId: String(eleveId) } : {}),
      ...(matiereId ? { matiereId: String(matiereId) } : {}),
      ...(anneeScolaireId ? { anneeScolaireId: String(anneeScolaireId) } : {}),
    },
    include: { eleve: { select: { matricule: true, user: { select: { firstName: true, lastName: true } } } }, matiere: true, professeur: { select: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: { dateEvaluation: 'desc' },
  });
  res.json({ notes });
};

export const getNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const note = await prisma.note.findUnique({ where: { id }, include: { eleve: true, matiere: true, professeur: true } });
  if (!note) {
    throw new AppError('Note introuvable.', 404);
  }
  res.json({ note });
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  const { valeur, sur, coeff, type, libelle, dateEvaluation, eleveId, matiereId, professeurId, anneeScolaireId } = req.body;
  const note = await prisma.note.create({
    data: {
      valeur: Number(valeur),
      sur: sur ? Number(sur) : 20,
      coeff: coeff ? Number(coeff) : 1,
      type,
      libelle,
      dateEvaluation: dateEvaluation ? new Date(dateEvaluation) : new Date(),
      eleveId,
      matiereId,
      professeurId,
      anneeScolaireId,
    },
    include: { matiere: true, eleve: { select: { matricule: true, user: { select: { firstName: true, lastName: true } } } } },
  });
  res.status(201).json({ note });
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { valeur, sur, coeff, type, libelle, dateEvaluation } = req.body;
  const note = await prisma.note.update({
    where: { id },
    data: { ...(valeur !== undefined && { valeur: Number(valeur) }), ...(sur !== undefined && { sur: Number(sur) }), ...(coeff !== undefined && { coeff: Number(coeff) }), ...(type !== undefined && { type }), ...(libelle !== undefined && { libelle }), ...(dateEvaluation !== undefined && { dateEvaluation: new Date(dateEvaluation) }) },
  });
  res.json({ note });
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.note.delete({ where: { id } });
  res.json({ message: 'Note supprimée.' });
};

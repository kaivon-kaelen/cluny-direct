import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listCours = async (req: Request, res: Response): Promise<void> => {
  const { classeId, professeurId, anneeScolaireId } = req.query;
  const cours = await prisma.cours.findMany({
    where: {
      ...(classeId ? { classeId: String(classeId) } : {}),
      ...(professeurId ? { professeurId: String(professeurId) } : {}),
      ...(anneeScolaireId ? { anneeScolaireId: String(anneeScolaireId) } : {}),
    },
    include: { classe: true, matiere: true, professeur: { select: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: [{ jourSemaine: 'asc' }, { heureDebut: 'asc' }],
  });
  res.json({ cours });
};

export const getCours = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const cours = await prisma.cours.findUnique({ where: { id }, include: { classe: true, matiere: true, professeur: true } });
  if (!cours) {
    throw new AppError('Cours introuvable.', 404);
  }
  res.json({ cours });
};

export const createCours = async (req: Request, res: Response): Promise<void> => {
  const { titre, jourSemaine, heureDebut, heureFin, salle, classeId, matiereId, professeurId, anneeScolaireId } = req.body;
  const cours = await prisma.cours.create({
    data: { titre, jourSemaine: Number(jourSemaine), heureDebut: Number(heureDebut), heureFin: Number(heureFin), salle, classeId, matiereId, professeurId, anneeScolaireId },
  });
  res.status(201).json({ cours });
};

export const updateCours = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { titre, salle, jourSemaine, heureDebut, heureFin } = req.body;
  const cours = await prisma.cours.update({
    where: { id },
    data: { ...(titre !== undefined && { titre }), ...(salle !== undefined && { salle }), ...(jourSemaine !== undefined && { jourSemaine: Number(jourSemaine) }), ...(heureDebut !== undefined && { heureDebut: Number(heureDebut) }), ...(heureFin !== undefined && { heureFin: Number(heureFin) }) },
  });
  res.json({ cours });
};

export const deleteCours = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.cours.delete({ where: { id } });
  res.json({ message: 'Cours supprimé.' });
};

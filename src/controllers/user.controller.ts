import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ users });
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, isActive: true, createdAt: true },
  });
  if (!user) {
    throw new AppError('Utilisateur introuvable.', 404);
  }
  res.json({ user });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { firstName, lastName, phone, isActive, role } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { ...(firstName !== undefined && { firstName }), ...(lastName !== undefined && { lastName }), ...(phone !== undefined && { phone }), ...(isActive !== undefined && { isActive }), ...(role !== undefined && { role }) },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, isActive: true },
  });
  res.json({ user });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'Utilisateur supprimé.' });
};

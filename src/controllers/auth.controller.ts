import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateUser, createUser, RegisterInput, LoginInput } from '../services/auth.service';
import prisma from '../config/database';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  body('firstName').trim().notEmpty().withMessage('Prénom requis.'),
  body('lastName').trim().notEmpty().withMessage('Nom requis.'),
  body('role').isIn(['ADMIN', 'PROFESSEUR', 'ELEVE', 'PARENT']).withMessage('Rôle invalide.'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide.'),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
];

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Données invalides.', details: errors.array() });
    return;
  }
  next();
};

export const register = async (req: Request, res: Response): Promise<void> => {
  handleValidationErrors(req, res, () => {});
  const input: RegisterInput = req.body;
  try {
    const user = await createUser(input);
    res.status(201).json({
      message: 'Compte créé avec succès.',
      user,
    });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Erreur lors de l\'inscription.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  handleValidationErrors(req, res, () => {});
  const input: LoginInput = req.body;
  try {
    const result = await authenticateUser(input);
    res.cookie('token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: 'Connexion réussie.',
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Erreur lors de la connexion.' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie.' });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Non authentifié.' });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, isActive: true },
    });
    if (!user) {
      res.status(404).json({ error: 'Utilisateur introuvable.' });
      return;
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la récupération du profil.' });
  }
};

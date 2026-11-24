import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';

const JWT_SECRET: jwt.Secret = (process.env.JWT_SECRET || 'default_secret_change_me') as jwt.Secret;
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PROFESSEUR' | 'ELEVE' | 'PARENT';
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const signToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

export const createUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    const err: any = new Error('Cet email est déjà utilisé.');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: input.role,
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });

  return user;
};

export const authenticateUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    const err: any = new Error('Identifiants invalides.');
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(input.password, user.password);
  if (!valid) {
    const err: any = new Error('Identifiants invalides.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user.id, user.email, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token,
  };
};

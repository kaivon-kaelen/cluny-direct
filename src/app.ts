import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eleveRoutes from './routes/eleve.routes';
import classeRoutes from './routes/classe.routes';
import matiereRoutes from './routes/matiere.routes';
import coursRoutes from './routes/cours.routes';
import noteRoutes from './routes/note.routes';
import absenceRoutes from './routes/absence.routes';
import messageRoutes from './routes/message.routes';

import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'clunydirect-serveur', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/matieres', matiereRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import app from './app';
import prisma from './config/database';

const PORT = process.env.PORT || 45008;

const start = async () => {
  try {
    await prisma.$connect();
    console.log('[DB] Connecté à PostgreSQL');

    app.listen(PORT, () => {
      console.log(`[API] Serveur démarré sur http://localhost:${PORT}`);
      console.log(`[API] Environnement : ${process.env.NODE_ENV || 'development'}`);
      console.log(`[API] Healthcheck : http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('[FATAL] Impossible de démarrer le serveur :', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();

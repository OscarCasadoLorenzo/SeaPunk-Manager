import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import attributeRoutes from './routes/attributes';
import auraGiftRoutes from './routes/auraGifts';
import characterAuraGiftRoutes from './routes/characterAuraGifts';
import characterEssenceRoutes from './routes/characterEssences';
import characterRoutes from './routes/characters';
import combatStatsRoutes from './routes/combatStats';
import domainRoutes from './routes/domains';
import effectRoutes from './routes/effects';
import essenceRoutes from './routes/essences';
import inventoryRoutes from './routes/inventories';
import narrativeRoutes from './routes/narratives';
import playerRoutes from './routes/players';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';

// Load environment variables
config();

// Initialize Prisma client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['file://', 'app://'] // Allow Electron origins
        : ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow development origins
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/combat-stats', combatStatsRoutes);
app.use('/api/narratives', narrativeRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/effects', effectRoutes);
app.use('/api/essences', essenceRoutes);
app.use('/api/aura-gifts', auraGiftRoutes);
app.use('/api/character-essences', characterEssenceRoutes);
app.use('/api/character-aura-gifts', characterAuraGiftRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Something went wrong!',
    });
  }
);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { QUESTIONS } from './src/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Swagger setup
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'TOSA Excel Prep API',
        version: '1.0.0',
        description: 'API pour le simulateur de test TOSA Excel 365',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
        },
      ],
    },
    apis: ['./server.ts'], // Path to the API docs
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @openapi
   * /api/questions:
   *   get:
   *     description: Récupère la liste complète des questions du test TOSA
   *     responses:
   *       200:
   *         description: Succès
   */
  app.get('/api/questions', (req, res) => {
    res.json(QUESTIONS);
  });

  /**
   * @openapi
   * /api/health:
   *   get:
   *     description: Vérifie l'état du serveur
   *     responses:
   *       200:
   *         description: OK
   */
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📖 Documentation Swagger sur http://localhost:${PORT}/api-docs`);
  });
}

startServer();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleBusArrival } from './api/busArrival';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Backend API Status & Health endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(
      process.env.LTA_DATAMALL_API_KEY ||
      process.env.DATAMALL_API_KEY ||
      process.env.LTA_API_KEY
    );

    res.json({
      status: 'ok',
      service: 'SBS Transit Bus API Proxy',
      ltaApiVersion: 'v3',
      credentialsConfigured: hasKey,
      timestamp: new Date().toISOString(),
    });
  });

  // Next buses at a stop (v3) LTA DataMall proxy
  app.get('/api/bus-arrival', handleBusArrival);
  app.get('/api/BusArrival', handleBusArrival);
  app.get('/api/lta/bus-arrival', handleBusArrival);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SBS Transit API server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

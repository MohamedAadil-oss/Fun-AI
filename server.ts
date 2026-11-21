import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  GeminiConfigError,
  GeminiUpstreamError,
  generateTwistCards,
  generateWorldDeck,
} from './server/gemini';
import type { MeterDefinition } from './src/game/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    const key = process.env.GEMINI_API_KEY?.trim();
    res.json({
      ok: true,
      hasApiKey: Boolean(key && key !== 'MY_GEMINI_API_KEY'),
    });
  });

  app.post('/api/worlds/generate', async (req, res) => {
    try {
      const premise = typeof req.body?.premise === 'string' ? req.body.premise.trim() : '';
      const tone = typeof req.body?.tone === 'string' && req.body.tone.trim()
        ? req.body.tone.trim()
        : 'Whimsical Satire';

      if (premise.length < 6) {
        res.status(400).json({
          error: 'Please enter a world premise of at least 6 characters.',
          code: 'INVALID_PREMISE',
        });
        return;
      }

      if (premise.length > 280) {
        res.status(400).json({
          error: 'Please keep the premise under 280 characters.',
          code: 'PREMISE_TOO_LONG',
        });
        return;
      }

      const world = await generateWorldDeck(premise, tone);
      res.json({ world });
    } catch (err) {
      if (err instanceof GeminiConfigError || err instanceof GeminiUpstreamError) {
        res.status(err.status).json({ error: err.message, code: err.code });
        return;
      }
      const message = err instanceof Error ? err.message : 'Unexpected server error.';
      res.status(500).json({ error: message, code: 'INTERNAL_ERROR' });
    }
  });

  app.post('/api/worlds/twist', async (req, res) => {
    try {
      const worldTitle = typeof req.body?.worldTitle === 'string' ? req.body.worldTitle.trim() : '';
      const worldPremise = typeof req.body?.worldPremise === 'string' ? req.body.worldPremise.trim() : '';
      const tone = typeof req.body?.tone === 'string' ? req.body.tone.trim() : 'Whimsical Satire';
      const meters = Array.isArray(req.body?.meters) ? (req.body.meters as MeterDefinition[]) : [];
      const meterValues =
        req.body?.meterValues && typeof req.body.meterValues === 'object'
          ? (req.body.meterValues as Record<string, number>)
          : {};
      const recentHistory = Array.isArray(req.body?.recentHistory)
        ? req.body.recentHistory
        : [];

      if (!worldTitle || meters.length !== 4) {
        res.status(400).json({
          error: 'Invalid world context for generating twist cards.',
          code: 'INVALID_TWIST_REQUEST',
        });
        return;
      }

      const cards = await generateTwistCards({
        worldTitle,
        worldPremise,
        tone,
        meters,
        meterValues,
        recentHistory,
      });

      res.json({ cards });
    } catch (err) {
      if (err instanceof GeminiConfigError || err instanceof GeminiUpstreamError) {
        res.status(err.status).json({ error: err.message, code: err.code });
        return;
      }
      const message = err instanceof Error ? err.message : 'Unexpected server error.';
      res.status(500).json({ error: message, code: 'INTERNAL_ERROR' });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*path', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlotDeck server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

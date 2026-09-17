import { Router } from 'express';
import { adminDataService } from './adminDataService';

export const publicRouter = Router();

/**
 * GET /api/public/data-transparency
 * Public transparency endpoint: Provides complete information about data sources,
 * official verification status, and admission criteria without exposing internal secrets or requiring login.
 */
publicRouter.get('/data-transparency', (_req, res) => {
  const transparency = adminDataService.getPublicTransparency();
  return res.json(transparency);
});

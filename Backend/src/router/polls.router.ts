import { Router } from "express";

import pollsRoutes from "./routes/pollsRoutes";

const router: Router = Router();

export const pollsRouter = (): Router => {
  pollsRoutes(router);
  return router;
};

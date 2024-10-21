import { Router } from "express";
import authenticationRoutes from "./routes/authenticationRoutes";

const router: Router = Router();

export const authRouter = (): Router => {
  authenticationRoutes(router);
  return router;
};

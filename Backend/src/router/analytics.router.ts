import analyticsRoutes from "./routes/analyticsRoutes";
import {Router} from "express";

const router: Router = Router();

export const analyticsRouter = (): Router => {
    analyticsRoutes(router);
    return router;
};

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import categoriesRouter from "./categories";
import ticketsRouter from "./tickets";
import registrationsRouter from "./registrations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(categoriesRouter);
router.use(ticketsRouter);
router.use(registrationsRouter);

export default router;

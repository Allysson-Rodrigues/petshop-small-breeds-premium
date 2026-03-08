import { Router } from "express";
import appointmentsRoutes from "./appointments-routes.js";
import clientsRoutes from "./clients-routes.js";
import dashboardSummaryRoutes from "./dashboard-summary-routes.js";
import petsRoutes from "./pets-routes.js";
import productsRoutes from "./products-routes.js";

const router = Router();

router.use(dashboardSummaryRoutes);
router.use(petsRoutes);
router.use(appointmentsRoutes);
router.use(clientsRoutes);
router.use(productsRoutes);

export default router;

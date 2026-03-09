import { Router } from "express";
import appointmentsRoutes from "./dashboard/appointments-routes.js";
import bookingRequestsRoutes from "./dashboard/booking-requests-routes.js";
import clientsRoutes from "./dashboard/clients-routes.js";
import overviewRoutes from "./dashboard/overview-routes.js";
import petsRoutes from "./dashboard/pets-routes.js";
import productsRoutes from "./dashboard/products-routes.js";

const router = Router();
router.use("/", overviewRoutes);
router.use("/pets", petsRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/booking-requests", bookingRequestsRoutes);
router.use("/clients", clientsRoutes);
router.use("/products", productsRoutes);

export default router;

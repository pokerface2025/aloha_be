import { Router } from "express";
import boldRoutes from "./bold/boldRoutes.js";

const expressRoutesList = Router()
expressRoutesList.use(boldRoutes)

export default expressRoutesList
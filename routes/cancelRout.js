import express from "express";
import { cancelController } from "../controllers/cancelC.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { isAuthenticated, isAdmin } = isAuthorized;
const router = express.Router();

router.post("/cancel-order", isAdmin, isAuthenticated, cancelController);

export default router;

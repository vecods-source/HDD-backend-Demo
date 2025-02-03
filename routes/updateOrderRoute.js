import express from "express";
import { updateOrder } from "../controllers/updateOrder.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";
const { isDriver, isAuthenticated } = isAuthorized;
const router = express.Router();

router.post("/update-order", isAuthenticated, isDriver, updateOrder);

export default router;

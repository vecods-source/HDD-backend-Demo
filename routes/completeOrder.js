import { completeOrder } from "../controllers/completeOrder.js";
import express from "express";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { isAuthenticated, isAdmin } = isAuthorized;
const route = express.Router();

route.patch("/complete-order", isAuthenticated, isAdmin, completeOrder);

export default route;

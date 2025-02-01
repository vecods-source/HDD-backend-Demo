import express from "express";
import orders from "../controllers/orderController.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { isAuthenticated, isAdmin } = isAuthorized;

const { inserOrder, getOrders } = orders;
const route = express.Router();

route.get("/get-orders", isAuthenticated, isAdmin, getOrders);
route.post("/insert-order", isAuthenticated, isAdmin, inserOrder);

export default route;

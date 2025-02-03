import express from "express";
import { connectOrderDriver } from "../controllers/driverCon.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { isAuthenticated, isDriver } = isAuthorized;
const route = express.Router();

route.post("/get-driver-order", isAuthenticated, isDriver, connectOrderDriver);

export default route;

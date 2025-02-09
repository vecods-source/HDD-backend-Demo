import { batterySerials } from "../controllers/getBattDetDriver.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";
import express from "express";

const route = express.Router();
const { isAuthenticated, isDriver } = isAuthorized;

route.post("/get-battery-serials", isAuthenticated, isDriver, batterySerials);

export default route;

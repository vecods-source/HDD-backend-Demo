import express from "express";
import batteryDet from "../controllers/battDetController.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { isAuthenticated, isAdmin } = isAuthorized;
const { battDet } = batteryDet;
const route = express.Router();
route.post("/get-battery-det", isAuthenticated, isAdmin, battDet);

export default route;
